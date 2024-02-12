import { useState } from 'react';
import { toast } from 'react-toastify';

interface UploadError {
  row?: number;
  errorMessages: string | string[];
}

const useCsvUpload = () => {
  const [uploadErrors, setUploadErrors] = useState<UploadError[]>([]);
  const apiUrl: string = process.env.NEXT_PUBLIC_API_URL || '';

  const uploadCsv = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${apiUrl}/reservations/load-csv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error en la carga masiva: ${errorData.message}`);
        return;
      }

      const result = await response.json();
      if (result.errors && result.errors.length > 0) {
        setUploadErrors(result.errors);
      } else {
        toast.success('Carga masiva completada con éxito.');
        setUploadErrors([]);
      }
    } catch (error) {
      toast.error('Error en la carga masiva del archivo CSV.');
    }
  };

  return { uploadCsv, uploadErrors };
};

export default useCsvUpload;
