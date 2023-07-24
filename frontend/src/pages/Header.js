import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button } from "react-bootstrap";

export default function Header() {
  const navigate = useNavigate();

  return (
    <Row id="HeaderWrapper" className="buttonContainer">
      <Col>
        <Button className="NavButton" onClick={()=>{navigate("/")}}>Spark Hub</Button>
      </Col>
      <Col>
        <Button className="NavButton" onClick={()=>{navigate("/cell")}}>Cell</Button>
      </Col>
      <Col>
        <Button className="NavButton" onClick={()=>{navigate("/project")}}>Project</Button>
      </Col>
    </Row>
  )
}