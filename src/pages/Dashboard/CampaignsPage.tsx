import { useState, useEffect } from 'react';
import { CampaignCardProps } from '../../components/Dashboard/CampaignCard';
import CampaignCards from '../../components/Dashboard/CampaignCards';

function CampaignsPage() {
  const [campaignsData, setCampaignsData] = useState<CampaignCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem('access_token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${apiUrl}/campaigns/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error fetching campaigns');
        }

        const data: CampaignCardProps[] = await response.json();
        setCampaignsData(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [apiUrl, accessToken]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  // const campaignsData = [
  //   { name: 'Campaña 1', description: 'Descripción', status: 'pending' },
  //   { name: 'Campañaaa 2', description: 'Descripción lol', status: 'approved' },
  // ];

  return (
    <div className="drawer lg:drawer-open">
      <div className="drawer-content flex flex-col min-h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Campañas</h2>
          <CampaignCards data={campaignsData} />
          {/* Aquí puedes añadir más contenido del dashboard */}
        </div>
      </div>
      
    </div>
  );
}

export default CampaignsPage;
