import { useState } from 'react';
import { X, Search } from 'lucide-react';
import RouteForm from './RouteForm';

const RouteModal = ({ isOpen, onClose, onSave = () => {}, refreshTable }) => {
  if (!isOpen) return null;

  const [searchRouteId, setSearchRouteId] = useState('');
  const [formData, setFormData] = useState({
    routeId: '',
    driver: '',
    date: '',
    notes: '',
    orders: [
      { id: 1, sequence: 1, value: '', priority: false }
    ]
  });
  const [error, setError] = useState('');

  const searchRoute = async () => {
    try {
      const response = await fetch(`http://localhost:3000/routes/${searchRouteId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Ruta no encontrada');
          return;
        }
        throw new Error('Error en la búsqueda');
      }

      const route = await response.json();
      setFormData({
        routeId: route.id.toString(),
        driver: route.driverId.toString(),
        date: route.date.split('T')[0],
        notes: route.notes || '',
        orders: route.orders.map(order => ({
          id: order.id,
          sequence: order.sequence,
          value: order.value,
          priority: order.priority
        }))
      });
      setError('');
    } catch (err) {
      setError('Error al buscar la ruta');
      console.error('Error:', err);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',   
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la ruta');
      }

      const result = await response.json();
      if (result.success) {
        onSave(formData);
        refreshTable();  
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al guardar la ruta');
      console.error('Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg w-full max-w-md overflow-auto">
        <div className="p-1 border-b flex justify-between items-center bg-[#48c78e]">
          <h5 className="text-sm font-semibold ml-1 text-white">AÑADIR RUTA</h5>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchRouteId}
              onChange={(e) => setSearchRouteId(e.target.value)}
              placeholder="78901"
              className="flex-1 p-2 text-sm border rounded"
            />
            <button
              onClick={searchRoute}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-2"
            >
              <Search size={20} />
              Cargar ruta
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        <div className="p-4">
          <RouteForm 
            formData={formData}
            setFormData={setFormData}
            isEditing={false}
          />
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
            className="px-4 py-2 bg-[#48c78e] hover:bg-[#3aa576] text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div> 
  );
};

export default RouteModal;