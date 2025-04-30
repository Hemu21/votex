// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PollFeedback {
    uint256 public pollCount;
    uint256 public feedbackCount;

    struct Poll {
        address creator;
        string title;
        string description;
        string[] options;
        bool restricted;
        mapping(address => bool) allowedVoters;
        mapping(address => bool) hasVoted;
        mapping(uint256 => uint256) votes;
        bool exists;
    }

    struct Feedback {
        address creator;
        string title;
        string description;
        bool restricted;
        mapping(address => bool) allowedSubmitters;
        mapping(address => bool) hasSubmitted;
        string[] submissions;
        bool exists;
    }

    mapping(uint256 => Poll) public polls;
    mapping(uint256 => Feedback) public feedbacks;

    event PollCreated(uint256 pollId, address creator, string title);
    event Voted(uint256 pollId, address voter, uint256 option);
    event FeedbackCreated(uint256 feedbackId, address creator, string title);
    event FeedbackSubmitted(
        uint256 feedbackId,
        address submitter,
        string message
    );

    // Create a new poll
    function createPoll(
        string memory _title,
        string memory _description,
        string[] memory _options,
        bool _restricted,
        address[] memory _allowedVoters
    ) public {
        require(bytes(_title).length > 0, "Title is required");
        require(_options.length >= 2, "At least two options required");

        pollCount++;
        Poll storage p = polls[pollCount];
        p.creator = msg.sender;
        p.title = _title;
        p.description = _description;
        p.options = _options;
        p.restricted = _restricted;
        p.exists = true;

        if (_restricted) {
            for (uint256 i = 0; i < _allowedVoters.length; i++) {
                p.allowedVoters[_allowedVoters[i]] = true;
            }
        }

        emit PollCreated(pollCount, msg.sender, _title);
    }

    // Vote on a poll
    function vote(uint256 _pollId, uint256 _option) public {
        Poll storage p = polls[_pollId];
        require(p.exists, "Poll does not exist");
        require(_option < p.options.length, "Invalid option");
        require(!p.hasVoted[msg.sender], "Already voted");

        if (p.restricted) {
            require(p.allowedVoters[msg.sender], "Not authorized to vote");
        }

        p.votes[_option]++;
        p.hasVoted[msg.sender] = true;

        emit Voted(_pollId, msg.sender, _option);
    }

    // Create new feedback
    function createFeedback(
        string memory _title,
        string memory _description,
        bool _restricted,
        address[] memory _allowedSubmitters
    ) public {
        require(bytes(_title).length > 0, "Title is required");
        require(bytes(_description).length > 0, "Description is required");

        feedbackCount++;
        Feedback storage f = feedbacks[feedbackCount];
        f.creator = msg.sender;
        f.title = _title;
        f.description = _description;
        f.restricted = _restricted;
        f.exists = true;

        if (_restricted) {
            for (uint256 i = 0; i < _allowedSubmitters.length; i++) {
                f.allowedSubmitters[_allowedSubmitters[i]] = true;
            }
        }

        emit FeedbackCreated(feedbackCount, msg.sender, _title);
    }

    // Submit feedback
    function submitFeedback(
        uint256 _feedbackId,
        string memory _message
    ) public {
        Feedback storage f = feedbacks[_feedbackId];
        require(f.exists, "Feedback does not exist");
        require(!f.hasSubmitted[msg.sender], "Already submitted feedback");

        if (f.restricted) {
            require(
                f.allowedSubmitters[msg.sender],
                "Not authorized to submit feedback"
            );
        }

        f.submissions.push(_message);
        f.hasSubmitted[msg.sender] = true;

        emit FeedbackSubmitted(_feedbackId, msg.sender, _message);
    }

    function closePoll(uint256 _pollId) public returns (bool) {
        require(polls[_pollId].exists, "Poll does not exist");
        require(
            polls[_pollId].creator == msg.sender,
            "Only creator can close poll"
        );
        polls[_pollId].exists = false;
        return true;
    }

    function closeFeedback(uint256 _feedbackId) public returns (bool) {
        require(feedbacks[_feedbackId].exists, "Feedback does not exist");
        require(
            feedbacks[_feedbackId].creator == msg.sender,
            "Only creator can close the feedback"
        );
        feedbacks[_feedbackId].exists = false;
        return true;
    }

    function getPoll(
        uint256 _pollId
    )
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string[] memory,
            bool,
            bool
        )
    {
        Poll storage p = polls[_pollId];
        return (
            p.creator,
            p.title,
            p.description,
            p.options,
            p.restricted,
            p.exists
        );
    }

    // Get poll options
    function getPollOptions(
        uint256 _pollId
    ) public view returns (string[] memory) {
        Poll storage p = polls[_pollId];
        return p.options;
    }

    function isUserVoted(
        uint256 _pollId,
        address _voter
    ) public view returns (bool) {
        Poll storage p = polls[_pollId];
        return p.hasVoted[_voter];
    }

    // Get votes for a poll option
    function getVotes(
        uint256 _pollId,
        uint256 _option
    ) public view returns (uint256) {
        Poll storage p = polls[_pollId];
        require(_option < p.options.length, "Invalid option");
        return p.votes[_option];
    }

    // Get feedback submissions
    function getFeedbackSubmissions(
        uint256 _feedbackId
    ) public view returns (string[] memory) {
        Feedback storage f = feedbacks[_feedbackId];
        return f.submissions;
    }

    function getFeedback(
        uint256 _feedbackId
    )
        public
        view
        returns (
            address,
            string memory,
            string memory,
            bool,
            string[] memory,
            bool
        )
    {
        Feedback storage f = feedbacks[_feedbackId];
        return (
            f.creator,
            f.title,
            f.description,
            f.restricted,
            f.submissions,
            f.exists
        );
    }

    function isUserSubmitted(
        uint256 _feedbackId,
        address _submitter
    ) public view returns (bool) {
        Feedback storage f = feedbacks[_feedbackId];
        return f.hasSubmitted[_submitter];
    }

    function getUserCreatedPolls(
        address user
    )
        public
        view
        returns (
            uint256[] memory pollIds,
            string[] memory titles,
            uint256[] memory totalVotes
        )
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].creator == user) {
                count++;
            }
        }

        pollIds = new uint256[](count);
        titles = new string[](count);
        totalVotes = new uint256[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].creator == user) {
                pollIds[index] = i;
                titles[index] = polls[i].title;

                uint256 total = 0;
                for (uint256 j = 0; j < polls[i].options.length; j++) {
                    total += polls[i].votes[j];
                }
                totalVotes[index] = total;
                index++;
            }
        }
        return (pollIds, titles, totalVotes);
    }

    function getUserCreatedFeedbacks(
        address user
    )
        public
        view
        returns (
            uint256[] memory feedbackIds,
            string[] memory titles,
            uint256[] memory totalSubmissions
        )
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= feedbackCount; i++) {
            if (feedbacks[i].creator == user) {
                count++;
            }
        }

        feedbackIds = new uint256[](count);
        titles = new string[](count);
        totalSubmissions = new uint256[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= feedbackCount; i++) {
            if (feedbacks[i].creator == user) {
                feedbackIds[index] = i;
                titles[index] = feedbacks[i].title;
                totalSubmissions[index] = feedbacks[i].submissions.length;
                index++;
            }
        }

        return (feedbackIds, titles, totalSubmissions);
    }
}
