import OverviewCard, { OverviewCardProps } from './OverviewCard';

interface OverviewCardsProps {
  data: OverviewCardProps[];
}

function OverviewCards({ data }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((cardData, index) => (
        <OverviewCard key={index} {...cardData} />
      ))}
    </div>
  );
}

export default OverviewCards;
