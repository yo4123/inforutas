# Información de Rutas de Entrega

La aplicación consiste en un sistema de información de rutas de entrega, en el que el usuario puede ver las rutas que están en el sistema, editar información de las rutas y crear nuevas rutas a partir de datos sincronizados de un servicio externo.

## Ejecución desde la consola

### Manualmente

Para ejecutar la aplicación, abrir tres terminales diferentes y ejecutar los siguientes comandos:

- En la primera terminal: `node server.js`
- En la segunda terminal: `json-server --watch db.json --port 3000`
- En la tercera terminal: `npm run dev`

### Todos los comandos a la vez

- Desde la raíz del proyecto ejecutar: `npm run dev`: `npm run start`

## Componentes

La aplicación utiliza los siguientes componentes:

- `ImportCSVModal.jsx`: sirve para importar los csv con el listado de conductores
- `EditRouteModal.jsx`: el cual sirve para llamar el modal de vista y edición
- `RoutesTable.jsx`: se utiliza para separar la tabla de `app.jsx` y manejar la tabla principal
- `RouteForm.jsx`: contiene la parte editable y de guardado de rutas
- `RouteModal.jsx`: es el modal que se utiliza para añadir una nueva ruta

## Servidor

El servidor se encuentra en el archivo `server.js` y utiliza la base de datos `delivery_routes_db` para almacenar datos.

## Base de datos

La base de datos utiliza un esquema de tres tablas:

- `drivers`: tabla de conductores con la columna `name`
- `delivery_routes`: tabla de rutas con la columna `driver_id` que referencia la tabla `drivers`
- `orders`: tabla de órdenes con la columna `route_id` que referencia la tabla `delivery_routes`

Una copia de la base de datos se puede encontrar en el archivo `delivery_routes.sql` en la raiz

### Esquema de las Tablas

A continuación se muestra el esquema base de las tablas:

```sql
-- Tabla de conductores
CREATE TABLE drivers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tabla de rutas
CREATE TABLE delivery_routes (
    id INTEGER PRIMARY KEY,
    driver_id INTEGER REFERENCES drivers(id),
    scheduled_date TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    route_id INTEGER REFERENCES delivery_routes(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    is_priority BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



## Requisitos

- Node.js 16+
- Vite 5.3.4
- React 18.3.1
- Postgres 13+


## Tecnologías Utilizadas

En la siguiente lista se muestran las tecnologías utilizadas en el proyecto:

* **Node.js**: Plataforma basada en JavaScript que permite ejecutar código del lado del servidor. Se utiliza para crear un API que maneja la lógica de negocio de la aplicación.
* **Express.js**: Framework para Node.js que facilita la creación de aplicaciones web. En esta aplicación, Express se utiliza para definir y manejar las rutas de la API.
* **PostgreSQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar datos sobre conductores, rutas y órdenes. La conexión a esta base de datos se gestiona a través del paquete `pg`.
* **JSON Server**: Herramienta que permite crear un API RESTful a partir de un archivo JSON (`db.json`). Sirve como una solución rápida para simular un backend en desarrollo.
* **React**: Biblioteca de JavaScript para construir interfaces de usuario. Se utiliza aquí para crear componentes que permiten a los usuarios interactuar con la aplicación, como editar rutas y visualizar información.
* **Vite**: Herramienta de construcción y desarrollo que permite un entorno de desarrollo altamente eficiente para aplicaciones de JavaScript modernas. Aquí se usa para desarrollar el frontend en React.
* **Axios**: Biblioteca para realizar solicitudes HTTP desde el frontend hacia el backend. Se utiliza para obtener y enviar datos entre la interfaz de usuario y el servidor.
* **Multer**: Middleware para manejar el `multipart/form-data`, utilizado principalmente para subir archivos. En este caso, se usa para importar datos desde archivos CSV.
* **Tailwind CSS**: Framework de CSS que facilita la creación de diseños responsivos y modernos, empleado para estilizar la interfaz de usuario.
* **Concurrently**: Herramienta que permite ejecutar múltiples comandos de `npm` simultáneamente. En este proyecto, se utiliza para poner en marcha el servidor, el JSON server y el entorno de desarrollo de Vite al mismo tiempo.

## Licencia

La aplicación se distribuye bajo la licencia MIT.
```
