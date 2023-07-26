import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import AppContext from '../AppContext.js';
import jwtDecode from 'jwt-decode';

// TODO: Photo upload
export default function SignUp() {
  const { server, setUser } = useContext(AppContext);
  const [validated, setValidated] = useState(false);
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
      try {
        const userDetails = {
          baseId: parseInt(form.baseId.value, 10),
          cellId: parseInt(form.cellId.value, 10),
          username: encodeURIComponent(form.username.value),
          password: encodeURIComponent(form.password.value),
          firstName: encodeURIComponent(form.firstName.value),
          lastName: encodeURIComponent(form.lastName.value),
          email: encodeURIComponent(form.email.value),
          photo: encodeURIComponent(form.photo.value),
          contactNumbers: [encodeURIComponent(form.contactNumber1.value), encodeURIComponent(form.contactNumber2.value)],
          bio: encodeURIComponent(form.bio.value),
        };

        const response = await fetch(`${server}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDetails),
        });

        const data = await response.json();
        if (response.ok) {
          const payload = jwtDecode(data.token);

          if (payload.aud.search(/.*(at capstone)$/) === -1 || payload.iss !== 'capstone' || payload.sub !== form.username.value) {
            throw new Error('invalid token');
          }

          for (let key of Object.keys(payload.user)) {
            payload.user[key] = decodeURIComponent(payload.user[key]);
          }

          setUser(payload.user);
        } else {
          console.error(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <div className="text-light m-3 vh-100">
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
          >
            <Form.Label>First Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your first name"
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
            ></Form.Control>
          </Form.Group>
        </Row>
        <Form.Group
          className="mb-3"
          controlId="photo"
        >
          <Form.Label>Photo</Form.Label>
          <Form.Control type="file"></Form.Control>
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
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
