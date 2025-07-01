import { ReactNode } from 'react';
import { Wallet } from '@gear-js/wallet-connect';
import '@gear-js/vara-ui/dist/style.css'; // Importa los estilos de Vara UI para un tema consistente

interface BaseNavbarProps {
  children: ReactNode;
}

function BaseNavbar({ children }: BaseNavbarProps) {
  return (
    <>
      <div className="fixed top-0 z-50 w-full border-b bg-base-100 backdrop-blur-sm">
        <div className="flex items-center justify-between px-5 lg:px-10 py-4">
          {children}
          <Wallet
            theme="vara" // Puedes usar "vara" o "gear"
            displayBalance={true}
          />
        </div>
      </div>
      {/* <div className="pt-[1m] lg:pt-[6m] overflow-hidden"></div> */}
      <div className="" /> {/* space under navbar */}
    </>
  );
}

export default BaseNavbar;
