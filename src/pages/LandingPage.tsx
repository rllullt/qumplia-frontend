import BaseNavbar from '../components/BaseNavbar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

function LandingPage() {
  return (
    <div>
      <div className='pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden'>
        <BaseNavbar>
            <Navbar />
          </BaseNavbar>
        </div>
      <Hero />
      {/* Aquí puedes añadir más secciones de tu landing page */}
    </div>
  );
}

export default LandingPage;
