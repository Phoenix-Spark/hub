import { useState } from "react";
import { Button } from "react-bootstrap";
import LoginModal from "./LoginModal.js";

const LoginButton = () => {

  const [modalShow, setModalShow] = useState(false);

  return (
    <>
    <Button variant="dark" onClick={() => setModalShow(true)}>
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