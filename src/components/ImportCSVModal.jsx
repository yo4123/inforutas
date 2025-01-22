import { useState } from 'react';
import { X } from 'lucide-react';

const ImportCSVModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo CSV.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/import-drivers', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al importar el archivo');
      }

      const result = await response.json();
      if (result.success) {
        setSuccess('Archivo importado correctamente.');
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error al procesar el archivo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Importar Conductores</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal;
