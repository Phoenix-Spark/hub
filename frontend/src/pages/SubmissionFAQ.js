import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import { Container, Row, Col, Nav, NavDropdown, Form, Dropdown, Button, Navbar } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

const FAQ = () => {
  return (
    <Container
      fluid
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      <Navbar
        className="bg-body-tertiary justify-content-end"
        data-bs-theme="dark"
      >
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Question 1
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Answer </Card.Body>
          </Accordion.Collapse>
        </Card>

        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Question 2
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Answer</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      </Navbar>
      </Container>
)};


export default FAQ;
