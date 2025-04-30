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
    <div className="p-10 text-center max-w-lg mx-auto bg-gray-800 rounded-lg text-white mt-10">
      <h1 className="text-3xl font-bold mb-6">Create a Feedback Form</h1>
      <form onSubmit={handleCreateFeedback} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter feedback title"
            className="border p-2 w-80 mb-2 block mx-auto text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Enter feedback description"
            className="border p-2 w-80 mb-2 block mx-auto text-black"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* Toggle for restricted feedback form */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <input
            type="checkbox"
            id="restricted"
            checked={isRestricted}
            onChange={() => setIsRestricted(!isRestricted)}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="restricted" className="text-sm text-gray-200">
            Restrict feedback form to specific wallet addresses
          </label>
        </div>
        {/* Conditional Textarea for allowed submitters */}
        {isRestricted && (
          <div className="mb-2">
            <textarea
              placeholder="Enter wallet addresses (one per line)"
              className="border p-2 w-80 block mx-auto text-black"
              rows="4"
              value={allowedSubmitters}
              onChange={(e) => setAllowedSubmitters(e.target.value)}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`bg-purple-600 py-2 px-6 rounded mt-4 block mx-auto ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
          }`}
        >
          {loading ? "Creating..." : "Create Feedback"}
        </button>
      </form>
      {feedbackLink && (
        <div className="text-center w-full mt-4">
          <p className="text-lg text-white">Share this link:</p>
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
  );
};

export default CreateFeedback;
