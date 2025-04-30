import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConnectedUserButton from "./ConnectedUserButton";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-black-900 text-white py-6 px-5 font-mazzard">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="flex items-center justify-center space-x-3 px-4 md:px-16 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/images/logo.png"
            alt="NajmAI logo"
            className="w-8 h-8 object-contain rounded-full"
          />
          <h1 className="text-xl font-bold">Votex</h1>
        </div>

        <div className="left-0">
          <ConnectedUserButton />
        </div>
        <button
          className="bg-gray-800 text-white p-2 rounded focus:outline-none hover:bg-gray-600 md:hidden"
          style={{ backgroundColor: "#272829" }}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
