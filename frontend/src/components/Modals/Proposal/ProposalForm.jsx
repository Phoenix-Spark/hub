import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container, Form, InputGroup, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from '../../../AppContext.js';

const ProposalForm = ({ cellId, projectData, hideModal, refreshList, setSuccess, showCellList, isModal = true }) => {
  const { server, user } = useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nameValue, setNameValue] = useState(projectData?.name ?? '');
  const [descriptionVal, setDescriptionVal] = useState(projectData?.description ?? '');
  const [budgetValue, setBudgetValue] = useState(projectData?.budget ?? '');
  const [cellList, setCellList] = useState([]);
  const [cellValue, setCellValue] = useState(cellId);
  const isPatchRequest = useRef(!!projectData);

  useEffect(() => {
    fetch(`${server}/cell_list`)
      .then(response => response.json())
      .then(data => {
        setCellList(data.filter(cell => cell.is_approved === 'yes'))
      })
      .catch(error => console.error('Error fetching cell list:', error));
  }, []);

  const addNewProject = async formData => {
    const response = await fetch(`${server}/project/add`, {
      credentials: 'include',
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return await response.json();

      // Show the success modal

      // Have this modal hide itself
    } else {
      // Handle error case
      throw new Error(`Failed to submit proposal. ${response.status} - ${response.statusMessage}`);
    }
  };

  const patchProject = async formData => {
    const response = await fetch(`${server}/project/${projectData.id}`, {
      credentials: 'include',
      method: 'PATCH',
      body: formData,
    });

    if (response.ok) {
      return await response.json();

      // Show the success modal

      // Have this modal hide itself
    } else {
      // Handle error case
      throw new Error(`Failed to submit patch for proposal. ${response.status} - ${response.statusMessage}`);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    /** @type {HTMLFormElement} */
    const form = e.currentTarget;
    const formIsValid = form.checkValidity();
    if (formIsValid === false) {
      e.stopPropagation();
    }
    setValidated(true);

    if (formIsValid) {
      e.stopPropagation();

      try {
        const formData = new FormData(form);
        formData.append('proposedByUsername', user.username);

        let data;
        if (isPatchRequest.current) {
          data = await patchProject(formData);
        } else {
          data = await addNewProject(formData);
        }

        console.log(data);
        if (isPatchRequest.current) {
          refreshList(prev => prev + 1);
          setSuccess(true);
        }

        if (isModal) {
          hideModal();
        }
      } catch (error) {
        // TODO: Show errors on modal in an alert or something
        console.error('Error submitting proposal:', error);
      }
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center text-white fw-bold mb-4">Project Proposal</h2>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <input
          type="hidden"
          name="cellId"
          id="cellId"
          value={cellValue}
        />
        <Form.Group
          className="mb-3"
          controlId="projectName"
        >
          <Form.Label className="text-white">Project Name</Form.Label>
          <Form.Control
            type="text"
            required
            name="name"
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Please enter a name for your project.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="projectDescription"
        >
          <Form.Label className="text-white">Project Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            required
            name="description"
            value={descriptionVal}
            onChange={e => setDescriptionVal(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Please enter a description.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="budget"
        >
          <Form.Label className="text-white">Budget</Form.Label>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type="number"
              required
              name="budget"
              min={0}
              value={budgetValue}
              onChange={e => setBudgetValue(e.target.value)}
            />
          </InputGroup>

          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">Please enter an estimated budget for your project.</Form.Control.Feedback>
        </Form.Group>
        {showCellList && (
        <Form.Group
          className="mb-3"
          controlId="cell"
        >
          <Form.Label className="text-white">Cell</Form.Label>
          <Form.Select
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            required
          >
            <option value="">Select a Cell Name</option>
              {cellList.map((cell) => (
                <option
                  key={cell.id}
                  value={cell.id}
                >
                  {cell.cell_name}
                </option>
              ))}
            <option value="createNewCell">Cell not listed? Please create a new cell first.</option>
            {/* Want to be able to select actual Cell */}
          </Form.Select>
        </Form.Group>
        )}
        <div className="my-5 d-flex justify-content-end">
          <Button
            variant="primary"
            type="submit"
          >
            Submit Proposal
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={hideModal}
            className="ms-3"
          >
            Cancel
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
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>

          <Link to="dashboard/projects">
            <Button variant="primary">Go to Proposed Projects</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProposalForm;
