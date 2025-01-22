import { useState, useEffect } from 'react';
import axios from 'axios';
import EditRouteModal from './EditRouteModal';
import { Edit, Trash } from 'lucide-react';

const RoutesTable = ({ refreshTrigger }) => {
  const [routes, setRoutes] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/routes');
      if (response.data.success) {
        setRoutes(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener las rutas:', error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [refreshTrigger]);  

  const openEditModal = (route) => {
    setSelectedRouteId(route.id);
    setIsEditModalOpen(true);
  };

  const handleRouteUpdate = (updatedRoute) => {
    setRoutes(routes.map(route => 
      route.id === updatedRoute.routeId ? updatedRoute : route
    ));
    setIsEditModalOpen(false);
    fetchRoutes();  
  };

  const deleteRoute = async (routeId) => {
    if (window.confirm("¿Está seguro que desea eliminar esta ruta?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/routes/${routeId}`);
        if (response.data.success) {
          fetchRoutes();  
          alert('Ruta eliminada exitosamente');
        }
      } catch (error) {
        console.error('Error al eliminar la ruta:', error);
        alert('Error al eliminar la ruta');
      }
    }
  };

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Conductor</th>
            <th className="px-4 py-2 border">Fecha</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td className="px-4 py-2 border">{route.id}</td>
              <td className="px-4 py-2 border">{route.conductor}</td>
              <td className="px-4 py-2 border">
                {new Date(route.fecha).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">
               {/* <button
                  onClick={() => openEditModal(route)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteRoute(route.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2"
                >
                  Eliminar
                </button>*/}
               <button
                onClick={() => openEditModal(route)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                <Edit className="inline mr-1" />  
                Ver
              </button>
              <button
                onClick={() => deleteRoute(route.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2"
              >
                <Trash className="inline mr-1" />  
                Eliminar
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditRouteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRouteId(null);
        }}
        routeId={selectedRouteId}
        onUpdate={handleRouteUpdate}
      />
    </div>
  );
};

export default RoutesTable;