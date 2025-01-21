import { useState } from 'react'
import './App.css'
import RouteModal from './components/RouteModal'  

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="container w-screen">
        <div className="flex">
          <h1 className="text-2xl font-bold">Lista de Rutas</h1>
        </div>
      </div>

      <div className="main">
        <div className="text-left pt-5">
          <button 
            onClick={() => setIsModalOpen(true)}  
            className="bg-[#48c78e] hover:bg-[#3aa576] text-white font-bold py-2 px-4 rounded"
          >
            Añadir Ruta
          </button>
        </div>

        <div className="overflow-x-auto pt-5">
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
              <tr>
                <td className="px-4 py-2 border">234258</td>
                <td className="px-4 py-2 border">10</td>
                <td className="px-4 py-2 border">2024-10-28</td>
                <td className="px-4 py-2 border">Ver+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <RouteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}  // Cierra el modal
      />
    </>
  )
}

export default App