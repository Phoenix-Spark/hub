import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer-wrapper col-12 col-md-10 pt-2 pb-2 mx-auto">
      <Row className="row-cols-2 justify-content-between">
        <Col className="text-nowrap me-5 col-sm">
          <h5>Contact Us</h5>
          <p>Email: example@example.com</p>
          <p>Phone: (123) 456-7890</p>
        </Col>
        <Col className="col-md">
          <h5>Follow Us</h5>
          <div>
            <a href="https://www.facebook.com">
              <FaFacebook className="me-3" />
            </a>
            <a href="https://www.twitter.com">
              <FaTwitter className="me-3" />
            </a>
            <a href="https://www.instagram.com">
              <FaInstagram />
            </a>
          </div>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
