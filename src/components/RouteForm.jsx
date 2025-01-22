import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar } from 'lucide-react';



const RouteForm = ({ formData, setFormData, isEditing = false }) => {
  const [drivers, setDrivers] = useState([]);

   
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/drivers');
     
        if (response.data.success) {
          setDrivers(response.data.data);
        } else {
          console.error('Error fetching drivers:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
  }, []); 

  const calculateTotal = () => {
    return formData.orders.reduce((sum, order) => sum + (Number(order.value) || 0), 0).toFixed(2);
  };

  const handleOrderChange = (index, field, value) => {
    const newOrders = [...formData.orders];
    newOrders[index] = {
      ...newOrders[index],
      [field]: value
    };
    setFormData({
      ...formData,
      orders: newOrders
    });
  };

  return (
    <div className="space-y-3">
    <div className="flex items-center">
      <label className="text-xs text-gray-600 mb-1 w-1/3 text-left">
        ID DE RUTA
      </label>
      <input
        type="text"
        value={formData.routeId}
        onChange={(e) => setFormData({...formData, routeId: e.target.value})}
        className="w-2/3 text-sm border rounded text-left"
        readOnly={isEditing}
      />
    </div>
  
    <div className="flex items-center">
      <label className="text-xs text-gray-600 mb-1 w-1/3 text-left">
        CONDUCTOR
      </label>
      {/*<select 
        value={formData.driver}
        onChange={(e) => setFormData({...formData, driver: e.target.value})}
        className="w-2/3 text-sm border rounded text-center"
      >
        {drivers.map(driver => (
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        ))}
      </select>*/}

<select
        id="driver"
        value={formData.driver || ''}  
        onChange={(e) => setFormData({ ...formData, driverId: e.target.value })} 
        className="w-2/3 text-sm border rounded text-left">
        <option value="">Select a driver</option>
        {drivers.map(driver => (
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        ))}
      </select>
    </div>
  
    <div className="flex items-center">
      <label className="text-xs text-gray-600 mb-1 w-1/3 text-left">
        FECHA
      </label>
      <div className="relative w-2/3">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full text-sm border rounded text-left"
        />
        {/* <Calendar className="absolute right-2 top-2.5 text-gray-400" size={10} /> */}
      </div>
    </div>
  
    <div className="flex items-center">
      <label className="text-xs text-gray-600 mb-1 w-1/3 text-left">
        NOTAS
      </label>
      <textarea
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
        className="w-2/3 text-sm border rounded resize-none"
        rows="2"
      />
    </div>
  
    <div>
      <div className="border rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white border-b">
              <th className="p-1 text-sm text-gray-600 font-normal">Secuencia</th>
              <th className="p-1 text-sm text-gray-600 font-normal">ID Orden</th>
              <th className="p-1 text-sm text-gray-600 font-normal">Valor ($)</th>
              <th className="p-1 text-sm text-gray-600 font-normal">Prioritario</th>
            </tr>
          </thead>
          <tbody>
            {formData.orders.map((order, index) => (
              <tr key={order.id} className="border-b last:border-b-0">
                <td className="text-center">
                  <span className="text-sm">{order.sequence}</span>
                </td>
                <td>
                  <input 
                    type="text" 
                    value={order.id}
                    readOnly
                    className="w-full p-1 border rounded text-center text-sm" 
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    value={order.value}
                    onChange={(e) => handleOrderChange(index, 'value', e.target.value)}
                    step="0.01" 
                    className="w-full p-1 border rounded text-center text-sm" 
                  />
                </td>
                <td className="text-center">
                  <input 
                    type="checkbox" 
                    checked={order.priority}
                    onChange={(e) => handleOrderChange(index, 'priority', e.target.checked)}
                    className="w-4 h-4" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
    <div className="text-right">
      <p className="text-sm font-normal">
        Valor total: <span className="text-blue-600">${calculateTotal()}</span>
      </p>
    </div>
  </div>
  );
};

export default RouteForm;