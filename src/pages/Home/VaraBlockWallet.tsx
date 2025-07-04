import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { GearApi } from '@gear-js/api';
import { web3Enable, web3Accounts, web3FromSource } from '@polkadot/extension-dapp';

const VARA_NETWORK_LOGO = 'https://img.cryptorank.io/coins/vara_network1695313579900.png';
const VARA_TOKEN_ICON = 'https://s2.coinmarketcap.com/static/img/coins/200x200/28067.png';
const VARA_WSS = 'wss://testnet.vara.network';
const KGWALLET_ADDRESS = 'kgwallet';

type Account = {
  address: string;
  meta: {
    name?: string;
    source: string;
  };
};

const VaraBlockWallet: React.FC = () => {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<GearApi | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  const providerUrl = useMemo(() => VARA_WSS, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const connect = async () => {
      setLoading(true);
      setTxError(null);
      try {
        const apiInstance = await GearApi.create({ providerAddress: providerUrl });
        setApi(apiInstance);

        unsub = await apiInstance.gearEvents.subscribeToNewBlocks(header => {
          setBlockNumber(header.number.toNumber());
        });
      } catch (err) {
        setBlockNumber(null);
      } finally {
        setLoading(false);
      }
    };
    connect();
    return () => {
      if (unsub) unsub();
      if (api) api.disconnect();
    };
    // eslint-disable-next-line
  }, [providerUrl]);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      await web3Enable('vara-walletconnect');
      const allAccounts = await web3Accounts();
      if (allAccounts && allAccounts.length > 0) setAccount(allAccounts[0]);
    } catch (e) {
      //
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleTransfer = useCallback(async () => {
    if (!api || !account) return;
    setTransferring(true);
    setTxHash(null);
    setTxError(null);
    try {
      const injector = await web3FromSource(account.meta.source);
      const value = api.createType('Balance', '1000000000000000000');
      const transfer = api.balance.transfer(
        KGWALLET_ADDRESS,
        value,
        true // keepAlive
      );
      await transfer.signAndSend(
        account.address,
        { signer: injector.signer },
        ({ status, txHash: subTxHash, events }) => {
          if (status.isInBlock && subTxHash) setTxHash(subTxHash.toHex());
          if (events.some(e => e.event.method === 'ExtrinsicFailed')) setTxError('Transaction failed');
        }
      );
    } catch (err) {
      setTxError('Error sending transaction');
    } finally {
      setTransferring(false);
    }
  }, [api, account]);

  return (
    <>
      <style>{`
        .vara-block-ct {
          background: #202a3c;
          padding: 2.5rem 1rem 2rem 1rem;
          border-radius: 20px;
          max-width: 410px;
          margin: 60px auto;
          box-shadow: 0 6px 32px #252e420f;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .vara-logo {
          width: 85px;
          height: 85px;
          margin-bottom: 1.3rem;
          border-radius: 50%;
          background: #232a37;
          display: block;
          box-shadow: 0 2px 18px #45454511;
        }
        .block-num {
          font-size: 2.55rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #eeeeff;
          margin-bottom: 0.6rem;
          text-shadow: 0 2px 8px #252e4222;
        }
        .block-label {
          color: #8fb6e6;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
          margin-bottom: 2.1rem;
          font-weight: 500;
        }
        .vara-btn {
          background: #f1444a;
          color: #fff;
          padding: 0.95em 2.1em;
          border: none;
          border-radius: 32px;
          font-size: 1.15rem;
          font-weight: 600;
          box-shadow: 0 2px 18px #ec292911;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.22s, transform 0.13s;
          margin-bottom: 1.25rem;
          margin-top: 0.3rem;
          min-width: 195px;
        }
        .vara-btn:disabled {
          background: #e88888;
          color: #fff;
          cursor: not-allowed;
          opacity: 0.7;
        }
        .vara-connect-info {
          background: #242d41;
          color: #bcefff;
          border-radius: 14px;
          padding: 1.09em 1.1em 0.7em 1.1em;
          display: flex;
          align-items: center;
          gap: 0.6em;
          font-size: 1rem;
          margin-bottom: 0.61rem;
          word-break: break-all;
        }
        .token-icon {
          width: 22px;
          height: 22px;
          vertical-align: middle;
          border-radius: 50%;
          margin-right: 0.38em;
        }
        .vara-link {
          color: #fa656b;
          text-decoration: none;
          font-weight: 600;
          margin-left: 3px;
        }
        .hash-box {
          background: #273141;
          word-break: break-all;
          color: #bdefff;
          margin-top: 1rem;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          font-size: 0.97rem;
          box-shadow: 0 2px 20px #01081b22;
        }
        .error-msg {
          color: #f05c66;
          margin-top: 1rem;
          font-weight: 500;
          font-size: 1rem;
        }
      `}</style>
      <div className="vara-block-ct">
        <img src={VARA_NETWORK_LOGO} alt="Vara Network" className="vara-logo" />
        <div className="block-num">
          {loading ? '...' : (blockNumber !== null ? blockNumber : '–')}
        </div>
        <div className="block-label">Current Vara Block</div>
        {!account ? (
          <button
            className="vara-btn"
            onClick={handleConnect}
            disabled={connecting}
            style={{ marginTop: "0.5rem" }}
          >
            {connecting ? 'Connecting...' : 'Connect'}
          </button>
        ) : (
          <>
            <div className="vara-connect-info">
              <span>Connected to Vara</span>
            </div>
            <div className="vara-connect-info" style={{ fontSize: '0.92rem' }}>
              <span>Account:</span>
              <span style={{ color: "#fff" }}>{account.address}</span>
            </div>
            <button
              className="vara-btn"
              onClick={handleTransfer}
              disabled={transferring}
              style={{ background: "#363fe8", marginTop: "1.2rem", marginBottom: '0.8rem' }}
            >
              {transferring ? 'Processing...' : (
                <>
                  <img src={VARA_TOKEN_ICON} alt="VARA" className="token-icon" />
                  Transfer 1 VARA
                </>
              )}
            </button>
          </>
        )}
        {txHash && (
          <div className="hash-box">
            <span><b>Tx Hash:</b> {txHash}</span>
          </div>
        )}
        {txError && (
          <div className="error-msg">{txError}</div>
        )}
      </div>
    </>
  );
};

export default VaraBlockWallet;
