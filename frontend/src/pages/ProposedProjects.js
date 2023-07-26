import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Link } from 'react-router-dom';

const ProposedProjects = () => {
  const proposedProjects = [
    { id: 1, title: 'Project 1', description: 'Description for Project 1' },
    { id: 2, title: 'Project 2', description: 'Description for Project 2' },
    { id: 3, title: 'Project 3', description: 'Description for Project 3' },
    { id: 4, title: 'Project 4', description: 'Description for Project 4' },
  ];

  return (
    <div className="container"> 
      {proposedProjects.map((project) => (
        <div className="card mb-3" key={project.id}> 
          <div className="card-body"> 
            <h3 className="card-title">{project.title}</h3> 
            <p className="card-text">{project.description}</p> 
            <div className="d-flex justify-content-between">
              <button className="btn btn-success">Approve</button>
              <button className="btn btn-danger">Deny</button>
            </div>
          </div>
        </div>
      ))}
      <Link to="/new-proposal" className="btn btn-primary">Create New Proposal</Link>
    </div>
  );
};

export default ProposedProjects;