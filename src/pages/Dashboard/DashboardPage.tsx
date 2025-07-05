import OverviewCards from '@/components/Dashboard/OverviewCards';
import { OverviewCardColor } from '@/components/Dashboard/OverviewCard';
import { FaUsers, FaFileAlt, FaChartBar, FaCog } from 'react-icons/fa'; // Ejemplo de iconos

function DashboardPage() {
  const overviewData = [
    { title: 'Total Users', value: 1250, icon: <FaUsers />, color: OverviewCardColor.primary },
    { title: 'Total Campaigns', value: 580, icon: <FaFileAlt />, color: OverviewCardColor.secondary },
    { title: 'Auditory reduced costs', value: '$12,500', icon: <FaChartBar />, color: OverviewCardColor.accent },
    { title: 'System Health', value: 'Good', icon: <FaCog />, color: OverviewCardColor.success },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <div className="drawer-content flex flex-col min-h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <OverviewCards data={overviewData} />
          {/* Aquí puedes añadir más contenido del dashboard */}
        </div>
      </div>
      
    </div>
  );
}

export default DashboardPage;