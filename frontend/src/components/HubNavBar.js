import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button, InputGroup, Navbar, Card, ListGroup } from 'react-bootstrap';
import { DropdownSubmenu, NavDropdownMenu } from 'react-bootstrap-submenu';

export default function HubNavBar() {
  return (
    <Container
      fluid
      style={{ paddingLeft: 0, paddingRight: 0 }}
      className=''
    >
      <Navbar
        className="bg-body-tertiary"
        data-bs-theme="dark"
      >
        <Form
          fluid
          className="col-sm-12 col-md-12 col-lg-12 justify-content-center"
        >
          <Row>
            <Col className="mx-3 col-sm-14 col-md-4 col-lg-4">
              <Form.Control
                type="text"
                placeholder="Search"
                className=" mr-sm-2"
              />
            </Col>
            <Col
              xs="auto"
              className="col-sm-1 col-md-1 col-lg-1"
            >
              <Button
                variant="dark"
                type="submit"
              >
                Submit
              </Button>
            </Col>
            <Col
              xs="auto"
              className="my-1 col-sm-1 col-md-1 col-lg-1"
            >
              <NavDropdownMenu title="Resources">
                <NavDropdown.Item href="http://localhost:3000/">Proposal Guidelines</NavDropdown.Item>
              </NavDropdownMenu>
            </Col>
            <Col xs="auto">
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
          </Row>
        </Form>
      </Navbar>
    </Container>
  );
}
