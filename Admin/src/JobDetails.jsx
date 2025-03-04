//JobDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./App.css";

const JobDetails = ({ onScheduleMeetingClick }) => {
    const { jobTitle } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [rankedApplicants, setRankedApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ranked, setRanked] = useState(false);
    const [saving, setSaving] = useState(false);
    const [numSelected, setNumSelected] = useState(5);
    const [csvDownloadLink, setCsvDownloadLink] = useState("");
    const [selectionCompleted, setSelectionCompleted] = useState(false);
    
    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/applications")
            .then((response) => {
                const filteredApplicants = response.data.filter(applicant => applicant.job_name === jobTitle);
                setApplicants(filteredApplicants);
                setRankedApplicants(filteredApplicants);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching applications:", error);
                setLoading(false);
            });
    }, [jobTitle]);

    const handleRankClick = () => {
        const sortedApplicants = [...applicants].sort((a, b) => b.cvInterview_score - a.cvInterview_score);
        setRankedApplicants(sortedApplicants);
        setRanked(true);
    };

    const handleSaveSelected = async () => {
        setSaving(true);
        setCsvDownloadLink("");

        try {
            const topCandidates = rankedApplicants.slice(0, numSelected).map((app, index) => ({
                rank: index + 1,
                name: app.name,
                email: app.email,
                cvInterview_score: app.cvInterview_score,
                cv: app.cv,
                job_name: jobTitle 
            }));

            const response = await axios.post("http://127.0.0.1:8000/save_selected", topCandidates, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data.file_path) {
                setCsvDownloadLink(`http://127.0.0.1:8000/${response.data.file_path}`);
                alert("Selected candidates saved successfully!");
                setSelectionCompleted(true); 
            } else {
                throw new Error("Failed to save candidates.");
            }
        } catch (error) {
            console.error("Error saving selected candidates:", error);
            alert("Failed to save selected candidates.");
        }

        setSaving(false);
    };

    // JobDetails.jsx

const handleScheduleMeetingClick = () => {
    // Get the selected candidate emails
    const selectedEmails = rankedApplicants.slice(0, numSelected).map(app => app.email);
    
    // Navigate to the ScheduleMeeting route and pass the selectedEmails as state
    navigate("/admin/schedule-meeting", { state: { selectedEmails } });
};


    return (
        <div className="p-6 relative">
            <h2 className="text-3xl font-semibold mb-6 text-black">{jobTitle} Applicants</h2>
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <>
                    <table className="w-full text-left border-separate border-spacing-2 bg-white shadow-xl rounded-lg">
                        <thead className="bg-teal-800 text-white">
                            <tr>
                                <th className="py-3 px-6">Rank</th>
                                <th className="py-3 px-6">Name</th>
                                <th className="py-3 px-6">Email</th>
                                <th className="py-3 px-6">CV Score</th>
                                <th className="py-3 px-6">Download CV</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankedApplicants.map((app, index) => (
                                <tr key={app.id} className="border-b hover:bg-teal-50">
                                    <td className="py-3 px-6 text-center">{ranked ? index + 1 : "-"}</td>
                                    <td className="py-3 px-6">{app.name}</td>
                                    <td className="py-3 px-6">{app.email}</td>
                                    <td className="py-3 px-6 text-center">{app.cvInterview_score}</td>
                                    <td className="py-3 px-6 text-center">
                                        <a
                                            href={`http://127.0.0.1:8000/uploads/${app.cv}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-teal-600 hover:underline"
                                        >
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center gap-4 mt-6">
                        <button
                            onClick={handleRankClick}
                            className="bg-teal-600 text-white px-6 py-3 rounded-lg transition duration-300 hover:bg-teal-700"
                            disabled={selectionCompleted}
                        >
                            Rank
                        </button>

                        {ranked && !selectionCompleted && (
                            <>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="numSelected" className="text-gray-700">Select number of candidates:</label>
                                    <input
                                        id="numSelected"
                                        type="number"
                                        value={numSelected}
                                        min="1"
                                        max={rankedApplicants.length}
                                        onChange={(e) => setNumSelected(Number(e.target.value))}
                                        className="border px-4 py-2 rounded-lg w-20"
                                    />
                                </div>

                                <button
                                    onClick={handleSaveSelected}
                                    disabled={saving || selectionCompleted}
                                    className={`px-6 py-3 rounded-lg transition duration-300 ${saving || selectionCompleted ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                                >
                                    {saving ? "Saving..." : "Save Selected"}
                                </button>
                            </>
                        )}
                    </div>

                    <button 
                        onClick={handleScheduleMeetingClick} // Trigger the navigation function
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
                    >
                        Schedule Interview
                    </button>
                </>
            )}
        </div>
    );
};

export default JobDetails;
