
import { useAccount, useProgram, usePrepareProgramTransaction } from '@gear-js/react-hooks';
import {
  useSignlessTransactions,
  useGaslessTransactions,
  usePrepareEzTransactionParams,
  EzTransactionsSwitch,
} from 'gear-ez-transactions';
import { useState, useEffect, useRef } from 'react';
import { useSignAndSend } from '@/hooks/use-sign-and-send';
import { Program } from '@/hocs/lib';

const ALLOWED_SIGNLESS_ACTIONS = ['ChangeStatus', 'SubmitEvaluation', 'UpdateMetadata'];

function EzSwitchVara() {
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

  const handleChangeStatus = async () => {
    if (!signless.isActive) return;
    setLoading('change');
    try {
      const { sessionForAccount, ...params } = await prepareEzTransactionParams(false);
      if (!sessionForAccount) throw new Error('No session');
      const { transaction } = await changeStatusTx.prepareTransactionAsync({
        args: [1n, { Approved: null }, sessionForAccount],
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

  const handleSubmitEvaluation = async () => {
    if (!signless.isActive) return;
    setLoading('submit');
    try {
      const { sessionForAccount, ...params } = await prepareEzTransactionParams(false);
      if (!sessionForAccount) throw new Error('No session');
      const { transaction } = await submitEvalTx.prepareTransactionAsync({
        args: [1n, 'userhash', { Approved: null }, 'metadata', sessionForAccount],
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

  const handleUpdateMetadata = async () => {
    if (!signless.isActive) return;
    setLoading('meta');
    try {
      const { sessionForAccount, ...params } = await prepareEzTransactionParams(false);
      if (!sessionForAccount) throw new Error('No session');
      const { transaction } = await updateMetaTx.prepareTransactionAsync({
        args: [1n, 'new-metadata', sessionForAccount],
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

  const voucherEnabled = gasless.voucherStatus?.enabled;
  const signlessActive = signless.isActive;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 shadow-xl rounded-xl flex flex-col items-center gap-4">
      <div className="mb-2 w-full">
        <div className="alert shadow">
          <span>
            {voucherEnabled
              ? '✅ Gasless activo'
              : gasless.isEnabled
              ? voucherPending
                ? '⏳ Esperando voucher…'
                : '🛠️ Activando voucher...'
              : '⚠️ Servicio gasless no disponible'}
          </span>
        </div>
        <div
          className={`text-center font-medium ${
            signlessActive ? 'text-success' : 'text-error'
          }`}>
          {signlessActive ? '✅ Signless activo' : '⚠️ Signless inactivo'}
        </div>
      </div>
      <EzTransactionsSwitch allowedActions={ALLOWED_SIGNLESS_ACTIONS} />
      <div className="flex flex-col gap-2 w-full">
        <button
          className="btn btn-primary w-full"
          disabled={loading !== '' || !signlessActive}
          onClick={handleChangeStatus}
        >
          {loading === 'change' ? 'Enviando...' : 'Change Status'}
        </button>
        <button
          className="btn btn-secondary w-full"
          disabled={loading !== '' || !signlessActive}
          onClick={handleSubmitEvaluation}
        >
          {loading === 'submit' ? 'Enviando...' : 'Submit Evaluation'}
        </button>
        <button
          className="btn btn-accent w-full"
          disabled={loading !== '' || !signlessActive}
          onClick={handleUpdateMetadata}
        >
          {loading === 'meta' ? 'Enviando...' : 'Update Metadata'}
        </button>
      </div>
    </div>
  );
}

export default EzSwitchVara;