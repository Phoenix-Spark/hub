import { Modal } from 'react-bootstrap';
import ProposalForm from './ProposalForm.jsx';

export default function AddProposalModal(props) {
  const { setModalShow, cellId, onHide, ...rest } = props;
  return (
    <Modal
      {...rest}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="proposal-modal-body">
        <ProposalForm
          cellId={cellId}
          hideModal={onHide}
          setModalShow={props.setModalShow}
        />
      </Modal.Body>
    </Modal>
  );
}
