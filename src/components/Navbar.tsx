import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaXmark } from 'react-icons/fa6';

function Navbar() {
  const [openNavigation, setOpenNavigation] = useState(false);
  const navigate = useNavigate();

  const toggleNavigation = () => {
    setOpenNavigation(!openNavigation);
  };

  const handleLoginButtonClick = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="btn btn-ghost lg:hidden"
        onClick={toggleNavigation}
      >
        {openNavigation && (<FaXmark />)}
        {!openNavigation && (<FaBars />)}
      </button>

      <Link to="/" className="btn btn-ghost normal-case text-xl">Qumpl<b className="-mx-1">IA</b></Link>


      {/* Menú desktop */}
      <nav className="hidden lg:flex">
        <ul className="menu menu-horizontal px-1 items-center">
          <li><Link to="/">Inicio</Link></li>
          {/* <li><a>Nosotros</a></li> */}
          <li><Link to="/dashboard">Dashboard</Link></li>
          {/* <li><a>FAQ</a></li> */}
          <li>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleLoginButtonClick}
              >
              Login
            </button>
          </li>
          {/* <li><button className="btn btn-primary btn-sm rounded-full mx-2">Agenda una demo</button></li> */}
        </ul>
        {/* <EzSwitchVara /> */}
      </nav>

      {/* Menú móvil */}
      {openNavigation && (
        <div className="lg:hidden bg-base-100 p-4 shadow-md z-40">
          <ul className="menu flex flex-col gap-2">
            <li><Link to="/" onClick={toggleNavigation}>Inicio</Link></li>
            {/* <li><a onClick={toggleNavigation}>Nosotros</a></li> */}
            <li><Link to="/dashboard" onClick={toggleNavigation}>Dashboard</Link></li>
            {/* <li><a onClick={toggleNavigation}>FAQ</a></li> */}
            <li>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleLoginButtonClick}
                >
                Login
              </button>
            </li>
            {/* <li><button className="btn btn-primary btn-sm rounded-full w-full" onClick={toggleNavigation}>Agenda una demo</button></li> */}
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
