import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProposalForm = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [participants, setParticipants] = useState('');
  const [photos, setPhotos] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', projectName, projectDescription, budget, participants, photos);
    navigate('/proposed-projects');
  };

  return (
    <div className="container">
      <h2>Create a New Project Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="projectName" className="form-label">Project Name</label>
          <input type="text" className="form-control" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="projectDescription" className="form-label">Project Description</label>
          <textarea className="form-control" id="projectDescription" rows="3" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="budget" className="form-label">Budget</label>
          <input type="text" className="form-control" id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="participants" className="form-label">Participants</label>
          <input type="text" className="form-control" id="participants" value={participants} onChange={(e) => setParticipants(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="photos" className="form-label">Photos</label>
          <input type="file" className="form-control" id="photos" onChange={(e) => setPhotos(e.target.files[0])} />
        </div>
        <button type="submit" className="btn btn-primary">Submit Proposal</button>
      </form>
    </div>
  );
};

export default ProposalForm;
