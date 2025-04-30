import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-4 md:mx-auto text-white p-10 rounded-3xl shadow-lg relative mt-28 bg-[#272829] ">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left md:w-3/4">
          <h2 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight">
            Voting System &<br />
            <span className="text-purple-400">Feedback Mechanism</span>
          </h2>
          <p className="text-xs md:text-lg mb-6">
            Your Voice. Your Choice. Driving Change with Seamless Voting &
            Powerful Feedback{" "}
          </p>
          <div className="flex space-x-4 whitespace-nowrap ">
            <button
              className="bg-purple-600 text-white py-3 px-6 rounded hover:bg-purple-500"
              onClick={() => navigate("/dashboard")}
            >
              Launch App
            </button>
          </div>
        </div>

        <div className="hidden md:block absolute bottom-0 right-0 w-48 md:w-64 lg:w-80 h-auto">
          <img
            src="/images/bg.png"
            alt="Hero Image"
            className="w-full h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
