import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

const RouteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    routeId: '',
    driver: '',
    date: '',
    notes: '',
    orders: [
      { id: 1, order: '', value: '', priority: false }
    ]
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
     
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Añadir ruta</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

       
        <div className="p-4">
          <form className="space-y-4">
            
            <div>
              <input
                type="text"
                placeholder="78901"
                className="w-full p-2 border rounded"
              />
            </div>

        
            <div>
              <select className="w-full p-2 border rounded">
                <option>Carlos Contreras</option>
              </select>
            </div>

     
            <div className="relative">
              <input
                type="date"
                className="w-full p-2 border rounded"
                defaultValue="2024-11-19"
              />
              <Calendar className="absolute right-2 top-2.5 text-gray-500" size={20} />
            </div>

        
            <div>
              <textarea
                placeholder="Notas"
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

      
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Orden</th>
                    <th className="p-2 border">Valor</th>
                    <th className="p-2 border">Prioritario</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.orders.map((order, index) => (
                    <tr key={order.id}>
                      <td className="p-2 border text-center">{index + 1}</td>
                      <td className="p-2 border">
                        <input type="text" className="w-full p-1 border rounded" />
                      </td>
                      <td className="p-2 border">
                        <input type="number" step="0.01" className="w-full p-1 border rounded" />
                      </td>
                      <td className="p-2 border text-center">
                        <input type="checkbox" className="w-4 h-4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

         
            <div className="text-right">
              <p className="font-semibold">Valor total: $86.35</p>
            </div>
          </form>
        </div>

         
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
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