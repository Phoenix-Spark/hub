import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';

import AppContext from '../../AppContext.js';
import { formatDate } from '../../utils/index.js';

const ProposedProjects = ({ cell }) => {
  const { server, user, setProfileModal } = useContext(AppContext);
  const [projectList, setProjectList] = useState([]);

  const removeProject = id => {
    const newList = projectList.filter(item => item.id !== id);
    setProjectList([...newList]);
  };

  const handleApprove = async project => {
    try {
      console.log('Approving', project);
      const response = await fetch(`${server}/project/${project.id}/approve`, {
        method: 'POST',
      });
      const data = await response.json();
      removeProject(data.id);
    } catch (e) {}
  };

  const handleDeny = async project => {
    try {
      console.log('Denying', project);
      const response = await fetch(`${server}/project/${project.id}/deny`, {
        method: 'POST',
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      removeProject(data.id);
    } catch (e) {}
  };

  useEffect(() => {
    let ignore = false;
    const getProposedProjects = async () => {
      try {
        const response = await fetch(`${server}/cell/${cell}/proposed_projects`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (!ignore) setProjectList(data);
        } else if (response.status === 401) {
          if (!ignore) setProjectList([]);
        }
      } catch (e) {
        console.error(`There was an error: ${e}`);
      }
    };

    getProposedProjects();

    return () => (ignore = true);
  }, [user]);

  return (
    <Container>
      {projectList.length === 0 && 'No Projects to show'}
      {projectList.map(project => {
        const userImgUrl = project.user_photo
          ? project.user_photo.startsWith('https')
            ? project.user_photo
            : `http://localhost:3000/uploads/${project.user_photo}`
          : `${process.env.PUBLIC_URL}/images/placeholder_logo.svg`;
        return (
          <Card
            key={`${project.id}-${project.cell_id}`}
            className="mb-3"
          >
            <Card.Header className="h4">{project.name}</Card.Header>
            <Card.Body className="pt-2">
              <Card.Title className="border-bottom pb-2 align-middle">
                <small className="align-middle">
                  Proposed on: <span className="fw-normal">{formatDate('2020-01-01', true)}</span>
                </small>
                <div className="align-middle vr mx-3"></div>
                <small className="align-middle">
                  Proposed by:
                  <button
                    type="button"
                    className="btn btn-link fw-normal m-0 p-0"
                    onClick={() => {
                      setProfileModal({ show: true, userId: project.user_id });
                    }}
                  >
                    <img
                      src={userImgUrl}
                      width={24}
                      className="mx-2 rounded-circle"
                    />
                    {`${project.user_first_name} ${project.user_last_name}`}
                  </button>
                </small>
              </Card.Title>
              <Card.Text>{project.description}</Card.Text>
              {/* TODO add view for pictures */}
            </Card.Body>
            <Card.Footer>
              {(user?.roles === 'site' || user?.roles === 'cell') && (
                <div className="d-flex justify-content-between">
                  <Button
                    variant="success"
                    onClick={() => handleApprove(project)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeny(project)}
                  >
                    Deny
                  </Button>
                </div>
              )}
            </Card.Footer>
          </Card>
        );
      })}
    </Container>
  );
};

export default ProposedProjects;
