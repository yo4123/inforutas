import express from 'express';
import cors from 'cors';
import pool from './db.js';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para insertar los drivers  
app.post('/import-drivers', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se proporcionó ningún archivo.' });
    }
   
    const filePath = req.file.path;
    try {
        const drivers = [];
        fs.createReadStream(filePath)
            .on('error', (err) => {
                console.error('Error al leer el archivo:', err);
                res.status(500).json({ success: false, message: 'Error al leer el archivo.' });
            })
            .pipe(csvParser())
            .on('data', (row) => {
                drivers.push(row);
            })
            .on('end', async () => {
                const client = await pool.connect();
                try {
                    await client.query('BEGIN');
                    for (const driver of drivers) {
                        const { ID, NAME } = driver;
                        await client.query(
                            'INSERT INTO drivers (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
                            [parseInt(ID), NAME]
                        );
                    }
                    await client.query('COMMIT');
                    
                    
                    try {
                        fs.unlinkSync(filePath);
                    } catch (unlinkError) {
                        console.error('Error al eliminar el archivo:', unlinkError);
                    }
                    
                    res.json({ success: true, message: 'Conductores importados correctamente' });
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error('Error en la transacción:', err);
                    res.status(500).json({ success: false, message: 'Error al importar conductores.' });
                } finally {
                    client.release();
                }
            });
    } catch (err) {
        console.error('Error general:', err);
        res.status(500).json({ success: false, message: 'Error al procesar el archivo.' });
    }
});


// Endpoint para listar rutas
app.get('/routes', async (req, res) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        dr.id AS route_id,
        d.name AS driver_name,
        dr.scheduled_date AS scheduled_date
      FROM 
        delivery_routes dr
      INNER JOIN 
        drivers d 
      ON 
        dr.driver_id = d.id
      ORDER BY dr.scheduled_date DESC;`;

    const result = await client.query(query);

    const routes = result.rows.map((row) => ({
      id: row.route_id,
      conductor: row.driver_name,
      fecha: row.scheduled_date,
      acciones: `/edit-route/${row.route_id}`  
    }));

    res.json({ success: true, data: routes });
  } catch (err) {
    console.error('Error al obtener el listado de rutas:', err);
    res.status(500).json({ success: false, message: 'Error al obtener el listado de rutas.' });
  } finally {
    client.release();
  }
});


// Endpoint para guardar una nueva ruta con sus órdenes
app.post('/routes', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { routeId, driver, date, notes, orders } = req.body;

     
    const routeQuery = `
      INSERT INTO delivery_routes (id, driver_id, scheduled_date, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING id`;
    const routeValues = [parseInt(routeId), parseInt(driver), date, notes];
    await client.query(routeQuery, routeValues);

    
    for (const order of orders) {
      const orderQuery = `
        INSERT INTO orders (id, route_id, sequence, value, is_priority)
        VALUES ($1, $2, $3, $4, $5)`;
      const orderValues = [
        order.id,
        parseInt(routeId),
        order.sequence,
        order.value,
        order.priority
      ];
      await client.query(orderQuery, orderValues);
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Ruta guardada exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al guardar la ruta:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar la ruta',
      error: err.message 
    });
  } finally {
    client.release();
  }
});




// para actualizar  
app.put('/routes/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { driver, date, notes, orders } = req.body;

  
    const updateRouteQuery = `
      UPDATE delivery_routes 
      SET driver_id = $1, scheduled_date = $2, notes = $3 
      WHERE id = $4`;
    await client.query(updateRouteQuery, [driver, date, notes, id]);

   
    await client.query(`DELETE FROM orders WHERE route_id = $1`, [id]);

     
    for (const order of orders) {
      const orderQuery = `
        INSERT INTO orders (id, route_id, sequence, value, is_priority)
        VALUES ($1, $2, $3, $4, $5)`;
      await client.query(orderQuery, [order.id, id, order.sequence, order.value, order.priority]);
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Ruta actualizada exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar la ruta:', err);
    res.status(500).json({ success: false, message: 'Error al actualizar la ruta' });
  } finally {
    client.release();
  }
});



 // obtiene detalles de una ruta específica  
app.get('/routes-data/:id', async (req, res) => {
  const client = await pool.connect();
  const routeId = req.params.id;  
  try {
    const query = `
      SELECT 
        dr.id AS route_id,
        dr.driver_id,
        dr.scheduled_date AS date,
        dr.notes,
        d.name AS driver_name,
        o.id AS order_id,
        o.sequence,
        o.value,
        o.is_priority AS priority
      FROM 
        delivery_routes dr
      LEFT JOIN 
        drivers d ON dr.driver_id = d.id
      LEFT JOIN 
        orders o ON dr.id = o.route_id
      WHERE 
        dr.id = $1`;

    const result = await client.query(query, [routeId]);  

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
    }

    const routeDetails = result.rows.map((row) => ({
      id: row.route_id,
      driverId: row.driver_id,
      fecha: row.date,
      notes: row.notes,
      conductor: row.driver_name,
      orders: row.order_id ? [{
        id: row.order_id,
        sequence: row.sequence,
        value: row.value,
        priority: row.priority
      }] : []
    }));

    res.json({ success: true, data: routeDetails });
  } catch (err) {
    console.error('Error al obtener los detalles de la ruta:', err);
    res.status(500).json({ success: false, message: 'Error al obtener los detalles de la ruta.' });
  } finally {
    client.release();
  }
});



// Endpoint para eliminar  
app.delete('/routes/:id', async (req, res) => {
  const client = await pool.connect();
  const routeId = req.params.id;  
  try {
    await client.query('BEGIN');

 
    await client.query('DELETE FROM orders WHERE route_id = $1', [routeId]);

    
    await client.query('DELETE FROM delivery_routes WHERE id = $1', [routeId]);

    await client.query('COMMIT');
    res.json({ success: true, message: 'Ruta eliminada exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar la ruta:', err);
    res.status(500).json({ success: false, message: 'Error al eliminar la ruta.' });
  } finally {
    client.release();
  }
});


// Endpoint  conductores
app.get('/drivers', async (req, res) => {
  const client = await pool.connect();
  try {
      const result = await client.query('SELECT id, name FROM drivers ORDER BY id ASC');

      const driversList = result.rows.map((row) => ({
          id: row.id,
          name: row.name
      }));

      res.json({ success: true, data: driversList });
  } catch (err) {
      console.error('Error al obtener el listado de conductores:', err);
      res.status(500).json({ success: false, message: 'Error al obtener el listado de conductores.' });
  } finally {
      client.release();
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

