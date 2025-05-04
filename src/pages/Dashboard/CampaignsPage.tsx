import React, { useState } from 'react';

function CampaignsPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  type UploadResponse = {
    message: string;
    metadata: {
      filename: string;
      content_type: string;
      size_bytes: number;
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

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setStatus('loading');

    const formData = new FormData();
    formData.append('image', selectedImage);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    console.log("API URL:", apiUrl);

    try {
      const response = await fetch(`${apiUrl}/campaigns/new/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'  // key: this tells "I wait JSON, no HTML"
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
        <h2 className="text-2xl font-bold mb-4">Upload campaign image</h2>

        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full mb-4"
          onChange={handleImageChange}
        />

        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="w-full h-auto rounded" />
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
          <div className="mt-4 alert alert-success shadow-sm">
            Image processed successfully!
            <br />Image data:
            <br />FileName: {responseData?.metadata.filename}
            <br />Content Type: {responseData?.metadata.content_type}
            <br />Size: {responseData?.metadata.size_bytes} bytes
            <br />This campaign image DOES cumply with all the requirements.
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
