import React from 'react';

const ProposedProjects = () => {
  const proposedProjects = [
    { id: 1, title: 'Project 1', description: 'Description for Project 1' },
    { id: 2, title: 'Project 2', description: 'Description for Project 2' },
    { id: 3, title: 'Project 3', description: 'Description for Project 3' },
    { id: 4, title: 'Project 4', description: 'Description for Project 4' },
  ];

  return (
    <div>
      <h2>Proposed Projects</h2>
      {proposedProjects.map((project) => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProposedProjects;
