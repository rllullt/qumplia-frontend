import BaseNavbar from '@/components/layout/BaseNavbar';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/Hero';
import HeroShield from '@/assets/hero-img-shield.png';
import HeroBargraph from '@/assets/hero-img-bargraph.png';
import EzSwitchVara from "@/pages/Home/EzSwitchVara";
import { EzSwitchAndSendHello } from '@/pages/Home/EzSwitchAndSendHello';

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
      <Hero
        title="Compliance sin complicaciones"
        subtitle="Facilitamos el proceso de compliance en la industria financiera a través de IA y Blockchain."
        buttonText="Agenda una demo"
        onButtonClick={handleDemoClick}
        largeImageUrl={HeroShield}
      />
      <EzSwitchVara />
      <EzSwitchAndSendHello/>
      <Hero
        title="Optimiza el cumplimiento normativo en la industria financiera"
        subtitle="Los errores de compliance en promociones financieras ponen en riesgo tu negocio. QumplIA ofrece una plataforma unificada potenciada por IA y Blockchain para asegurar el cumplimiento regulatorio, facilitando la identificación y corrección de problemas en cada etapa del ciclo de vida de la campaña."
        buttonText="Agenda una demo"
        onButtonClick={handleDemoClick}
        largeImageUrl={HeroBargraph}
        largeImageOnLeft={true}
      />
      {/* Aquí puedes añadir más secciones de tu landing page */}
    </div>
  );
}

export default LandingPage;
