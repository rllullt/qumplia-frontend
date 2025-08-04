import { Link } from 'react-router-dom';
import { ALLOWED_STATUS } from '@/pages/Dashboard/NewCampaignPage';

export interface CampaignCardProps {
  id: string;
  name: string;
  description: string;
  status: string;
  reason: string;
}

function CampaignCard({ id, name, description, status, reason }: CampaignCardProps) {
  const cardClasses = `card card-compact bg-base-100 shadow-md border-l-4`;
  const shortReason = reason.length > 200 ? `${reason.slice(0, 200)}...` : reason;

  return (
    <Link to={`/dashboard/campaigns/${id}`}>
      <div className={cardClasses}>
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title">{name}</h2>
              <p className="text-2xl font-semibold">{description}</p>
              <p className="text-xl font-semibold">{ALLOWED_STATUS[status]}</p>
              <p className="text-sm text-gray-500">{shortReason}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CampaignCard;
