
import '../App.css';
import '../App.scss';
import { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import LoginModal from "./LoginModal.js";
import AppContext from "../AppContext.js";

const LoginButton = () => {
  const { isDarkMode } = useContext(AppContext);
  const [modalShow, setModalShow] = useState(false);
//className="btn-outline-light"
// id="customButts"
  return (
    <>
    <Button variant="secondary" classname="custom-btn" onClick={() => setModalShow(true)}>
      Login/Register
    </Button>
    <LoginModal
      show={modalShow}
      onHide={() => setModalShow(false)}
      setModalShow={setModalShow}
    />
    </>
  );
}

export default LoginButton;