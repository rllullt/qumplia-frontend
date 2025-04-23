import React from 'react';
import HeroImage from '../assets/hero-img-1.png';

function Hero() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Compliance sin complicaciones</h1>
          <p className="py-6">Facilitamos el proceso de compliance en la industria financiera a través de IA y Blockchain.</p>
          <button className="btn btn-primary rounded-full">Agenda una demo</button>
        </div>
        <div className="w-full lg:w-1/2">
          <img src={HeroImage} className="max-w-sm rounded-lg shadow-2xl" alt="Imagen de Compliance" />
        </div>
      </div>
    </div>
  );
}

export default Hero;