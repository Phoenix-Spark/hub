import '../App.css';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Login from './Login.js';

const LoginModal = ( props ) => {

  // const [submitBtnEnabled, setSubmitBtnEnabled] = useState(false);

  // const enableButton = () => {
  //   setSubmitBtnEnabled(true);
  // }

  return (
    <Modal
      className='login-modal'
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body
      className='login-modal-body'>
        <Login setModalShow={props.setModalShow} /*enableButton={enableButton}*//>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;