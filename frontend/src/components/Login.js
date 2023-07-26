import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import * as jose from 'jose';
import AppContext from '../AppContext.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ setModalShow }) {
  const { server, setUser, user } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
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
        credentials: "include",
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
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  }
  return (
    <Container className="text-light vh-100">
      <h1>Login Form</h1>
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
            placeholder="Username"
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
        <Form.Group>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            Login
          </Button>
          <Button
            variant="secondary"
            className="ms-3"
            disabled={isLoading}
            onClick={() => {
              setModalShow(false);
            }}
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
      <hr />
      <Button
        type="button"
        as={Link}
        onClick={() => {
          setModalShow(false);
        }}
        to="/signup"
      >
        Create an Account
      </Button>
    </Container>
  );
}
