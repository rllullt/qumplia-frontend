import React, { useState, useEffect, useRef } from 'react';
import { useAccount, useProgram, usePrepareProgramTransaction } from '@gear-js/react-hooks';
import {
  useSignlessTransactions,
  useGaslessTransactions,
  usePrepareEzTransactionParams,
  EzTransactionsSwitch,
} from 'gear-ez-transactions';
import { useSignAndSend } from '@/hooks/use-sign-and-send';
import { Program, Status } from '@/hocs/lib';

interface FormData {
  name: string;
  description: string;
  apiKey: string;
}

const ALLOWED_SIGNLESS_ACTIONS = ['ChangeStatus', 'SubmitEvaluation', 'UpdateMetadata'];
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
          if (data['result']['status'].toLowerCase() !== "error") {
            let campaign = data['campaign'];
            handleSubmitEvaluation(campaign['id'], '1', ALLOWED_STATUS[campaign['status']], '');
          }
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

  const { account } = useAccount();
  const signless = useSignlessTransactions();
  const gasless = useGaslessTransactions();

  const { data: program } = useProgram({
    library: Program,
    id: import.meta.env.VITE_PROGRAMID,
  });

  const changeStatusTx = usePrepareProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'changeStatus',
  });

  const submitEvalTx = usePrepareProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'submitEvaluation',
  });

  const updateMetaTx = usePrepareProgramTransaction({
    program,
    serviceName: 'service',
    functionName: 'updateMetadata',
  });

  const { prepareEzTransactionParams } = usePrepareEzTransactionParams();
  const { signAndSend } = useSignAndSend();

  const [loading, setLoading] = useState('');
  const [voucherPending, setVoucherPending] = useState(false);
  const hasRequestedOnceRef = useRef(false);

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
      signAndSend(transaction, {
        onSuccess: () => setLoading(''),
        onError: () => setLoading(''),
      });
    } catch {
      setLoading('');
    }
  };

  const handleSubmitEvaluation = async (campaignId: number, userHash: string, status: Status, metadata: string) => {
    console.log('handleSubmitEvaluation');
    console.log('campaignId:', campaignId);
    console.log('userHash:', userHash);
    console.log('status:', status);
    console.log('metadata:', metadata);
    console.log('signless.isActive:', signless.isActive);

    if (!signless.isActive) return;
    setLoading('submit');
    console.log('handleSubmitEvaluation->setLoading(submit)');
    try {
      const { sessionForAccount, ...params } = await prepareEzTransactionParams(false);
      if (!sessionForAccount) throw new Error('No session');
      const { transaction } = await submitEvalTx.prepareTransactionAsync({
        args: [campaignId, userHash, status, metadata, null],
        value: 0n,
        ...params,
      });
      signAndSend(transaction, {
        onSuccess: () => setLoading(''),
        onError: () => setLoading(''),
      });
    } catch {
      setLoading('');
    }
  };

  const handleUpdateMetadata = async (campaignId: number, newMetadata: string) => {
    if (!signless.isActive) return;
    setLoading('meta');
    try {
      const { sessionForAccount, ...params } = await prepareEzTransactionParams(false);
      if (!sessionForAccount) throw new Error('No session');
      const { transaction } = await updateMetaTx.prepareTransactionAsync({
        args: [campaignId, newMetadata, null],
        value: 0n,
        ...params,
      });
      signAndSend(transaction, {
        onSuccess: () => setLoading(''),
        onError: () => setLoading(''),
      });
    } catch {
      setLoading('');
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
