import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import VotePage from "./pages/VotePage";
import Feedback from "./pages/Feedback";
import CreateFeedback from "./pages/CreateFeedback";
import { useContext } from "react";
import { EthContext } from "./context";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { account } = useContext(EthContext);
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative text-gray-300 font-sans">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-300 to-purple-500">
          <ul className="circles absolute w-full h-full flex flex-wrap overflow-hidden">
            {[...Array(10)].map((_, index) => (
              <li
                key={index}
                className="w-10 h-10 bg-white opacity-30 rounded-full animate-pulse"
              ></li>
            ))}
          </ul>
        </div>
        <div className="relative z-10">
          <Header />
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <HeroSection />
                    {/* <FooterSection /> */}
                  </>
                }
              />
              {account && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-poll" element={<CreatePoll />} />
                  <Route path="/create-feedback" element={<CreateFeedback />} />
                </>
              )}
              <Route path="/feedback/:feedbackId" element={<Feedback />} />
              <Route path="/vote/:pollId" element={<VotePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
