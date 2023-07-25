import React from 'react';
import { Container, Row, Col, Nav, NavDropdown, Form, Dropdown, Button, Navbar } from 'react-bootstrap';

export default function HubNavBar() {
  return (
    <Container
      fluid
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      <Navbar
        className="bg-body-tertiary justify-content-end"
        data-bs-theme="dark"
      >
        <Form>
          <Row>
            <Col>
              <Dropdown>
                <Dropdown.Toggle
                  variant="dark"
                  id="resource-dropdown"
                >
                  Resources
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="http://localhost:3000/">Proposal Guidelines</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <Button
                variant="dark"
                href="http://localhost:3000/"
              >
                Forum
              </Button>
            </Col>
            <Col
              xs="auto"
              className="mx-3 text-nowrap"
            >
              <Button
                variant="dark"
                href="http://localhost:3000/"
              >
                Don't see your cell?
              </Button>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Search"
              />
            </Col>
            <Col>
              <Button
                variant="dark"
                type="submit"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Navbar>
    </Container>
  );
}
