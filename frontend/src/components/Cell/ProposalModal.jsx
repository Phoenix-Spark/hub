import { Modal } from 'react-bootstrap';
import ProposalForm from '../../pages/ProposalForm.js';
import './ProposalModal.scss';

export default function ProposalModal(props) {
  const { setModalShow, ...rest } = props;
  return (
    <Modal
      className="proposal-modal"
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="proposal-modal-body">
        <ProposalForm setModalShow={props.setModalShow} />
      </Modal.Body>
    </Modal>
  );
}
