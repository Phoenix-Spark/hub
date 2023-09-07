import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer-wrapper col-12 col-md-10 pt-2 pb-2 mx-auto">
      <Row className="row-cols-2 justify-content-between">
        <Col className="text-nowrap me-5 col-sm">
          <h5>Contact Us</h5>
          <p>Email: phoenix@travisspark.com</p>
          <p>Phone: (707) 424-8920</p>
        </Col>
        <Col className="col-md">
          <h5>Follow Us</h5>
          <div>
            <a
              href="https://www.facebook.com/PhoenixSparkLab/"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook className="me-3" />
            </a>
            <a
              href="https://www.linkedin.com/company/phoenixsparktravis/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin className="me-3" />
            </a>
            <a
              href="https://www.instagram.com/phoenixsparklab/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>
          </div>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
