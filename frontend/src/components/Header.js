import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Image, Nav, Navbar, Row } from 'react-bootstrap';
import AppContext from '../AppContext.js';
import { Link, useLocation } from 'react-router-dom';
import LoginButton from './LoginButton.js';

export default function Header() {
  const { server, user, setUser } = useContext(AppContext);
  const [showLogin, setShowLogin] = useState(true);

  const location = useLocation();

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

  useEffect(() => {
    if (location.pathname === '/signup') {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [location]);

  async function handleLogout() {
    const response = await fetch(`${server}/logout`, {
      credentials: 'include',
    });

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
        <Row className="w-100 align-items-center">
          <Col xs="auto">
            <Nav.Link
              as={Link}
              to="/"
              className="mx-2 text-nowrap"
            >
              <Image
                src="http://localhost:3000/images/travis.png"
                alt="Spark Hub Logo"
                style={{ width: '90px', height: 'auto' }}
              />
            </Nav.Link>
          </Col>
          <Col
            xs="auto"
            className="ms-auto"
          >
            {showLogin && user === null && <LoginButton />}
            {showLogin && user && (
              <p>
                <Image
                  alt="User Profile"
                  src={`http://localhost:3000/uploads/${user.photo}`}
                  height={80}
                  roundedCircle
                  className="me-2"
                />
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
