import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import { usePollFeedback } from "../hooks";
import toast from "react-hot-toast";

const CreatePoll = () => {
  const { createPoll } = usePollFeedback();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [pollLink, setPollLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState("");

  const handleAddOption = () => setOptions([...options, ""]);

  const handleDeleteOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      toast.error("A poll must have at least two options.");
    }
  };

  const handleChangeOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();

    if (!title.trim() || options.some((opt) => !opt.trim())) {
      toast("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const restricted = isRestricted;
      const allowedVoters = isRestricted
        ? walletAddresses
            .split("\n")
            .map((addr) => addr.trim())
            .filter(Boolean)
        : [];

      const pollId = await createPoll(
        title,
        description,
        options,
        restricted,
        allowedVoters
      );
      const voteLink = `${window.location.origin}/vote/${pollId}`;
      setPollLink(voteLink);
      toast.success("Poll created successfully!");
    } catch (error) {
      console.error("Error creating poll:", error);
      toast.error("Failed to create poll. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Copy poll link to clipboard
  const handleCopyLink = () => {
    if (pollLink) {
      navigator.clipboard.writeText(pollLink);
      toast("Poll link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center mt-[-40px]">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-16 py-10 bg-white shadow-lg rounded-3xl">
          <div className="w-[300px] mx-auto">
            <h4 className="text-2xl font-bold font-sans text-gray-700 text-center">
              Create a Poll
            </h4>
            <form
              onSubmit={handleCreatePoll}
              className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              {/* Poll Title Input */}
              <div className="relative">
                <label className="text-gray-600">Enter Poll Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Enter poll title"
                  className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                />
              </div>
              {/* Poll Description Input (optional) */}
              <div className="relative">
                <label className="text-gray-600">
                  Poll Description (optional)
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  placeholder="Enter description"
                  className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                />
              </div>
              {/* Poll Options */}
              {options.map((option, index) => (
                <div className="relative flex items-center gap-2" key={index}>
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleChangeOption(index, e.target.value)}
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="text-red-500 text-2xl"
                      onClick={() => handleDeleteOption(index)}
                    >
                      <IoCloseSharp />
                    </button>
                  )}
                </div>
              ))}
              {/* Add/Delete Option Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="rounded text-purple-500 text-base px-2 py-1 border border-purple-500"
                  onClick={handleAddOption}
                >
                  + Add Option
                </button>
                <button
                  type="button"
                  className="rounded text-red-500 text-base px-2 py-1 border border-red-500"
                  onClick={() => {
                    if (options.length > 2) {
                      setOptions(options.slice(0, -1));
                    } else {
                      alert("A poll must have at least two options.");
                    }
                  }}
                >
                  - Delete Option
                </button>
              </div>
              <div className="relative flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={isRestricted}
                  onChange={() => setIsRestricted(!isRestricted)}
                  className="h-5 w-5"
                />
                <span className="text-gray-600">Restrict Poll</span>
              </div>
              {/* Wallet Addresses Textarea */}
              {isRestricted && (
                <div className="relative mt-4">
                  <label className="text-gray-600">
                    Enter Wallet Addresses (one per line)
                  </label>
                  <textarea
                    value={walletAddresses}
                    onChange={(e) => setWalletAddresses(e.target.value)}
                    rows="4"
                    placeholder="Enter wallet addresses"
                    className="w-full border-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 p-2"
                  />
                </div>
              )}
              {/* Create Poll Button */}
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
                  {loading ? "Creating..." : "Create Poll"}
                </button>
              </div>
            </form>
            {/* Display and Copy Poll Link */}
            {pollLink && (
              <div className="text-center w-full mt-4">
                <p className="text-lg text-gray-500">Share this link:</p>
                <div className="flex items-center justify-center gap-2 border border-gray-300 px-2 py-1 rounded-lg">
                  <a
                    href={pollLink}
                    className="text-blue-500 underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pollLink}
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

export default CreatePoll;
