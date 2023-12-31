import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import AppContext from '../../AppContext.js';
import EditProposalModal from '../Modals/Proposal/EditProposalModal.jsx';

const ProposedProjects = ({ refreshProjectList, setRefreshProjectList }) => {
  const { server, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const projectData = useRef({});
  const [isProjEditModalShowing, setIsProjEditModalShowing] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const showProjectEditModal = data => {
    projectData.current = { ...data };
    setIsProjEditModalShowing(true);
  };
  const hideProjectEditModal = () => {
    setIsProjEditModalShowing(false);
  };

  const handleProposalSubmitSuccess = () => {
    setIsProjEditModalShowing(false); // Close the proposal modal after successful submission
  };

  useEffect(() => {
    let ignore = false;

    const getUserProjects = async () => {
      try {
        const response = await fetch(`${server}/user/${user.id}/projects`);
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
  }, [user, refreshProjectList]);

  useEffect(() => {
    const hideEditSuccess = setTimeout(() => {
      setEditSuccess(false);
    }, 3000);
    return () => clearTimeout(hideEditSuccess);
  }, [editSuccess]);

  return (
    <Container>
      <div className="alert alert-light mb-3">The review process may take up to five business days</div>
      {editSuccess && <Alert variant="success">Project edited successfully!</Alert>}
      {projectList.length === 0 && 'No Projects to show'}
      {projectList.map(project => {
        const approvalStatus = !project.isApproved ? (project.isApproved === null ? 'Awaiting Approval' : 'Denied') : 'Approved';
        const subtitleClasses = ` alert px-3 py-2 mx-0 my-2 ${
          !project.isApproved ? (project.isApproved === null ? 'alert-info' : 'alert-danger') : 'alert-success'
        }`;
        return (
          <Card
            key={`${project.id}-${project.cellId}`}
            className="mb-3"
          >
            <Card.Body>
              <Card.Title>{project.name}</Card.Title>
              <Card.Subtitle className={subtitleClasses}>{approvalStatus}</Card.Subtitle>
              {project.isApproved === false && (
                <Card.Text>
                  <strong>Reason: </strong>
                  {project?.comments}
                </Card.Text>
              )}
            </Card.Body>
            {project.isApproved !== false && (
              <Card.Footer>
                {project.isApproved && (
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="me-3"
                  >
                    View Project
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={() => {
                    showProjectEditModal(project);
                  }}
                >
                  Edit
                </Button>
              </Card.Footer>
            )}
          </Card>
        );
      })}
      <EditProposalModal
        projectData={projectData.current}
        show={isProjEditModalShowing}
        onHide={hideProjectEditModal}
        refreshList={setRefreshProjectList}
        onSuccess={setEditSuccess}
        onSubmitSuccess={handleProposalSubmitSuccess}
      ></EditProposalModal>
    </Container>
  );
};

export default ProposedProjects;
