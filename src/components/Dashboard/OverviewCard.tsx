import React from 'react';

export interface OverviewCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode; // Puedes usar iconos de bibliotecas como Heroicons o Font Awesome
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
}

function OverviewCard({ title, value, icon, color = 'primary' }: OverviewCardProps) {
  const cardClasses = `card card-compact bg-base-100 shadow-md border-l-4 border-${color}`;

  return (
    <div className={cardClasses}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">{title}</h2>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
          {icon && <div className={`text-${color}-content text-4xl`}>{icon}</div>}
        </div>
      </div>
    </div>
  );
}

export default OverviewCard;
