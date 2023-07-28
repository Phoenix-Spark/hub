import { useState } from 'react';
import { Modal } from 'react-bootstrap';

import Login from './Login.jsx';

const LoginModal = props => {
  // const [submitBtnEnabled, setSubmitBtnEnabled] = useState(false);

  const { setModalShow, ...rest } = props;

  return (
    <Modal
      className="login-modal"
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="login-modal-body">
        <Login setModalShow={props.setModalShow} />
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
