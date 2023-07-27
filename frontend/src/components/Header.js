import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Image, Nav, Navbar, Row, Dropdown } from 'react-bootstrap';
import AppContext from '../AppContext.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton.js';

export default function Header() {
  const { server, user, setUser } = useContext(AppContext);
  const [showLogin, setShowLogin] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  async function handleUserDetails() {
    const response = await fetch(`${server}/user/`, {
      credentials: 'include',
    });

    if (response.ok) {
      navigate(`${server}/dashboard/${user}`);
    }
  }
  async function handleDashboard() {
    const response = await fetch(`${server}/dashboard`, {
      credentials: 'include',
    });

    if (response.ok) {
      navigate(`${server}/dashboard`);
    }
  }

  let imgUrl = '';
  if (user) {
      imgUrl = user.photo
      ? user.photo.startsWith('https')
        ? user.photo
        : `${server}/uploads/${user.photo}`
      : `../images/placeholder_logo.svg`;
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
              <Row>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  <Image
                    style={{ height: '64px', width: '64px' }}
                    src={imgUrl}
                    alt="Profile Picture"
                    roundedCircle
                  />
                </Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  <Dropdown
                    show={showDropdown}
                    onToggle={isOpen => setShowDropdown(isOpen)}
                    drop="down"
                  >
                    <Dropdown.Toggle
                      as={Button}
                      variant="light"
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <Dropdown.Item onClick={handleUserDetails}>Account Settings</Dropdown.Item>
                      <Dropdown.Item onClick={handleDashboard}>Your Dashboard</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
