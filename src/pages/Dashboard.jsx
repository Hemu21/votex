import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { EthContext } from "../context";
import { usePollFeedback } from "../hooks";

const Dashboard = () => {
  const navigate = useNavigate();
  const { account, contract } = useContext(EthContext);
  const { fetchUserCreatedPolls, fetchUserCreatedFeedbacks } =
    usePollFeedback();
  const [polls, setPolls] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Account in Dashboard:", account);
  console.log("poll", polls);
  console.log("feedback", feedbacks);
  useEffect(() => {
    const fetchData = async () => {
      if (!account || !contract) {
        setError("Wallet not connected or contract not available.");
        setLoading(false);
        return;
      }

      try {
        const [pollsData, feedbacksData] = await Promise.all([
          fetchUserCreatedPolls(account),
          fetchUserCreatedFeedbacks(account),
        ]);
        setPolls(pollsData);
        setFeedbacks(feedbacksData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account, contract]);

  if (loading) {
    return <p className="text-white text-center mt-10">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return (
    <div className="mx-36 p-10">
      <h1 className="text-3xl text-white font-bold mb-6">Dashboard</h1>
      <div className="flex gap-10">
        <button
          className="items-center text-white text-lg font-serif bg-gradient-to-r from-blue-500 to-purple-500 animate-bounce focus:animate-none hover:animate-none inline-flex text-md font-bold mt-5 px-6 py-2 rounded-lg tracking-wide"
          onClick={() => navigate("/create-poll")}
        >
          Create Poll
        </button>

        <button
          className="items-center text-white text-lg font-serif bg-gradient-to-r from-blue-500 to-purple-500 animate-bounce focus:animate-none hover:animate-none inline-flex text-md font-bold mt-5 px-4 py-2 rounded-lg tracking-wide"
          onClick={() => navigate("/create-feedback")}
        >
          Create Feedback Form
        </button>
      </div>

      {/* Display Polls */}
      <h2 className="text-3xl font-bold mt-8 text-white">Your Polls</h2>
      {polls.length === 0 ? (
        <p className="text-white mt-4">No polls created yet.</p>
      ) : (
        <ul className="mt-4">
          {polls.map((poll) => (
            <li
              key={poll.pollId}
              className="bg-gradient-to-r from-purple-700 via-blue-800 to-purple-700 p-4 rounded mb-4 flex justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{poll.title}</h3>
                <p className="text-white">Total Votes: {poll.totalVotes}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/vote/${poll.pollId}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-3xl font-bold mt-8 text-white">
        Your Feedback Forms
      </h2>
      {feedbacks.length === 0 ? (
        <p className="text-white mt-4">No feedback forms created yet.</p>
      ) : (
        <ul className="mt-4">
          {feedbacks.map((feedback) => (
            <li
              key={feedback.feedbackId}
              className="bg-gradient-to-r from-purple-700 via-blue-800 to-purple-700 p-4 rounded mb-4 flex justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white">
                  {feedback.title}
                </h3>
                <p className="text-white">
                  Total Submissions: {feedback.totalSubmissions}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/feedback/${feedback.feedbackId}`)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  View Feedback
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
