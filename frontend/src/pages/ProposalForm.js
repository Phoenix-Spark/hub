import React, { useState, useContext } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from '../AppContext.js';

const ProposalForm = ({ addProjectToProposedList }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [participants, setParticipants] = useState('');
  const [photos, setPhotos] = useState(null);
  const { server, user } = useContext(AppContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    // send the file and other form data
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('projectDescription', projectDescription);
    formData.append('budget', budget);
    formData.append('participants', participants);
    formData.append('photos', photos);

    try {
      const response = await fetch(`${server}/:cellId/proposed_projects`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        
        // add the submitted project to the proposed list
        addProjectToProposedList({
          projectName,
          projectDescription,
          budget,
          participants,
          photos,
        });

        // Show the success modal
        setShowSuccessModal(true);

      } else {
        // Handle error case
        console.error('Failed to submit proposal');
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
    }
  };

  

  return (
    <Container className="my-4">
      <h2 className="text-center text-white fw-bold mb-4">Project Proposal</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group
          className="mb-3"
          controlId="projectName"
        >
          <Form.Label className="text-white">Project Name</Form.Label>
          <Form.Control
            type="text"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="projectDescription"
        >
          <Form.Label className="text-white">Project Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={projectDescription}
            onChange={e => setProjectDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="budget"
        >
          <Form.Label className="text-white">Budget</Form.Label>
          <Form.Control
            type="text"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="participants"
        >
          <Form.Label className="text-white">Participants</Form.Label>
          <Form.Control
            type="text"
            value={participants}
            onChange={e => setParticipants(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="photos"
        >
          <Form.Label className="text-white">Photos</Form.Label>
          <Form.Control
            type="file"
            onChange={e => setPhotos(e.target.files[0])}
          />
        </Form.Group>

        <div className="my-5 d-flex justify-content-end">
          <Button
            variant="primary"
            type="submit"
          >
            Submit Proposal
          </Button>
        </div>
      </Form>

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Submission Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your project proposal has been submitted successfully!</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick = {() => setShowSuccessModal(false)}
          >
            Close
          </Button>

          <Link to="/proposed-projects">
            <Button variant="primary">Go to Proposed Projects</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProposalForm;
