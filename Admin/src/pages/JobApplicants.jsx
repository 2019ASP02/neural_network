import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const JobApplicants = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/applications")
      .then(response => setApplicants(response.data))
      .catch(error => console.error("Error fetching applications:", error));
  }, []);

  // Group applicants by job title
  const groupedApplicants = applicants.reduce((acc, applicant) => {
    acc[applicant.job_name] = (acc[applicant.job_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h3 className="text-xl font-semibold mt-6">Job Applicants Summary</h3>
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Job Title</th>
            <th className="border p-2">Total Applicants</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedApplicants).map(([jobTitle, count]) => (
            <tr key={jobTitle} className="border">
              <td className="border p-2 text-blue-500 underline cursor-pointer">
                <Link to={`/job/${encodeURIComponent(jobTitle)}`}>{jobTitle}</Link>
              </td>
              <td className="border p-2">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobApplicants;
