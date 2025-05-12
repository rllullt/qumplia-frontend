import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void; // Example of a potential button click handler
  largeImageUrl: string;
  largeImageOnLeft?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  largeImageUrl,
  largeImageOnLeft = false,
}) => {
  const largeImageOrderClass = largeImageOnLeft ? 'lg:flex-row' : 'lg:flex-row-reverse';
  return (
    <div className="hero min-h-screen bg-base-200 pt-24 px-4 overflow-hidden">
      <div className={`hero-content flex-col-reverse ${largeImageOrderClass} items-center gap-10`}>
        <div className="w-full lg:w-1/2">
          <img
            src={largeImageUrl}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-2xl mx-auto"
            alt="Hero Image"
          />
        </div>
        <div className="text-center lg:text-left w-full lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-bold">{title}</h1>
          <p className="py-6 text-base sm:text-lg">{subtitle}</p>
          <button className="btn btn-primary rounded-full" onClick={onButtonClick}>{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
