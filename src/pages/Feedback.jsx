import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { usePollFeedback } from "../hooks";
import { EthContext } from "../context";
import toast from "react-hot-toast";

const Feedback = () => {
  const { feedbackId } = useParams();
  const { getFeedback, submitFeedback, getUserFeedback, closeFeedback } =
    usePollFeedback();
  const { account, contract } = useContext(EthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [isUserSubmitted, setIsUserSubmitted] = useState(false);
  const [creator, setCreator] = useState("");
  const [isExists, setIsExists] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restricted, setRestricted] = useState(false);

  useEffect(() => {
    async function fetchFeedback() {
      setLoading(true);
      try {
        const feedbackData = await getFeedback(feedbackId);
        console.log(
          "Feedback Data:",
          feedbackData,
          feedbackData.creator == account,
          account
        );
        setTitle(feedbackData.title);
        setDescription(feedbackData.description);
        setSubmissions(feedbackData.submissions);
        setCreator(feedbackData.creator);
        setIsCreator(feedbackData.creator === account);
        setIsExists(feedbackData.exists);
        setRestricted(feedbackData.restricted);
        if (feedbackData.creator !== account) {
          const userFeedback = await getUserFeedback(feedbackId);
          setIsUserSubmitted(userFeedback);
        }
      } catch (error) {
        toast.error("Failed to get feedback form. Please try again.");
        console.error("Error fetching feedback data:", error);
      }
      setLoading(false);
    }
    if (feedbackId && account && contract) {
      fetchFeedback();
    }
  }, [feedbackId, account, contract]);

  const handleSubmitFeedback = async () => {
    if (!newFeedback.trim()) {
      toast("Please enter your feedback!");
      return;
    }
    if (isCreator) {
      toast("Feedback form creator cannot submit feedback.");
      return;
    }
    setLoading(true);
    try {
      await submitFeedback(feedbackId, newFeedback);
      const updatedFeedback = await getFeedback(feedbackId);
      setSubmissions(updatedFeedback.submissions);
      setNewFeedback("");
      toast.success("Your feedback has been submitted!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseFeedback = async () => {
    setLoading(true);
    try {
      await closeFeedback(feedbackId);
      toast.success("Feedback form closed successfully!");
    } catch (error) {
      console.error("Error closing feedback form:", error);
      toast.error("Failed to close feedback form. See console for details.");
    } finally {
      setLoading(false);
    }
  };
  if (!title) {
    return (
      <p className="text-white text-center mt-10">
        {loading ? "loading..." : "Feedback form not found."}
      </p>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-400 mb-4">{description}</p>
      <p className="text-gray-400 text-sm mb-4">Feedback ID: {feedbackId}</p>
      {isExists ? (
        <>
          {isCreator && (
            <button
              onClick={() => handleCloseFeedback()}
              className={`px-4 py-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              } rounded text-white bg-red-500 hover:bg-red-600 mb-4`}
            >
              {loading ? "Closing..." : "Close Feedback Form"}
            </button>
          )}
          {!isCreator &&
            (isUserSubmitted ? (
              <>
                <p className="text-green-500 mb-4">
                  Your feedback has been submitted!
                </p>
              </>
            ) : (
              <>
                <textarea
                  className="w-full p-2 mt-4 rounded bg-gray-700 text-white"
                  placeholder="Write your feedback..."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  rows="4"
                ></textarea>

                <button
                  onClick={handleSubmitFeedback}
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white mt-4 bg-green-500 hover:bg-green-600 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </>
            ))}
        </>
      ) : (
        <div className="mb-4">
          <p className="text-gray-400">Poll creator: {creator}</p>
          <p className="text-gray-400">
            Restricted: {restricted ? "Yes" : "No"}
          </p>
          <p className="text-red-500 mt-5 font-bold text-lg">
            This Feedback has been closed. No further feedback is allowed.
          </p>
        </div>
      )}
      <h3 className="text-xl mt-6 mb-3">User Feedbacks</h3>
      {submissions.length === 0 ? (
        <p className="text-gray-400">No feedback yet.</p>
      ) : (
        submissions.map((fb, index) => (
          <p key={index} className="bg-gray-700 p-2 rounded mb-2">
            {fb}
          </p>
        ))
      )}
    </div>
  );
};

export default Feedback;
