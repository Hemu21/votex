import { useState } from "react";
import { LuCopy } from "react-icons/lu";
import { usePollFeedback } from "../hooks";
import toast from "react-hot-toast";

const CreateFeedback = () => {
  const { createFeedback } = usePollFeedback();

  // State for form inputs and UI feedback
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRestricted, setIsRestricted] = useState(false);
  const [allowedSubmitters, setAllowedSubmitters] = useState("");
  const [feedbackLink, setFeedbackLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateFeedback = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // If restricted, split allowed addresses by newline and filter empty lines.
      const allowedArray = isRestricted
        ? allowedSubmitters
            .split("\n")
            .map((addr) => addr.trim())
            .filter(Boolean)
        : [];

      // Call the on-chain createFeedback function via your hook
      const feedbackId = await createFeedback(
        title,
        description,
        isRestricted,
        allowedArray
      );

      // Generate a feedback link using the returned feedbackId
      const link = `${window.location.origin}/feedback/${feedbackId}`;
      setFeedbackLink(link);
      toast.success("Feedback form created successfully!");
    } catch (error) {
      console.error("Error creating feedback:", error);
      toast.error("Failed to create feedback. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Copy feedback link to clipboard
  const handleCopyLink = () => {
    if (feedbackLink) {
      navigator.clipboard.writeText(feedbackLink);
      toast("Feedback link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center mt-[-40px]">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-16 py-10 bg-white shadow-lg rounded-3xl">
          <div className="w-[300px] mx-auto">
            <h1 className="text-2xl font-bold font-sans text-gray-700 text-center mb-6">
              Create a Feedback Form
            </h1>
            <form
              onSubmit={handleCreateFeedback}
              className="space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter feedback title"
                  className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="Enter feedback description"
                  className="w-full border-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 p-2"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {/* Toggle for restricted feedback form */}
              <div className="relative flex items-center gap-2">
                <input
                  type="checkbox"
                  id="restricted"
                  checked={isRestricted}
                  onChange={() => setIsRestricted(!isRestricted)}
                  className="h-5 w-5"
                />
                <label htmlFor="restricted" className="text-gray-600 text-sm">
                  Restrict feedback form to specific wallet addresses
                </label>
              </div>
              {/* Conditional Textarea for allowed submitters */}
              {isRestricted && (
                <div className="relative">
                  <textarea
                    placeholder="Enter wallet addresses (one per line)"
                    className="w-full border-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 p-2"
                    rows="4"
                    value={allowedSubmitters}
                    onChange={(e) => setAllowedSubmitters(e.target.value)}
                  />
                </div>
              )}
              <div className="relative flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center text-white font-bold bg-gradient-to-r from-blue-300 to-purple-500 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "animate-bounce hover:animate-none"
                  } inline-flex text-md mt-5 px-4 py-2 rounded-lg tracking-wide`}
                >
                  {loading ? "Creating..." : "Create Feedback"}
                </button>
              </div>
            </form>
            {feedbackLink && (
              <div className="text-center w-full mt-4">
                <p className="text-lg text-gray-500">Share this link:</p>
                <div className="flex items-center justify-center gap-2 border border-gray-300 px-2 py-1 rounded-lg">
                  <a
                    href={feedbackLink}
                    className="text-blue-500 underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {feedbackLink}
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="text-gray-700 hover:text-black"
                  >
                    <LuCopy size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedback;
