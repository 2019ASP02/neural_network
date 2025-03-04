import React, { useState, useEffect } from "react";
import axios from "axios";
import "./User.css";
import Modal from "react-modal";

const API_BASE_URL = "http://localhost:8000";

Modal.setAppElement("#root");

const User = () => {
  const [vacancies, setVacancies] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicant, setApplicant] = useState({ name: "", email: "", cv: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/vacancies`);
      setVacancies(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job vacancies:", error);
      setError("Failed to load vacancies. Please try again.");
      setLoading(false);
    }
  };

  const handleApplyClick = (job_id) => {
    setSelectedJobId(job_id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setApplicant({ name: "", email: "", cv: null });
  };

  const handleFileUpload = (event) => {
    setApplicant({ ...applicant, cv: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!applicant.name || !applicant.email || !selectedJobId || !applicant.cv) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", applicant.name);
    formData.append("email", applicant.email);
    formData.append("applied_for", selectedJobId);
    formData.append("cv", applicant.cv);

    try {
      await axios.post(`${API_BASE_URL}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Application submitted successfully!.");
    }
  };

  if (loading) {
    return <div className="loading">Loading vacancies...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-container">
      <h2 className="title">Job Vacancies</h2>
      <div className="vacancies-grid">
        {vacancies.map((job) => (
          <div key={job.job_id} className="vacancy-box">
            <h3>{job.job_name}</h3>
            <p><strong>Job ID:</strong> {job.job_id}</p>
            <p><strong>Years of Experience:</strong> {job.years_of_experience} years</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Post Date:</strong> {job.post_date}    <strong>Close Date:</strong> {job.close_date}</p>
            <p><strong>No. of Vacancies:</strong> {job.no_of_vacancies}</p>
            <button onClick={() => handleApplyClick(job.job_id)}>Apply</button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Apply for Job"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2 className="title">Apply for Job ID: {selectedJobId}</h2>
        <form onSubmit={handleSubmit} className="apply-form">
          <label>Name:</label>
          <input
            type="text"
            value={applicant.name}
            onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={applicant.email}
            onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
            required
          />

          <label>Upload CV:</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} required />

          <button type="submit" className="submit-button">Submit Application</button>
          <button onClick={closeModal} className="cancel-button">Cancel</button>
        </form>
      </Modal>

      <div className="iframe-container">
        <iframe
            src=""
            title="MicroSoft copilot studio"
            width="400"
            height="250"
            style={{ border: 'none' }}></iframe>
     </div>


    </div>
  );
};

export default User;