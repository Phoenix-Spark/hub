import React, { useContext, useEffect, useState } from 'react';
import { Card, Container, Tooltip } from 'react-bootstrap';

import AppContext from '../../AppContext.js';

const ProposedProjects = () => {
  const { server, user } = useContext(AppContext);
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    let ignore = false;

    const getUserProjects = async () => {
      try {
        const response = await fetch(`${server}/user/${user.firstName}/projects`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);

          if (!ignore) setProjectList(data);
        } else {
          throw new Error(`There was an error.`);
        }
      } catch (e) {
        console.error(`There was an error: ${e}`);
      }
    };

    getUserProjects();

    return () => (ignore = true);
  }, [user]);

  const renderTooltip = () => <Tooltip id="tooltip">The review process may take up to five business days</Tooltip>;

  return (
    <Container>
      <div className="alert alert-light mb-3">The review process may take up to five business days</div>
      {projectList.length === 0 && 'No Projects to show'}
      {projectList.map(project => {
        const approvalStatus = !project.is_approved ? (project.is_approved === null ? 'Awaiting Approval' : 'Denied') : 'Approved';
        const subtitleClasses = `mb-2 border rounded p-1 ${
          !project.is_approved ? (project.is_approved === null ? 'border-info' : 'border-danger-subtle') : 'border-success-subtle'
        }`;
        return (
          <Card
            key={`${project.id}-${project.cell_id}`}
            className="mb-3"
          >
            <Card.Body>
              <Card.Title>{project.name}</Card.Title>
              <Card.Subtitle className={subtitleClasses}>{approvalStatus}</Card.Subtitle>
              <Card.Text>{project.description}</Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
};

export default ProposedProjects;
