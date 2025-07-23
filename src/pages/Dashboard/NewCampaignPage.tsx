import React, { useState } from 'react';
import { Status } from '@/hocs/lib';

interface FormData {
  name: string;
  description: string;
  apiKey: string;
}

export const ALLOWED_STATUS: Record<string, Status> = {
  'Aprobado': 'Approved',
  'Pendiente': 'Pending',
  'Rechazado': 'Rejected',
  'Approved': 'Approved',
  'Pending': 'Pending',
  'Rejected': 'Rejected',
  'approved': 'Approved',
  'pending': 'Pending',
  'rejected': 'Rejected',
}

function CampaignsPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    apiKey: ''
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  type UploadResponse = {
    message: string;
    result: {
      response: string;
      image_metadata: {
        filename: string;
        content_type: string;
        size_bytes: number;
      };
      reason: string;
      status: string;
    };
  };

  const [responseData, setResponseData] = useState<UploadResponse | null>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });  // spread operator: ‘...’, generates a list from an object
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setStatus('loading');

    const sendingData = new FormData();
    sendingData.append('image', selectedImage);
    sendingData.append('name', formData.name);
    sendingData.append('description', formData.description);
    sendingData.append('apiKey', formData.apiKey);
    console.log('Sending data:', sendingData);
    
    const accessToken = localStorage.getItem('access_token');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    console.log("API URL:", apiUrl);

    try {
      console.log("Sending Data:", sendingData);
      console.log("accessToken:", accessToken);
      const response = await fetch(`${apiUrl}/campaigns/`, {
        method: 'POST',
        body: sendingData,
        headers: {
          'Accept': 'application/json',  // key: this tells the API "I wait JSON, no HTML"
          'Authorization': `Bearer ${accessToken}`, // Add the access token to the headers
        }
      });

      if (response.ok) {
        setStatus('success');
        response.json().then(data => {
          console.log('Response data:', data);
          setResponseData(data);
        }).catch(error => {
          console.error('Error parsing JSON:', error);
        });
      } else {
        throw new Error('Error en la respuesta del backend');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="card bg-base-100 shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Nueva campaña</h2>

        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nombre de la campaña"
          className="input input-bordered w-full mb-4"
          onChange={handleTextFieldChange}
        />

        <input
          type="text"
          id="description"
          name="description"
          placeholder="Descripción"
          className="input input-bordered w-full mb-4"
          onChange={handleTextFieldChange}
        />

        <input
          type="text"
          id="apiKey"
          name="apiKey"
          placeholder="API Key (Gemini)"
          className="input input-bordered w-full mb-4"
          onChange={handleTextFieldChange}
        />

        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full mb-4"
          onChange={handleImageChange}
        />

        {preview && (
          <div className="mb-6 flex justify-center items-center">
            <img
              src={preview}
              alt="Preview"
              className="
                max-w-full  /* Impide que exceda el ancho del contenedor */
                h-auto  /* Mantiene la proporción de aspecto */
                max-h-96  /* Altura máxima de 384px en tamaño menor a md (md=768px) */
                md:max-h-150
                object-contain  /* Escala la imagen para que quepa, puede añadir espacio vacío */
                rounded-lg  /* Bordes redondeados */
                shadow-md  /* Sombra */
              "
            />
          </div>
        )}

        <button
          className="btn btn-primary w-full"
          onClick={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Processing...' : 'Send to server'}
        </button>

        {status === 'success' && (
          <div className="mt-4 shadow-sm">
            {responseData?.message}
            <p className='alert'>Status: {responseData?.result.status}</p>
            <p>Image data:</p>
            <ul className='alert'>
              <li>Filename: {responseData?.result.image_metadata.filename}</li>
              <li>Content Type: {responseData?.result.image_metadata.content_type}</li>
              <li>Size: {responseData?.result.image_metadata.size_bytes} bytes</li>
            </ul>
            <p>Reason: {responseData?.result.reason}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mt-4 alert alert-error shadow-sm">
            An error occurred while processing the image.
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignsPage;
