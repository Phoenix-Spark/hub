import React, { useContext, useState } from 'react';
import * as jose from 'jose';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext.js';

// TODO: Photo upload
export default function SignUp() {
  const { server, setUser, setShowLogin } = useContext(AppContext);
  const [validated, setValidated] = useState(false);
  const [signUpComplete, setSignUpComplete] = useState(false);
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1);
  };
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
    <div className="text-light m-3 vh-100">
      {!signUpComplete && (
        <>
          <h1>Sign Up Form</h1>
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
                  placeholder="Enter a username"
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
                  placeholder="Enter a password"
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
                  placeholder="Enter your first name"
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
                  placeholder="Enter your last name"
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
                placeholder="Enter your email address"
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
                  placeholder="555-555-5555"
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
                  placeholder="555-555-5555"
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
                placeholder="Tell us a little about yourself"
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
              >
                Create Account
              </Button>
              <Button
                variant="secondary"
                className="ms-3"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
        </>
      )}
      {signUpComplete && <p>Your account has been created and you have been signed in.</p>}
    </div>
  );
}
