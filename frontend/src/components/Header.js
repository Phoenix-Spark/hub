import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Image, Nav, Navbar, NavDropdown, Row, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
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
      //bg="dark"
      className="header-css"
    >
      <Container
        fluid
        id="HeaderWrapper"
      >
        <Navbar.Brand as={Link} to="/">
          <Image
                src="http://localhost:3000/images/travis.png"
                alt="Spark Hub Logo"
                width={90}
              />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className='me-auto'>
            <Nav.Link as={Link} to="/" active>Home</Nav.Link>
            <Nav.Link as={Link} to="/">Forum</Nav.Link>
            <NavDropdown title="Resources" id="resources-nav-dropdown">
              <NavDropdown.Item as={Link} to="/">Proposal Guidelines</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/">Submission FAQ</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/">Alex's "Homework" Folder</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/">Submit New Idea</Nav.Link>
            </Nav>
            <Form inline className='d-flex'>
              <InputGroup className='me-5'>
              <Form.Control
                type="text"
                placeholder="Search"
              />
              <Button
                variant="outline-secondary"
                type="submit"
              >
                <Search />
              </Button>
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        <Row className="align-items-center me-3">
            {showLogin && user === null && <LoginButton />}
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
                      <Dropdown.Item as={Link} to="user/settings">Account Settings</Dropdown.Item>
                      {user.roles !== '' && <Dropdown.Item as={Link} to="user/dashboard">Your Dashboard</Dropdown.Item>}
                      <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
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
