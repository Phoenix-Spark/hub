import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import AppContext from '../../AppContext.js';

const CellDetails = () => {
  const { server, user } = useContext(AppContext);
  const [editSuccess, setEditSuccess] = useState(false);
  const [validated, setValidated] = useState(false);

  const [nameValue, setNameValue] = useState('');
  const [baseValue, setBaseValue] = useState('');
  const [endpointValue, setEndpointValue] = useState('');
  const [websiteValue, setWebsiteValue] = useState('');
  const [missionValue, setMissionValue] = useState('');
  const [contact1Value, setContact1Value] = useState('');
  const [contact2Value, setContact2Value] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [resetForm, setResetForm] = useState(0);
  const logoFileField = useRef();
  const idField = useRef(user?.cellId);
  const [baseList, setBaseList] = useState([]);

  const resetValues = data => {
    setNameValue(data.cell_name);
    setBaseValue(data.base_id);
    setEndpointValue(data.cell_endpoint);
    setWebsiteValue(data.external_website);
    setMissionValue(data.cell_mission);
    setContact1Value(data.contact_number1);
    setContact2Value(data.contact_number2);
    setEmailValue(data.email);
    logoFileField.current.value = '';
    idField.current.value = data.id;
  };

  useEffect(() => {
    fetch(`${server}/base_list`)
      .then(response => response.json())
      .then(data => setBaseList(data))
      .catch(error => console.error('Error fetching base list:', error));
  }, []);

  useEffect(() => {
    let ignore = false;
    const getCellData = async ignore => {
      const response = await fetch(`${server}/cell/${user?.cellId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('cell details', data);
        if (!ignore) {
          resetValues(data);
        }
      }
    };

    getCellData(ignore);

    return () => {
      ignore = true;
    };
  }, [user, resetForm]);

  useEffect(() => {
    const hideEditSuccess = setTimeout(() => {
      setEditSuccess(false);
    }, 3000);
    return () => clearTimeout(hideEditSuccess);
  }, [editSuccess]);

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

        console.log(formData);

        const response = await fetch(`${server}/cell/${idField.current.value}`, {
          credentials: 'include',
          method: 'PATCH',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          resetValues(data);
          setEditSuccess(true);
        }
      } catch (e) {
        console.error('There was an error.', e);
      }
    }
  };

  return (
    <>
      {editSuccess && <Alert variant="success">Project edited successfully!</Alert>}
      <Row>
        <Col>
          <h1>Cell Details</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <input
              type="hidden"
              ref={idField}
              name="id"
              id="id"
            />
            <Form.Group
              className="mb-3"
              controlId="baseId"
            >
              <Form.Label>Base</Form.Label>
              <Form.Select
                name="base_name"
                value={baseValue}
                onChange={e => {
                  setBaseValue(e.target.value);
                }}
                required
              >
                <option value="">Select a Base Name</option>
                {baseList.map(base => (
                  <option
                    key={base.id}
                    value={base.id}
                  >
                    {base.base_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please select a base.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="cellName"
            >
              <Form.Label>Cell Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter the name of your Spark Cell"
                name="cellName"
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
              ></Form.Control>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please enter a valid name.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="cellEndpoint"
            >
              <Form.Label>Cell Endpoint</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="How your cell is accessed https://<url>/cell/endpoint"
                name="cellEndpoint"
                value={endpointValue}
                onChange={e => setEndpointValue(e.target.value)}
              ></Form.Control>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please enter an endpoint.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="externalWebsite"
            >
              <Form.Label>External Website</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your Cell's external website"
                name="externalWebsite"
                value={websiteValue}
                onChange={e => setWebsiteValue(e.target.value)}
              ></Form.Control>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please enter an external URL.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="cellMission"
            >
              <Form.Label>Cell Mission Statement</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What is your Spark cell's mission statement?"
                name="cellMission"
                value={missionValue}
                onChange={e => setMissionValue(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                controlId="contactNumber1"
              >
                <Form.Label>Phone Number 1</Form.Label>
                <Form.Control
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="555-555-5555"
                  name="contactNumber1"
                  value={contact1Value}
                  onChange={e => setContact1Value(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="contactNumber2"
              >
                <Form.Label>Phone Number 2</Form.Label>
                <Form.Control
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="555-555-5555"
                  name="contactNumber2"
                  value={contact2Value}
                  onChange={e => setContact2Value(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Row>
            <Form.Group
              className="mb-3"
              controlId="email"
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter your Spark Cell's email address"
                name="email"
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
              ></Form.Control>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="cellLogo"
            >
              <Form.Label>Cell Logo</Form.Label>
              <Form.Control
                ref={logoFileField}
                type="file"
                name="cellLogo"
              ></Form.Control>
            </Form.Group>

            <Form.Group className="pt-3">
              <Button
                type="submit"
                variant="primary"
                className="mb-3 me-3"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="mb-3"
                onClick={() => setResetForm(prev => prev + 1)}
              >
                Reset Form
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default CellDetails;
