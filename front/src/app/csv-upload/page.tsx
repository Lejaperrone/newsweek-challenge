'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import useCsvUpload from '../hooks/useCsvUpload';
import { toast } from 'react-toastify';

const UploadCsv: React.FC = () => {
  const { uploadCsv, uploadErrors } = useCsvUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('No se ha seleccionado ningún archivo.');
      return;
    }
    await uploadCsv(selectedFile);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 min-h-screen bg-white shadow-lg rounded-lg pb-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 sm:text-left">Subir Archivo CSV</h1>
      <Link href="/" passHref>
        <button className="mt-2 mb-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Volver a las Reservas
        </button>
      </Link>
      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      {selectedFile && (
        <button
          onClick={handleFileUpload}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Confirmar
        </button>
      )}
      {uploadErrors.length > 0 && (
        <div className="max-h-[65vh] md:max-h-[75vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800">Detalles del Error:</h2>
          <ul className="list-disc pl-5">
            {uploadErrors.map((error, index) => (
              <li key={index} className="text-red-500">
                {error.row ? `Fila ${error.row}: ` : ''}
                {Array.isArray(error.errorMessages) ? error.errorMessages.join(', ') : error.errorMessages}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadCsv;
