import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, NavDropdown, Nav, Dropdown, Button } from "react-bootstrap";

export default function Header() {
  const navigate = useNavigate();

    return (
        <div id="HeaderWrapper">
            <button className="NavButton" onClick={()=>{navigate("/")}}>Home</button>
            <button className="NavButton" onClick={()=>{navigate("/cell")}}>Cell</button>
            <button className="NavButton" onClick={()=>{navigate("/project")}}>Project</button>
        </div>
    )
}
