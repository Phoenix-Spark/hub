import { Modal } from 'react-bootstrap';
import ProposalForm from './ProposalForm.js';

export default function ProposalModal(props) {
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
        <ProposalForm setModalShow={props.setModalShow} />
      </Modal.Body>
    </Modal>
  );
}
