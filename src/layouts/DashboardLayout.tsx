import { Outlet } from 'react-router-dom';
import BaseNavbar from '@/components/BaseNavbar';
import DashboardNavbar from '@/components/Dashboard/Navbar';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Dashboard/Sidebar';

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // En desktop, la sidebar siempre estará abierta
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint de Tailwind
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Establecer estado inicial al cargar la página
    handleResize();

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeSidebarMobile = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        onChange={toggleSidebar}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebarMobile} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <BaseNavbar>
          <DashboardNavbar onToggleSidebar={toggleSidebar} isSidebarOpen={() => isSidebarOpen} />
        </BaseNavbar>
      </div>

      {/* Contenido principal con Outlet */}
      <main className="flex-1 p-6 pt-20 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
