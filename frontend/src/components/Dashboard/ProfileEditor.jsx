import React, { useContext, useState } from 'react';
import * as jose from 'jose';
import { Button, Col, Form, Row } from 'react-bootstrap';
import AppContext from '../../AppContext.js';

export default function ProfileEditor() {
  const { server, user, setUser, setShowLogin } = useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [signUpComplete, setSignUpComplete] = useState(false);

  // TODO: Move validation to input changes
  async function handleSignup(e) {
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

        const response = await fetch(`${server}/signup`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const secret = process.env.REACT_APP_SECRET || 'secret';
          const secretUInt = new TextEncoder().encode(secret);
          const { payload } = await jose.jwtVerify(data.token, secretUInt, {
            issuer: 'capstone',
          });

          for (let key of Object.keys(payload.user)) {
            payload.user[key] = decodeURIComponent(payload.user[key]);
          }

          setUser(payload.user);
          setSignUpComplete(true);
          setShowLogin(true);
        }
      } catch (e) {
        console.error('There was an error.', e);
      }
    }
  }

  return (
    <div className="m-3">
      {!signUpComplete && (
        <>
          <h3>Sign Up Form</h3>
          <hr />
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSignup}
          >
            <Row>
              <Form.Group
                as={Col}
                className="mb-3"
                controlId="username"
              >
                <Form.Label>Username</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder={`${user.username}`}
                  name="username"
                ></Form.Control>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Please enter a username.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                className="mb-3"
                controlId="password"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder={`${user.password}`}
                  name="password"
                ></Form.Control>
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Please enter a password.</Form.Control.Feedback>
              </Form.Group>
            </Row>
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
                  placeholder={`${user.firstName}`}
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
                  placeholder={`${user.lastName}`}
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
                placeholder={`${user.email}`}
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
                  placeholder={`${user.contactNumber1}`}
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
                  placeholder={`${user.contactNumber2}`}
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
                placeholder={`${user.bio}`}
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
      {signUpComplete && <p>Your account has been updated successfully</p>}
    </div>
  );
}
