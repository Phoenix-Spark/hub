import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Nav, Navbar, Row, Image} from 'react-bootstrap';
import AppContext from '../AppContext.js';
import { Link, useLocation } from 'react-router-dom';
import LoginModal from '../pages/LoginModal.js';
import LoginButton from '../pages/LoginButton.js';

export default function Header() {
  const { server, user, setUser } = useContext(AppContext);
  const [ showLogin, setShowLogin ] = useState(true);

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
    };

    window.addEventListener('scroll', handleScroll);
    

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    };
  }, []);

  useEffect(()=>{
    if (location.pathname === '/signup') {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [location]);

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
              as={Link}
              to="/"
              className="mx-2 text-nowrap"
            >
            <Image
              src="/frontend/public/images/travis.png"
              alt="Spark Hub Logo" 
              style={{ width: '150px', height: 'auto' }}
            />
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
            {showLogin && user === null && (
              <LoginButton />
              // <Button
              //   variant="dark"
              //   as={Link}
              //   to="/login"
              // >
              //   Login/Register
              // </Button>
            )}
            {showLogin && user && (
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
