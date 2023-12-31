import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Image, InputGroup, Nav, Navbar, NavDropdown, Row } from 'react-bootstrap';
import { MoonStars, Search, SunFill } from 'react-bootstrap-icons';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import AppContext from '../../AppContext.js';
import LoginButton from '../Login/LoginButton.jsx';

import './Header.scss';

export default function Header() {
  const { frontendUrl, server, user, setUser, showLogin, setShowLogin, isDarkMode, setIsDarkMode } = useContext(AppContext);
  const [imgUrl, setImgUrl] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [fadeAnimation, setFadeAnimation] = useState(false);

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

      if (user) {
      setImgUrl(user.photo
        ? user.photo.startsWith('https')
          ? user.photo
          : `${frontendUrl}/uploads/${user.photo}`
        : `../images/placeholder_logo.svg`);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  useEffect(() => {
      if (user) {
      setImgUrl(user.photo
        ? user.photo.startsWith('https')
          ? user.photo
          : `${frontendUrl}/uploads/${user.photo}`
        : `../images/placeholder_logo.svg`);
      }
  }, [user])

  useEffect(() => {
    if (location.pathname === '/signup') {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
    if (user) {
        setImgUrl(user.photo
            ? user.photo.startsWith('https')
                ? user.photo
                : `${ frontendUrl }/uploads/${ user.photo }`
            : `../images/placeholder_logo.svg`);
    }
  }, [location]);

  async function handleLogout() {
    const response = await fetch(`${server}/logout`, {
      credentials: 'include',
    });

    if (response.ok) {
      setUser(null);
      navigate('/');
    }
  }

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
      className="header-css"
    >
      <Container
        fluid
        id="HeaderWrapper"
      >
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
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto links">
            <Nav.Link
              as={NavLink}
              to="/"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/forums"
            >
              Forums
            </Nav.Link>
            <NavDropdown
              title="Resources"
              id="resources-nav-dropdown"
            >
              <NavDropdown.Item
                as={NavLink}
                to="/ProposalGuidelines"
              >
                Proposal Guidelines
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="/SubmissionFAQ"
              >
                Submission FAQ
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              as={NavLink}
              to="/SubmitNewIdea"
            >
              Submit New Idea
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <InputGroup className="me-5">
              <Form.Control
                type="text"
                placeholder="Search"
              />
              <Button
                variant={isDarkMode ? 'outline-dark' : 'outline-light'}
                type="submit"
              >
                <Search />
              </Button>
            </InputGroup>
          </Form>
        </Navbar.Collapse>
        <Row className="align-items-center me-3">
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant={isDarkMode ? 'light' : 'dark'}
              onClick={toggleDarkMode}
              className={`button-fade-animation ${fadeAnimation ? 'button-fade-out' : ''}`}
            >
              {isDarkMode ? <MoonStars /> : <SunFill />}
            </Button>
          </Col>
          {showLogin && user === null && (
            <Col>
              <LoginButton />
            </Col>
          )}
          {showLogin && user && (
            <>
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
                    {/* <Dropdown.Header>Personal Section</Dropdown.Header> */}
                    <Dropdown.Item
                      as={Link}
                      to="dashboard/account"
                    >
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/dashboard/projects"
                    >
                      Your Projects
                    </Dropdown.Item>
                    {(user.roles === 'site' || user.roles === 'cell') && (
                      <>
                        <Dropdown.Header>Cell Administration</Dropdown.Header>
                        <Dropdown.Item
                          as={Link}
                          to="/dashboard/proposed-projects"
                        >
                          Proposed Projects
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          to="/dashboard/cell-details"
                        >
                          Cell Details
                        </Dropdown.Item>
                      </>
                    )}
                    {user.roles === 'site' && (
                      <>
                        <Dropdown.Header>Site Administration</Dropdown.Header>
                        <Dropdown.Item
                          as={Link}
                          to="/dashboard/proposed-cells"
                        >
                          Proposed Cells
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          to="/dashboard/approve-faq"
                        >
                          Proposed FAQs
                        </Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item
                      className="text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </Navbar>
  );
}
