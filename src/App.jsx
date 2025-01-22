import { useState } from 'react';
import './App.css';
import RoutesTable from './components/RoutesTable';
import RouteModal from './components/RouteModal';
import ImportCSVModal from './components/ImportCSVModal';
import { PlusCircle, Upload } from 'lucide-react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshTable = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const trackEvent = (eventCategory, eventAction, eventLabel) => {
    if (window.gtag) {
      window.gtag('event', eventAction, {
        event_category: eventCategory,
        event_label: eventLabel,
      });
    }
  };

  return (
    <>
      <div className="container w-screen">
        <div className="flex">
          <h1 className="text-2xl font-bold">Lista de Rutas</h1>
        </div>
      </div>

      <div className="main">
        <div className="text-left pt-5">
          {/*<button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#48c78e] hover:bg-[#3aa576] text-white font-bold py-2 px-4 rounded mr-2"
          >
            <PlusCircle className="inline mr-2" />
            Añadir Ruta
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            <Upload className="inline mr-2" />
            Importar CSV
          </button> */}

          <button
            onClick={() => {
              setIsModalOpen(true);
              trackEvent('modal', 'open', 'Añadir Ruta');
            }}
            className="bg-[#48c78e] hover:bg-[#3aa576] text-white font-bold py-2 px-4 rounded mr-2"
          >
            <PlusCircle className="inline mr-2" />
            Añadir Ruta
          </button>

          <button
            onClick={() => {
              setIsImportModalOpen(true);
              trackEvent('modal', 'open', 'Importar CSV');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            <Upload className="inline mr-2" />
            Importar CSV
          </button>
        </div>

        <div className="overflow-x-auto pt-5">
          <RoutesTable refreshTrigger={refreshTrigger} />
        </div>
      </div>

      <RouteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshTable={refreshTable}
      />

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </>
  );
}

export default App;