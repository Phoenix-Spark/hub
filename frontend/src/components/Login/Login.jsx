import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import * as jose from 'jose';
import { Link, useNavigate } from 'react-router-dom';

import AppContext from '../../AppContext.js';

export default function Login({ setModalShow }) {
  const { server, setUser, user } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const username = encodeURIComponent(e.target.username.value);
    const password = encodeURIComponent(e.target.password.value);

    try {
      const response = await fetch(`${server}/login`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      console.log(response);
      const data = await response.json();
      if (response.ok) {
        const secret = process.env.REACT_APP_SECRET || 'secret';
        const secretUInt = new TextEncoder().encode(secret);
        const { payload } = await jose.jwtVerify(data.token, secretUInt, {
          issuer: 'capstone',
          subject: username,
        });

        for (let key of Object.keys(payload.user)) {
          payload.user[key] = decodeURIComponent(payload.user[key]);
        }

        setUser(payload.user);
      } else {
        console.error(data);
        setError(true);
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  }
  return (
    <Container className="text-light my-4" style={{height: '500px'}}>
      <Form
        onSubmit={handleFormSubmit}
        className="mb-3"
      >
        <Form.Group
          className="mb-3"
          controlId="username"
        >
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            type="text"
          />
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="password"
        >
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder=""
          />
        </Form.Group>
        <Form.Group className="d-flex justify-content-between">
          <div>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              Login
            </Button>
            <Button
              variant="success"
              as={Link}
              onClick={() => {
                setModalShow(false);
              }}
              to="/signup"
              className="ms-3"
            >
              Create an Account
            </Button>
          </div>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() => {
              setModalShow(false);
            }}
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
      <Alert show={isError} variant="danger">Wrong Username or Password.</Alert>
      {/* <Button
        variant='success'
        as={Link}
        onClick={() => {
          setModalShow(false);
        }}
        to="/signup"
      >
        Create an Account
      </Button> */}
    </Container>
  );
}
