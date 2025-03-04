import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const API_BASE_URL = "http://localhost:8000";

const JobPosting = () => {
  const [vacancies, setVacancies] = useState([]);
  const [newJob, setNewJob] = useState({ job_name: "", years_of_experience: "", description: "", close_date: "", no_of_vacancies: "" });
  const [activeTab, setActiveTab] = useState("postJob"); // "postJob" or "vacancies"

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vacancies`);
      setVacancies(response.data);
    } catch (error) {
      console.error("Error fetching job vacancies:", error);
    }
  };

  const handleDeleteJob = async (job_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/vacancies/${job_id}`);
      setVacancies(vacancies.filter(job => job.job_id !== job_id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    const formData = {
      job_name: newJob.job_name,
      years_of_experience: parseInt(newJob.years_of_experience) || 0,
      description: newJob.description,
      post_date: today,
      close_date: newJob.close_date || today,
      no_of_vacancies: parseInt(newJob.no_of_vacancies) || 1,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/vacancies`, formData);
      setVacancies([...vacancies, response.data.job]);
      setNewJob({ job_name: "", years_of_experience: "", description: "", close_date: "", no_of_vacancies: "" });
      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error);
	  alert("Job posted successfully!.");
	  window.location.reload();
    }
  };

  return (
    <div className="tab-container">
      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "postJob" ? "active" : ""} onClick={() => setActiveTab("postJob")}>Post Job</button>
        <button className={activeTab === "vacancies" ? "active" : ""} onClick={() => setActiveTab("vacancies")}>Current Vacancies</button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "postJob" && (
          <form onSubmit={handlePostJob} className="job-form">
            <h3>Post New Vacancy</h3>
            <input type="text" placeholder="Job Name" value={newJob.job_name} onChange={(e) => setNewJob({ ...newJob, job_name: e.target.value })} required />
            <input type="number" placeholder="Years of Experience" value={newJob.years_of_experience} onChange={(e) => setNewJob({ ...newJob, years_of_experience: e.target.value })} required />
            <textarea placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} required />
            <input type="date" value={newJob.close_date} onChange={(e) => setNewJob({ ...newJob, close_date: e.target.value })} required />
            <input type="number" placeholder="Number of Vacancies" value={newJob.no_of_vacancies} onChange={(e) => setNewJob({ ...newJob, no_of_vacancies: e.target.value })} required />
            <button type="submit" className="post-button">Post Job</button>
          </form>
        )}

        {activeTab === "vacancies" && (
          <div className="vacancies-list">
            {vacancies.length === 0 ? (
              <p>No vacancies available.</p>
            ) : (
              vacancies.map((job) => (
                <div key={job.job_id} className="job-card">
                  <h3>{job.job_name}</h3>
                  <p><strong>Experience:</strong> {job.years_of_experience} years</p>
                  <p><strong>Description:</strong> {job.description}</p>
                  <p><strong>Close Date:</strong> {job.close_date}</p>
                  <p><strong>Vacancies:</strong> {job.no_of_vacancies}</p>
                  <button onClick={() => handleDeleteJob(job.job_id)} className="delete-button">Remove</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPosting;
