import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { close, menu, logo } from "../assets";
import { navLinks } from "../constants";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";

const NavLink = ({ to, title, active, onClick }) => (
  <li
    className={`font-poppins font-normal cursor-pointer text-[16px] ${
      active === title ? "text-white" : "text-dimWhite"
    } hover:text-secondary transition-colors duration-300`}
    onClick={() => onClick(title)}
  >
    <Link to={to}>{title}</Link>
  </li>
);

const UserMenu = ({ userName, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <FaUserCircle className="text-white text-3xl" />
        <span className="text-dimWhite font-poppins hidden sm:inline">
          {userName}
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black-gradient-2 rounded-lg shadow-lg py-2 z-50">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-dimWhite hover:text-white hover:bg-gray-700"
          >
            <FiUser className="mr-2" />
            Profile
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center w-full text-left px-4 py-2 text-dimWhite hover:text-white hover:bg-gray-700"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [userName, setUserName] = useState("");
  const isLoggedIn = !!Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = () => {
      const email = Cookies.get("userEmail");
      // This is a placeholder. In a real app, you'd fetch this from your backend.
      if (email) {
        setUserName(email.split("@")[0]);
      }
    };
    if (isLoggedIn) {
      fetchUserName();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userEmail");
    navigate("/login");
  };

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <Link to="/">
        <img src={logo} alt="DeFie" className="w-[124px] h-[38px]" />
      </Link>

      {/* Desktop Menu */}
      <ul className="list-none sm:flex hidden justify-end items-center flex-1 space-x-8">
        {navLinks.map((nav) => (
          <NavLink
            key={nav.id}
            to={nav.redirect}
            title={nav.title}
            active={active}
            onClick={setActive}
          />
        ))}
        {!isLoggedIn && (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="font-poppins font-medium text-[16px] text-white bg-blue-gradient px-4 py-2 rounded-md"
            >
              Login
            </Link>
          </div>
        )}
      </ul>

      {isLoggedIn && (
        <div className="hidden sm:flex">
          <UserMenu userName={userName} onLogout={handleLogout} />
        </div>
      )}

      {/* Mobile Menu */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer"
          onClick={() => setToggle(!toggle)}
        />
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar z-10`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav) => (
              <NavLink
                key={nav.id}
                to={nav.redirect}
                title={nav.title}
                active={active}
                onClick={(title) => {
                  setActive(title);
                  setToggle(false);
                }}
              />
            ))}
            {!isLoggedIn ? (
              <>
                <li className="mt-4">
                  <Link
                    to="/login"
                    className="font-poppins font-medium text-[16px] text-white bg-blue-gradient px-4 py-2 rounded-md"
                    onClick={() => setToggle(false)}
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="mt-4">
                <UserMenu
                  userName={userName}
                  onLogout={() => {
                    handleLogout();
                    setToggle(false);
                  }}
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
