import React, { useContext, useState, useEffect } from 'react';
import * as jose from 'jose';
import { Button, Col, Form, Row } from 'react-bootstrap';
import AppContext from '../../AppContext.js';

export default function ProfileEditor() {
  const { server, user } = useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [userData, setUserData] = useState('');
  useEffect(()=>{
        fetch(`${server}/userData/${user.username}`)
          .then(res => {
            console.log(res);
            return res.json();
          })
          .then(data => setUserData(data[0]))
          .catch(err => console.log(`Fetch failed. Error: ${err}`));
  }, [server, user])
  // table.increments('id');
  // table.integer('base_id');
  // table.foreign('base_id').references('base.id');
  // table.integer('cell_id');
  // table.foreign('cell_id').references('cell.id');
  // table.string('username', 32);
  // table.string('password', 64);
  // table.string('first_name', 32);
  // table.string('last_name', 32);
  // table.string('email', 64);
  // table.string('photo_url', 128);
  // table.string('contact_number1', 16);
  // table.string('contact_number2', 16);
  // table.string('bio', 768);
  // TODO: Move validation to input changes
  async function handleUpdate(e) {
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

        const response = await fetch(`${server}/user/update`, {
          method: 'PATCH',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const secret = process.env.REACT_APP_SECRET || 'secret';
          const secretUInt = new TextEncoder().encode(secret);
          const { payload } = await jose.jwtVerify(data.token, secretUInt, {
            issuer: 'capstone',
          });

          for (let key of Object.keys(payload.userData)) {
            payload.userData[key] = decodeURIComponent(payload.userData[key]);
          }

          setUserData(payload.userData);
          setUpdateComplete(true);
        }
      } catch (e) {
        console.error('There was an error.', e);
      }
    }
  }

  return (
    <div className="m-3">
      {JSON.stringify(userData)}
      {!updateComplete && (
        <>
          <h3>Profile Editor</h3>
          <hr />
          <Form
            noValidate
            validated={validated}
            onSubmit={handleUpdate}
          >
            <Row>
              <Form.Group
                as={Col}
                className="mb-3"
                controlId="firstName"
                name="username"
              >
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={`${userData.first_name}`}
                  name="firstName"
                ></Form.Control>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Please enter your first name.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                className="mb-3"
                controlId="lastName"
              >
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={`${userData.last_name}`}
                  name="lastName"
                ></Form.Control>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Please enter your last name.</Form.Control.Feedback>
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
                value={`${userData.email}`}
                name="email"
              ></Form.Control>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
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
                  value={`${userData.contact_number1}`}
                  name="contactNumber1"
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
                  value={`${userData.contact_number2}`}
                  name="contactNumber2"
                ></Form.Control>
              </Form.Group>
            </Row>
            <Form.Group
              className="mb-3"
              controlId="photo"
            >
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                name="photo"
              ></Form.Control>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="bio"
            >
              <Form.Label>Biography</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={`${userData.bio}`}
                name="bio"
              ></Form.Control>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="baseId"
            >
              <Form.Label>Base</Form.Label>
              <Form.Select>
                <option value="">Select a Base</option>
                <option value={1}>Travis AFB</option>
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-4"
              controlId="cellId"
            >
              <Form.Label>Spark Cell</Form.Label>
              <Form.Select>
                <option value="">Select a Spark Cell</option>
                <option value={1}>Phoenix Spark</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="mb-3"
              >
                Update Account
              </Button>
            </Form.Group>
          </Form>
        </>
      )}
      {updateComplete && <p>Your account has been updated successfully</p>}
    </div>
  );
}
