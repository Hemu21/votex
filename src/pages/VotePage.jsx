import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { usePollFeedback } from "../hooks";
import { EthContext } from "../context";
import toast from "react-hot-toast";

const Vote = () => {
  const { pollId } = useParams();
  const { getPoll, vote, getVotes, getUserVoted, closePoll } =
    usePollFeedback();
  const { account, contract } = useContext(EthContext);

  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [creator, setCreator] = useState("");
  const [restricted, setRestricted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExists, setIsExists] = useState(true);

  useEffect(() => {
    async function fetchPoll() {
      try {
        setLoading(true);
        const pollData = await getPoll(pollId);
        setTitle(pollData.title);
        setOptions(pollData.options);
        setCreator(pollData.creator);
        setRestricted(pollData.restricted);
        setIsExists(pollData.exists);
        setIsCreator(pollData.creator === account);

        if (pollData.creator !== account) {
          const alreadyVoted = await getUserVoted(pollId);
          if (alreadyVoted) setVoteSubmitted(true);
        }

        const votesArray = await Promise.all(
          pollData.options.map((_, index) => getVotes(pollId, index))
        );
        setVotes(votesArray);
      } catch (error) {
        toast.error("Failed to get poll data. Please try again.");
        console.error("Error fetching poll data:", error);
      }
      setLoading(false);
    }
    if (pollId && account && contract) {
      fetchPoll();
    }
  }, [pollId, account, contract]);

  const updateVotes = async () => {
    try {
      const updatedVotes = await Promise.all(
        options.map((_, index) => getVotes(pollId, index))
      );
      setVotes(updatedVotes);
    } catch (error) {
      console.error("Error updating votes:", error);
    }
  };

  const handleVote = async () => {
    if (isCreator) {
      toast("Poll creators cannot vote.");
      return;
    }
    if (selectedOption === null) {
      toast("Please select an option!");
      return;
    }
    if (voteSubmitted) {
      toast("You have already voted for this poll!");
      return;
    }
    setLoading(true);
    try {
      await vote(pollId, selectedOption);
      await updateVotes();
      setVoteSubmitted(true);
      toast.success(
        `Your vote for "${options[selectedOption]}" has been submitted!`
      );
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to submit vote. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePoll = async () => {
    setLoading(true);
    try {
      await closePoll(pollId);
      toast.success("Poll closed successfully!");
    } catch (error) {
      console.error("Error closing poll:", error);
      toast.error("Failed to close poll. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!title || options.length === 0)
    return (
      <p className="text-white text-center mt-10">
        {loading ? "loading..." : "Poll not found."}
      </p>
    );

  return (
    <div className="max-w-lg mt-10 mx-auto p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-400 text-sm mb-4">Poll ID: {pollId}</p>
      {isExists ? (
        <>
          {isCreator && (
            <div className="mb-4">
              <p className="text-yellow-300">
                You are the poll creator. Voting on your own poll is not
                allowed.
              </p>
              {
                <button
                  onClick={() => handleClosePoll()}
                  disabled={loading}
                  className={`px-4 py-2 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  } rounded text-white bg-red-500 hover:bg-red-600 mt-2`}
                >
                  {loading ? "Closing..." : "Close Poll"}
                </button>
              }
            </div>
          )}

          {voteSubmitted ? (
            <p className="text-green-400 text-lg font-bold">
              ✅ Vote Submitted
            </p>
          ) : !isCreator ? (
            options.map((option, index) => (
              <label key={index} className="block mb-2">
                <input
                  type="radio"
                  name="vote"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="mr-2"
                />
                {option} (Votes: {votes[index] || 0})
              </label>
            ))
          ) : null}

          {!voteSubmitted && !isCreator && (
            <button
              onClick={handleVote}
              disabled={loading}
              className={`px-4 py-2 rounded text-white mt-4 bg-green-500 hover:bg-green-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit Vote"}
            </button>
          )}

          {(isCreator || voteSubmitted) && (
            <div className="mt-6">
              <h3 className="text-lg font-bold">Poll Results:</h3>
              {options.map((option, index) => (
                <p key={index}>
                  {option}: {votes[index] || 0} votes
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-400">Poll creator: {creator}</p>
            <p className="text-gray-400">
              Restricted: {restricted ? "Yes" : "No"}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-bold">Poll Results:</h3>
              {options.map((option, index) => (
                <p key={index} className="text-gray-400">
                  {option}: {votes[index] || 0} votes
                </p>
              ))}
            </div>

            <p className="text-red-500 mt-5 font-bold text-lg">
              This poll has been closed. No further voting is allowed.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Vote;
