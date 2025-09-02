import BaseNavbar from '@/components/layout/BaseNavbar';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/Hero';
import HeroShield from '@/assets/hero-img-shield.png';
import HeroBargraph from '@/assets/hero-img-bargraph.png';

function LandingPage() {

  const handleDemoClick = () => {
    alert('Agenda una demo!');
  };

  return (
    <div>
      <div className='pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden'>
        <BaseNavbar>
          <Navbar />
        </BaseNavbar>
      </div>
      {/* es */}
      {/* <Hero
        title="Compliance sin complicaciones"
        subtitle="Facilitamos el proceso de compliance en la industria financiera a través de IA y Blockchain."
        buttonText="Agenda una demo"
        onButtonClick={handleDemoClick}
        largeImageUrl={HeroShield}
      />
      <Hero
        title="Optimiza el cumplimiento normativo en la industria financiera"
        subtitle="Los errores de compliance en promociones financieras ponen en riesgo tu negocio. QumplIA ofrece una plataforma unificada potenciada por IA y Blockchain para asegurar el cumplimiento regulatorio, facilitando la identificación y corrección de problemas en cada etapa del ciclo de vida de la campaña."
        buttonText="Agenda una demo"
        onButtonClick={handleDemoClick}
        largeImageUrl={HeroBargraph}
        largeImageOnLeft={true}
      /> */}
      {/* en */}
      <Hero
        title="Compliance without complications"
        subtitle="We use AI and Blockchain to streamline the compliance process in the financial industry."
        buttonText="Book a demo"
        onButtonClick={handleDemoClick}
        largeImageUrl={HeroShield}
      />
      <Hero
        title="Optimize Regulatory Compliance in the Financial Industry"
        subtitle="Compliance errors in financial promotions can put your business at risk. QumplIA offers a unified platform powered by AI and Blockchain to ensure regulatory compliance, making it easier to identify and fix issues at every stage of the campaign lifecycle."
        buttonText="Book a demo"
        onButtonClick={handleDemoClick}
        largeImageUrl={HeroBargraph}
        largeImageOnLeft={true}
      />
      {/* Aquí puedes añadir más secciones de tu landing page */}
    </div>
  );
}

export default LandingPage;
