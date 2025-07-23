import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampaignEditor from '@/components/Dashboard/CampaignEditor';
import { ALLOWED_STATUS } from '@/pages/Dashboard/NewCampaignPage';

type CampaignStatus = 'Pending' | 'Approved' | 'Rejected';

export interface CampaignDetails {
  id: string;
  name: string;
  description: string;
  creation_date: string;
  update_date: string;
  status: CampaignStatus;
  reason: string;
  created_by: string;
  last_time_checked_by: string;
  image_urls?: string[]; // Si tu serializador devuelve un array de objetos con URL
}

function CampaignsDetailPage() {
  const { id } = useParams<{ id: string }>();  // Obtaines the id from the URL
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem('access_token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!id) return; // Si no hay ID, salimos
      setLoading(true);
      try {
        // Reemplaza con tu apiUrl y accessToken reales
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await fetch(`${apiUrl}/campaigns/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error fetching campaign details');
        }

        const data: CampaignDetails = await response.json();
        data.status = ALLOWED_STATUS[data['status']];
        console.log('Campaign details:', data);
        setCampaignDetails(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);  // Depends on 'id': it is executed again if the id of the URL changes

  if (loading) {
    return <div>Cargando detalles de la campaña...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!campaignDetails) {
    return <div>Campaña no encontrada.</div>;
  }

  const firstImageUrl = campaignDetails.image_urls && campaignDetails.image_urls.length > 0
    ? campaignDetails.image_urls[0]
    : null;
  
  // Función que se pasará al editor para manejar el guardado
  const handleSaveCampaign = async (updatedCampaign: CampaignDetails) => {
    console.log('Guardando datos:', updatedCampaign);

    try {
      const sendingData = new FormData();
      sendingData.append('name', updatedCampaign.name);
      sendingData.append('description', updatedCampaign.description);
      sendingData.append('status', updatedCampaign.status.toLowerCase());
      sendingData.append('reason', updatedCampaign.reason);
      console.log('Sending data:', sendingData);

      const response = await fetch(`${apiUrl}/campaigns/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        },
        body: sendingData,
      });

      if (response.ok) {
        response.json().then(data => {
          console.log('Response data:', data);
          if (data['status'].toLowerCase() !== "error") {
            setCampaignDetails(updatedCampaign);
            let campaign = data['campaign'];
            // handleChangeStatus in blockchain
          }
          alert(`Campaña "${updatedCampaign.name}" actualizada con éxito!`);
        }).catch(error => {
          console.error('Error parsing JSON:', error);
        });
      } else {
        throw new Error('Error en la respuesta del backend');
      }
    } catch (error) {
      console.error(error);
      // setStatus('error');
    }
  };

  

  return (
    <div className="campaign-detail-page p-4">
      <h1>Detalles de la Campaña: {campaignDetails.name}</h1>
      {/* Rendedrs the image if available */}
      {firstImageUrl && (
        <div className="mb-6 flex justify-center items-center">
          <img
            src={firstImageUrl}
            alt="Campaign"
            className="
              max-w-full  /* Impide que exceda el ancho del contenedor */
              h-auto  /* Mantiene la proporción de aspecto */
              max-h-96  /* Altura máxima de 384px en tamaño menor a md (md=768px) */
              md:max-h-150
              object-contain  /* Escala la imagen para que quepa, puede añadir espacio vacío */
              rounded-lg  /* Bordes redondeados */
              shadow-md  /* Sombra */
              // mx-auto       /* Eliminamos mx-auto si el padre es flex con justify-center */
              // block         /* Eliminamos block si el padre es flex */
            "
          />
        </div>
      )}
      <p>ID: {campaignDetails.id}</p>
      <p>Descripción: {campaignDetails.description}</p>
      <p>Estado: {campaignDetails.status}</p>
      <p>Razón: {campaignDetails.reason}</p>
      {/* Aquí puedes mostrar el resto de los detalles de la campaña */}
      <div className="card-actions justify-end mt-4">
        {/* Aquí se usa el componente editor */}
        <CampaignEditor campaignDetails={campaignDetails} onSave={handleSaveCampaign} />
      </div>
    </div>
  );
}

export default CampaignsDetailPage;
