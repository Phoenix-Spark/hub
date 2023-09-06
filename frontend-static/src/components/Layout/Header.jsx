import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, InputGroup, Nav, Navbar, NavDropdown, Row } from 'react-bootstrap';
import { MoonStars, Search, SunFill } from 'react-bootstrap-icons';
import { Link, NavLink } from 'react-router-dom';

import AppContext from '../../AppContext.js';

import './Header.scss';

export default function Header() {
  const { frontendUrl, isDarkMode, setIsDarkMode } = useContext(AppContext);
  const [fadeAnimation, setFadeAnimation] = useState(false);

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

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    const newMode = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newMode);
    localStorage.setItem('preferredMode', newMode);
    setFadeAnimation(true);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFadeAnimation(false);
    }, 80);

    return () => clearTimeout(timerId);
  }, [fadeAnimation]);

  return (
    <Navbar
      id="header"
      fixed="top"
      className="bg-body-tertiary"
      collapseOnSelect
      expand="lg"
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
        >
          <Image
            src={`${frontendUrl}/images/travis.png`}
            alt="Spark Hub Logo"
            width={90}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto links">
            <Nav.Link
              as={NavLink}
              to="/"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/"
            >
              Submit New Idea
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/faq"
            >
              FAQ
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <InputGroup className="me-3">
              <Form.Control
                type="text"
                placeholder="Search"
              />
              <Button
                variant={!isDarkMode ? 'outline-dark' : 'outline-light'}
                //variant="outline-light"
                type="submit"
              >
                <Search />
              </Button>
            </InputGroup>
            <Button
              variant={isDarkMode ? 'light' : 'dark'}
              onClick={toggleDarkMode}
              className={`col-2 button-fade-animation ${fadeAnimation ? 'button-fade-out' : ''}`}
            >
              {isDarkMode ? <MoonStars /> : <SunFill />}
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
