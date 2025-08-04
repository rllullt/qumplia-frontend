import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useProgram, usePrepareProgramTransaction } from '@gear-js/react-hooks';
import {
  useSignlessTransactions,
  useGaslessTransactions,
  usePrepareEzTransactionParams,
  // EzTransactionsSwitch,
} from 'gear-ez-transactions';
import { useSignAndSend } from '@/hooks/use-sign-and-send';
import { Program, Status } from '@/hocs/lib';
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
  // ================================================================
  // 1. REMEMBER TO EXECUTE EVERY HOOK AT THE FIRST PART OF THE FILE
  // ================================================================
  const { id } = useParams<{ id: string }>();
  const { account } = useAccount();
  const signless = useSignlessTransactions();
  const gasless = useGaslessTransactions();

  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [voucherPending, setVoucherPending] = useState(false);
  const hasRequestedOnceRef = useRef(false);
  console.log('status:', status);
  console.log('voucherPending:', voucherPending);
  
  const accessToken = localStorage.getItem('access_token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const { data: program } = useProgram({
    library: Program,
    id: import.meta.env.VITE_PROGRAMID,
  });

  const changeStatusTx = usePrepareProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'changeStatus',
  });

  const { prepareEzTransactionParams } = usePrepareEzTransactionParams();
  const { signAndSend } = useSignAndSend();

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!id) return; // Si no hay ID, salimos
      setLoading('fetchCampaignDetails');
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
        setLoading('');
      }
    };

    fetchCampaignDetails();
  }, [id]);  // Depends on 'id': it is executed again if the id of the URL changes

  useEffect(() => {
    hasRequestedOnceRef.current = false;
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address || !gasless.isEnabled || hasRequestedOnceRef.current) return;

    hasRequestedOnceRef.current = true;
    setVoucherPending(true);

    const requestVoucher = async () => {
      try {
        if (gasless.voucherStatus?.enabled) {
          setVoucherPending(false);
          return;
        }
        await gasless.requestVoucher(account.address);
        let retries = 5;
        while (retries-- > 0) {
          await new Promise((res) => setTimeout(res, 300));
          if (gasless.voucherStatus?.enabled) {
            setVoucherPending(false);
            return;
          }
        }
        setVoucherPending(false);
      } catch {
        hasRequestedOnceRef.current = false;
        setVoucherPending(false);
      }
    };
    void requestVoucher();
  }, [account?.address, gasless.isEnabled]);

  const firstImageUrl = campaignDetails && campaignDetails.image_urls && campaignDetails.image_urls.length > 0
    ? campaignDetails.image_urls[0]
    : null;
  
  // ================================================================
  // 2. RENDER LOGIC AND HANDLER FUNCTIONS
  // ================================================================
  
  // Función que se pasará al editor para manejar el guardado
  const handleSaveCampaign = async (updatedCampaign: CampaignDetails) => {
    console.log('Guardando datos:', updatedCampaign);

    setStatus('loading');

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
        setStatus('success');
        response.json().then(campaign => {
          console.log('Response data:', campaign);
          if (campaign['status'].toLowerCase() !== "error") {
            setCampaignDetails(updatedCampaign);
            handleChangeStatus(campaign['id'], ALLOWED_STATUS[campaign['status']]);
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
      setStatus('error');
    }
  };
  
  const handleChangeStatus = async (campaignId: number, newStatus: Status) => {
      if (!signless.isActive) return;
      setLoading('change');
      try {
        const { sessionForAccount, ...params } = await prepareEzTransactionParams(false);
        if (!sessionForAccount) throw new Error('No session');
        const { transaction } = await changeStatusTx.prepareTransactionAsync({
          args: [campaignId, newStatus, null],
          value: 0n,
          ...params,
        });
        signAndSend(transaction as any, {
          onSuccess: () => setLoading(''),
          onError: () => setLoading(''),
        });
      } catch {
        setLoading('');
      }
    };
  
  // Anticipated returns
  if (loading) {
    return <div>Cargando detalles de la campaña...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!campaignDetails) {
    return <div>Campaña no encontrada.</div>;
  }
  
  // ================================================================
  // 3. RETURN OF FINAL JSX
  // ================================================================

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
