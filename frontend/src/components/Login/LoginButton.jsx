import { useState } from 'react';
import { Button } from 'react-bootstrap';

import LoginModal from './LoginModal.jsx';

const LoginButton = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button
        variant="light"
        onClick={() => setModalShow(true)}
      >
        Login/Register
      </Button>
      <LoginModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setModalShow={setModalShow}
      />
    </>
  );
};

export default LoginButton;
