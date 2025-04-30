import { useContext } from "react";
import { EthContext } from "../context";

export const usePollFeedback = () => {
  const { contract, account } = useContext(EthContext);

  const createPoll = async (
    title,
    description,
    options,
    restricted,
    allowedVoters
  ) => {
    if (!contract) throw new Error("Contract not loaded");
    const tx = await contract.createPoll(
      title,
      description,
      options,
      restricted,
      allowedVoters
    );
    const receipt = await tx.wait();
    let pollId = "";
    receipt.logs.forEach((log) => {
      const event = contract.interface.parseLog(log);
      pollId = event.args[0].toString();
    });
    return pollId;
  };

  const getPoll = async (pollId) => {
    if (!contract) throw new Error("Contract not loaded");
    const poll = await contract.getPoll(pollId);
    console.log(poll);
    return {
      creator: poll[0],
      title: poll[1],
      description: poll[2],
      options: poll[3],
      restricted: poll[4],
      exists: poll[5],
    };
  };

  const vote = async (pollId, option) => {
    if (!contract) throw new Error("Contract not loaded");
    const tx = await contract.vote(pollId, option);
    await tx.wait();
    return tx;
  };

  const createFeedback = async (
    title,
    description,
    restricted,
    allowedSubmitters
  ) => {
    if (!contract) throw new Error("Contract not loaded");
    const tx = await contract.createFeedback(
      title,
      description,
      restricted,
      allowedSubmitters
    );
    const receipt = await tx.wait();
    let feedbackId = "";
    receipt.logs.forEach((log) => {
      const event = contract.interface.parseLog(log);
      feedbackId = event.args[0].toString();
    });
    return feedbackId;
  };

  const getUserVoted = async (pollId) => {
    if (!contract) throw new Error("Contract not loaded");
    const userVoted = await contract.isUserVoted(pollId, account);
    return userVoted;
  };

  const getUserFeedback = async (feedbackId) => {
    if (!contract) throw new Error("Contract not loaded");
    const userFeedback = await contract.isUserSubmitted(feedbackId, account);
    return userFeedback;
  };

  const getFeedback = async (feedbackId) => {
    if (!contract) throw new Error("Contract not loaded");
    const feedback = await contract.getFeedback(feedbackId);
    return {
      creator: feedback[0],
      title: feedback[1],
      description: feedback[2],
      restricted: feedback[3],
      submissions: feedback[4],
      exists: feedback[5],
    };
  };

  const submitFeedback = async (feedbackId, message) => {
    if (!contract) throw new Error("Contract not loaded");
    const tx = await contract.submitFeedback(feedbackId, message);
    await tx.wait();
    return tx;
  };

  const getPollOptions = async (pollId) => {
    if (!contract) throw new Error("Contract not loaded");
    const options = await contract.getPollOptions(pollId);
    return options;
  };

  const getVotes = async (pollId, option) => {
    if (!contract) throw new Error("Contract not loaded");
    const voteCount = await contract.getVotes(pollId, option);
    return voteCount.toString();
  };

  const getFeedbackSubmissions = async (feedbackId) => {
    if (!contract) throw new Error("Contract not loaded");
    const submissions = await contract.getFeedbackSubmissions(feedbackId);
    return submissions;
  };

  const fetchUserCreatedPolls = async (userAddress) => {
    try {
      const result = await contract.getUserCreatedPolls(userAddress);
      const [pollIds, titles, totalVotes] = result;

      const polls = pollIds.map((id, index) => ({
        pollId: id.toString(),
        title: titles[index],
        totalVotes: totalVotes[index].toString(),
      }));

      return polls;
    } catch (error) {
      console.error("Error fetching user-created polls:", error);
      return [];
    }
  };

  const fetchUserCreatedFeedbacks = async (userAddress) => {
    try {
      const result = await contract.getUserCreatedFeedbacks(userAddress);
      const [feedbackIds, titles, totalSubmissions] = result;

      const feedbacks = feedbackIds.map((id, index) => ({
        feedbackId: id.toString(),
        title: titles[index],
        totalSubmissions: totalSubmissions[index].toString(),
      }));

      return feedbacks;
    } catch (error) {
      console.error("Error fetching user-created feedbacks:", error);
      return [];
    }
  };

  const closePoll = async (pollId) => {
    if (!contract) throw new Error("Contract not loaded");
    const tx = await contract.closePoll(pollId);
    await tx.wait();
    return tx;
  };

  const closeFeedback = async (feedbackId) => {
    if (!contract) throw new Error("Contract not loaded");
    const tx = await contract.closeFeedback(feedbackId);
    await tx.wait();
    return tx;
  };

  return {
    createPoll,
    vote,
    createFeedback,
    submitFeedback,
    getPollOptions,
    getVotes,
    getFeedbackSubmissions,
    getPoll,
    getFeedback,
    getUserVoted,
    getUserFeedback,
    fetchUserCreatedPolls,
    fetchUserCreatedFeedbacks,
    closePoll,
    closeFeedback,
  };
};
