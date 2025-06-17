import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { close, menu, logo } from "../assets";
import { navLinks } from "../constants";
import { FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [userLoginIn, setUserLoginIn] = useState(true);
  const [name, setName] = useState("bhowmik");
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavLinkClick = (title, redirect) => {
    setActive(title);
    setToggle(false);
    if (redirect) {
      navigate(redirect);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setUserLoginIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = Cookies.get("userEmail");
        if (!email) return;

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/fetchdetail`,
          { email }
        );

        if (res.data && res.data.user) {
          setName(res.data.user.name);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const toHome = () => {
    navigate("/");
  };

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar px-6">
      <h1
        onClick={toHome}
        className="w-[124px] h-[38px] text-4xl text-gradient font-extrabold cursor-pointer"
      >
        DeFie
      </h1>

      <ul className="list-none sm:flex hidden justify-end items-center flex-1 space-x-8">
        {navLinks.map((nav) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            }`}
            onClick={() => handleNavLinkClick(nav.title, nav.redirect)}
          >
            <Link
              to={nav.redirect}
              className={`hover:text-blue-500 transition-colors duration-300 ease-in-out`}
            >
              {nav.title}
            </Link>
          </li>
        ))}
        <li>
          {userLoginIn && (
            <Link
              to="/login"
              className="text-white border border-zinc-500 px-4 py-2 rounded-md font-medium focus:outline-none"
            >
              Login
            </Link>
          )}
        </li>
        <li>
          {userLoginIn && (
            <Link
              to="/register"
              className="text-white border border-zinc-500 px-4 py-2 rounded-md font-medium focus:outline-none"
            >
              Register
            </Link>
          )}
        </li>
      </ul>

      {!userLoginIn && (
        <div
          onClick={toggleDropdown}
          className="flex flex-col relative justify-center items-center"
        >
          <p className="text-white text-3xl text-icon">
            <FaUserCircle className="text-icon" />
          </p>
          <p className="text-gray-400 text-sm text-poppins font-bold">{name}</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
