import React, { useState, useEffect } from 'react';
import BaseNavbar from '../components/BaseNavbar';
import DashboardNavbar from '../components/Dashboard/Navbar';
import Sidebar from '../components/Dashboard/Sidebar';
import OverviewCards from '../components/Dashboard/OverviewCards';
import { FaUsers, FaFileAlt, FaChartBar, FaCog } from 'react-icons/fa'; // Ejemplo de iconos

function DashboardPage() {
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

  const overviewData = [
    { title: 'Total Users', value: 1250, icon: <FaUsers />, color: 'primary' },
    { title: 'Total Reports', value: 580, icon: <FaFileAlt />, color: 'secondary' },
    { title: 'Monthly Revenue', value: '$12,500', icon: <FaChartBar />, color: 'accent' },
    { title: 'System Health', value: 'Good', icon: <FaCog />, color: 'success' },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        onChange={toggleSidebar}
      />
      <div className="drawer-content flex flex-col min-h-screen">
        <BaseNavbar>
          <DashboardNavbar onToggleSidebar={toggleSidebar} isSidebarOpen={() => isSidebarOpen} />
        </BaseNavbar>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <OverviewCards data={overviewData} />
          {/* Aquí puedes añadir más contenido del dashboard */}
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebarMobile} />
    </div>
  );
}

export default DashboardPage;