import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button, Navbar } from 'react-bootstrap';

export default function Header() {
  //   const navigate = useNavigate();

  return (
    <Navbar fixed="top" className="header-css">
      <Container
        fluid
        className="d-flex"
        id="HeaderWrapper"
      >
        <Row className="w-100">
          <Col xs="auto">
            <Nav.Link
              href="/"
              className="mx-2 text-nowrap"
            >
              Spark Hub Logo
            </Nav.Link>
          </Col>
          {/* <Col>
            <Nav.Link
              href="/cell"
              className="mx-2"
            >
              Cell
            </Nav.Link>
          </Col>
          <Col>
            <Nav.Link
              href="/project"
              className="mx-2"
            >
              Project
            </Nav.Link>
          </Col> */}
          <Col xs="auto" className="ms-auto">
            <Button
              variant="dark"
              href="http://localhost:3000/"
            >
              Login/Register
            </Button>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
