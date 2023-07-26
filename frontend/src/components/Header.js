import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect } from 'react';
import { Button, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import AppContext from '../AppContext.js';
import { Link } from 'react-router-dom';

export default function Header() {
  const { server, user, setUser } = useContext(AppContext);
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (header) {
        const scrolled = window.scrollY > 0;
        if (scrolled) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function handleLogout() {
    const response = await fetch(`${server}/logout`);
    if (response.ok) {
      setUser(null);
    }
  }

  return (
    <Navbar
      id="header"
      fixed="top"
      className="header-css"
    >
      <Container
        fluid
        className="d-flex"
        id="HeaderWrapper"
      >
        <Row className="w-100">
          <Col xs="auto">
            <Nav.Link
              as={Link}
              to="/"
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
          <Col
            xs="auto"
            className="ms-auto"
          >
            {user === null && (
              <Button
                variant="dark"
                as={Link}
                to="/login"
              >
                Login/Register
              </Button>
            )}
            {user && (
              <p>
                Welcome, {`${user.firstName} ${user.lastName} ${user.email}`}!
                <Button
                  onClick={handleLogout}
                  variant="link"
                >
                  Logout
                </Button>
              </p>
            )}
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
