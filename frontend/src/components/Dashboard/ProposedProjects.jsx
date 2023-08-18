import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Modal, Form } from 'react-bootstrap';

import AppContext from '../../AppContext.js';
import { formatDate } from '../../utils/index.js';

const ProposedProjects = ({ cell, refreshProjectList, setRefreshProjectList }) => {
  const { frontendUrl, server, user, setProfileModal } = useContext(AppContext);
  const [projectList, setProjectList] = useState([]);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  /** TODO: Provide feedback that elements have been removed, an alert or something **/
  const [showCommentModal, setShowCommentModal] = useState(false);

  // Function to open the comment modal when clicking Deny
  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  // Function to close the comment modal
  const closeCommentModal = () => {
    setShowCommentModal(false);
  };

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

  const handleDenySubmit = async () => {
    try {
      if (selectedProject) {
        console.log('Denying', selectedProject);
        const response = await fetch(`${server}/project/${selectedProject.id}/deny`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: feedbackComment,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          removeProject(data.id);

          // Close the comment modal after successful denial
          setShowCommentModal(false);
          setFeedbackComment('');
        } else {
          console.error('Error denying project:', response);
        }
      }
    } catch (e) {
      console.error(`Error denying project: ${e}`);
    }
  };

  const handleDeny = async project => {
    setSelectedProject(project);
    setShowCommentModal(true);
  };

  useEffect(() => {
    let ignore = false;
    const getProposedProjects = async () => {
      try {
        const response = await fetch(`${server}/cell/${cell}/proposed-projects`, {
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
  }, [user, refreshProjectList]);

  return (
    <Container>
      {projectList.length === 0 ? 'No Projects to show' : <h3 className="mb-3">Projects Awaiting Approval at {user.cell}</h3>}
      {projectList.map(project => {
        const userImgUrl = project.user_photo
          ? project.user_photo.startsWith('https')
            ? project.user_photo
            : `${frontendUrl}/uploads/${project.user_photo}`
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
                  Proposed on: <span className="fw-normal">{formatDate(project.date_proposed, true)}</span>
                </small>
                <div className="align-middle vr mx-3"></div>
                <small className="align-middle">
                  Proposed by:
                  <button
                    type="button"
                    className="btn btn-link fw-normal m-0 p-0"
                    onClick={() => {
                      setProfileModal({ show: true, userId: project.proposedBy });
                    }}
                  >
                    <img
                      src={userImgUrl}
                      width={24}
                      className="mx-2 rounded-circle"
                      alt="User Profile"
                    />
                    {`${project['users.firstName']} ${project['users.lastName']}`}
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

      <Modal
        show={showCommentModal}
        onHide={() => setShowCommentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deny Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={5} // You can adjust the number of rows to increase or decrease the height
            value={feedbackComment}
            onChange={e => setFeedbackComment(e.target.value)}
            placeholder="Enter your feedback comment..."
            style={{ width: '100%' }} // Set the width of the textarea
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCommentModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDenySubmit}
          >
            Deny
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProposedProjects;
