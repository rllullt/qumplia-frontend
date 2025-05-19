export interface CampaignCardProps {
  name: string;
  description: string;
  status: string;
}

function CampaignCard({ name, description, status }: CampaignCardProps) {
  const cardClasses = `card card-compact bg-base-100 shadow-md border-l-4`;

  return (
    <div className={cardClasses}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">{name}</h2>
            <p className="text-2xl font-semibold">{description}</p>
            <p className="text-2xl font-semibold">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;
