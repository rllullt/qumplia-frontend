import HeroImage from '../assets/hero-img-1.png';

function Hero() {
  return (
    <div className="hero min-h-screen bg-base-200 pt-24 px-4 overflow-hidden">
      <div className="hero-content flex-col-reverse lg:flex-row-reverse items-center gap-10">
        <div className="w-full lg:w-1/2">
          <img
            src={HeroImage}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-2xl mx-auto"
            alt="Imagen de Compliance"
          />
        </div>
        <div className="text-center lg:text-left w-full lg:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-bold">Compliance sin complicaciones</h1>
          <p className="py-6 text-base sm:text-lg">Facilitamos el proceso de compliance en la industria financiera a través de IA y Blockchain.</p>
          <button className="btn btn-primary rounded-full">Agenda una demo</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
