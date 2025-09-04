// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

import { useApi, useAccount } from '@gear-js/react-hooks';
import { withProviders } from '@/hocs';
import { Routing } from '@/pages'; // Importa el componente Routing
import { ApiLoader } from '@/components/loaders';
import './App.css';
import "@gear-js/vara-ui/dist/style.css";
import useAuth from '@/hooks/useAuth';


function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  // useAuth hook for “listening” when the token is stored into localStorage
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated:', isAuthenticated);

  const isAppReady = isApiReady && isAccountReady;

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<LandingPage />} />
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route
    //       path="/dashboard/*"
    //       element={
    //         <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/login">
    //           <DashboardLayout />
    //         </ProtectedRoute>
    //       }
    //     >
    //       <Route index element={<DashboardPage />} />
    //       <Route path="overview" element={<DashboardPage />} />
    //       <Route path="campaigns" element={<CampaignsPage />} />
    //       <Route path="new-campaign" element={<NewCampaignPage />} />
    //       <Route path="campaigns/:id" element={<CampaignsDetailPage />} />
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
    // <BrowserRouter>
      <main>
        {isAppReady ? <Routing isAuthenticated={isAuthenticated} /> : <ApiLoader />}
      </main>
    // </BrowserRouter>  // ya está en withProviders
  );
}

export const App = withProviders(Component);
