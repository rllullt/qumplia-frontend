import CampaignCard, { CampaignCardProps } from './CampaignCard';

interface CampaignCardsProps {
  data: CampaignCardProps[];
}

function CampaignCards({ data }: CampaignCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((cardData, index) => (
        <CampaignCard key={index} {...cardData} />
      ))}
    </div>
  );
}

export default CampaignCards;
