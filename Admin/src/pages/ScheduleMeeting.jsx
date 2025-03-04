import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScheduleMeeting = () => {
    const location = useLocation();
    const [meetingDetails, setMeetingDetails] = useState({
        interviewDate: '',
        startTime: '',
        endTime: '',
        participants: [],
        participantEmail: '',
    });

    // If there are selected emails passed from the JobDetails page, use them as default participants
    useEffect(() => {
        if (location.state && location.state.selectedEmails) {
            setMeetingDetails((prev) => ({
                ...prev,
                participants: location.state.selectedEmails,
            }));
        }
    }, [location.state]);

    // Handle input changes (date and time)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMeetingDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add participant email to the list
    const handleAddParticipant = () => {
        if (meetingDetails.participantEmail) {
            setMeetingDetails((prev) => ({
                ...prev,
                participants: [...prev.participants, meetingDetails.participantEmail],
                participantEmail: '', // Clear input after adding
            }));
        }
    };

    // Submit the meeting details
    const handleSubmitMeeting = () => {
        const { interviewDate, startTime, endTime, participants } = meetingDetails;
        if (!interviewDate || !startTime || !endTime || participants.length === 0) {
            alert('Please fill in all meeting details');
            return;
        }
        alert(`Meeting scheduled on ${interviewDate} from ${startTime} to ${endTime} with participants: ${participants.join(', ')}`);
        // Reset meeting details after submission
        setMeetingDetails({
            interviewDate: '',
            startTime: '',
            endTime: '',
            participants: [],
            participantEmail: '',
        });
    };

    return (
        <div className="meeting-scheduler-container p-6">
            <h2 className="text-2xl font-semibold mb-4">Schedule Interview</h2>

            {/* Interview Date Input */}
            <div className="mb-4">
                <label htmlFor="interviewDate" className="block text-sm">Interview Date</label>
                <input
                    type="date"
                    id="interviewDate"
                    name="interviewDate"
                    value={meetingDetails.interviewDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            {/* Start Time Input */}
            <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm">Start Time</label>
                <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={meetingDetails.startTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            {/* End Time Input */}
            <div className="mb-4">
                <label htmlFor="endTime" className="block text-sm">End Time</label>
                <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={meetingDetails.endTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            {/* Participant Email Input */}
            <div className="mb-4">
                <label htmlFor="participantEmail" className="block text-sm">Participant Email</label>
                <input
                    type="email"
                    id="participantEmail"
                    name="participantEmail"
                    value={meetingDetails.participantEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter participant email"
                />
                <button
                    onClick={handleAddParticipant}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-2"
                >
                    Add Participant
                </button>
            </div>

            {/* List of Added Participants */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold">Participants:</h3>
                <ul>
                    {meetingDetails.participants.map((email, idx) => (
                        <li key={idx}>{email}</li>
                    ))}
                </ul>
            </div>

            {/* Submit Meeting Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmitMeeting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Send Invite link
                </button>
            </div>
        </div>
    );
};

export default ScheduleMeeting;
