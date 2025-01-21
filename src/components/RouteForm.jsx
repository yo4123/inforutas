import { useState } from 'react';
import { Calendar } from 'lucide-react';

const RouteForm = ({ formData, setFormData }) => {
  const calculateTotal = () => {
    return formData.orders.reduce((sum, order) => sum + (Number(order.value) || 0), 0).toFixed(2);
  };

  return (
    <form className="space-y-4">
       
      <div>
        <input
          type="text"
          value={formData.routeId}
          onChange={(e) => setFormData({...formData, routeId: e.target.value})}
          placeholder="ID de ruta"
          className="w-full p-2 border rounded"
        />
      </div>

    
      <div>
        <select 
          value={formData.driver}
          onChange={(e) => setFormData({...formData, driver: e.target.value})}
          className="w-full p-2 border rounded"
        >
          <option value="10">Carlos Contreras</option>
        </select>
      </div>

   
      <div className="relative">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full p-2 border rounded"
        />
        <Calendar className="absolute right-2 top-2.5 text-gray-500" size={20} />
      </div>

      
      <div>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
                <td className="p-2 border text-center">{order.sequence}</td>
                <td className="p-2 border">
                  <input 
                    type="text" 
                    value={order.id}
                    readOnly
                    className="w-full p-1 border rounded" 
                  />
                </td>
                <td className="p-2 border">
                  <input 
                    type="number" 
                    value={order.value}
                    onChange={(e) => {
                      const newOrders = [...formData.orders];
                      newOrders[index].value = e.target.value;
                      setFormData({...formData, orders: newOrders});
                    }}
                    step="0.01" 
                    className="w-full p-1 border rounded" 
                  />
                </td>
                <td className="p-2 border text-center">
                  <input 
                    type="checkbox" 
                    checked={order.priority}
                    onChange={(e) => {
                      const newOrders = [...formData.orders];
                      newOrders[index].priority = e.target.checked;
                      setFormData({...formData, orders: newOrders});
                    }}
                    className="w-4 h-4" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="text-right">
        <p className="font-semibold">Valor total: ${calculateTotal()}</p>
      </div>
    </form>
  );
};

export default RouteForm;