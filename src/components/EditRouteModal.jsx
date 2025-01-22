import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import RouteForm from './RouteForm';

const EditRouteModal = ({ isOpen, onClose, routeId, onUpdate }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    routeId: '',
    driver: '',
    date: '',
    notes: '',
    orders: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoute = async () => {
      if (!routeId) return;
      
     

      try {
        const response = await fetch(`http://localhost:5000/routes-data/${routeId}`);
       {/* console.log('Response status:', response.status); // Log del status*/}

        if (!response.ok) {
          throw new Error('Error al obtener la ruta');
        }

        const result = await response.json();
       {/*  console.log('Route data received:', result); // Log de datos recibidos*/}

        const orders = result.data.map(item => ({
          id: item.orders[0].id,
          sequence: item.orders[0].sequence,
          value: Number(item.orders[0].value).toFixed(2),
          priority: item.orders[0].priority || false
        }));

        const formattedData = {
          routeId: result.data[0].id.toString(),
          driver: result.data[0].driverId.toString(),
          date: new Date(result.data[0].fecha).toISOString().split('T')[0],
          notes: result.data[0].notes || '',
          orders: orders.sort((a, b) => a.sequence - b.sequence)
        };

        {/*  console.log('Formatted data:', formattedData); // Log de datos formateados */}
        setFormData(formattedData);
      } catch (err) {
        console.error('Error fetching route:', err);
        setError('Error al cargar la ruta');
      }
    };

    fetchRoute();
  }, [routeId]);

  const handleSave = async () => {
    {/*  console.log('Saving data:', formData); // Log de datos a guardar*/}

    try {
      const response = await fetch(`http://localhost:5000/routes/${routeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la ruta');
      }

      const result = await response.json();
       {/* console.log('Save response:', result); // Log de respuesta del guardado */}

      onUpdate(formData);
      onClose();
    } catch (err) {
      console.error('Error saving:', err);
      setError('Error al guardar la ruta');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center bg-blue-600">
          <h2 className="text-xl font-semibold text-white">Editar Ruta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <RouteForm 
            formData={formData}
            setFormData={setFormData}
            isEditing={true}
          />
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRouteModal;