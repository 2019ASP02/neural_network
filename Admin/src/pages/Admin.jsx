import React, { useState, useEffect } from "react";
import axios from "axios";
import JobApplicants from "./JobApplicants";
import ScheduleMeeting from "./ScheduleMeeting";
import Footer from "./Footer";
import LogoutButton from './LogoutButton';
import "./Admin.css";
import JobPosting from "./JobPosting";

const Admin = ({ onLogout }) => {
    const [vacancies, setVacancies] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState([]); 
    const [activeTab, setActiveTab] = useState("jobPosting");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            axios.get("http://127.0.0.1:8000/vacancies"),
            axios.get("http://127.0.0.1:8000/applications"),
            axios.get("http://127.0.0.1:8000/selected_candidates")
        ]).then(([vacanciesResponse, applicationsResponse, selectedCandidatesResponse]) => {
            setVacancies(vacanciesResponse.data);
            setApplicants(applicationsResponse.data);
            setSelectedCandidates(selectedCandidatesResponse.data);
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching data", error);
            setLoading(false);
        });
    }, []);

    return (
        <>
            <main className="admin-container">
                {/* Sidebar Navigation */}
                <aside className="sidebar full-width">
                    <ul>
                        <li 
                            className={activeTab === "jobPosting" ? "active" : ""}
                            onClick={() => setActiveTab("jobPosting")}
                        >
                            Job Posting
                        </li>
                        <li 
                            className={activeTab === "jobApplicants" ? "active" : ""}
                            onClick={() => setActiveTab("jobApplicants")}
                        >
                            Job Applicants
                        </li>
                        <li 
                            className={activeTab === "scheduleMeeting" ? "active" : ""}
                            onClick={() => setActiveTab("scheduleMeeting")}
                        >
                            Schedule Interview
                        </li>
                    </ul>

                    {/* Logout Button */}
					<ul>
					<li><LogoutButton /></li>
					</ul>
                </aside>

                {/* Content Area */}
                <div className="content">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <>
                            {activeTab === "jobPosting" && (
                                <JobPosting vacancies={vacancies} setVacancies={setVacancies} />
                            )}
                            {activeTab === "jobApplicants" && (
                                <JobApplicants applicants={applicants} setApplicants={setApplicants} />
                            )}
                            {activeTab === "scheduleMeeting" && (
                                <ScheduleMeeting />
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Admin;
