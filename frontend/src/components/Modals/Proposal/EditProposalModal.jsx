import { Modal } from 'react-bootstrap';
import ProposalForm from './ProposalForm.jsx';

export default function EditProposalModal(props) {
  const { setModalShow, projectData, onHide, refreshList, onSuccess, ...rest } = props;
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
          setModalShow={props.setModalShow}
          projectData={projectData}
          hideModal={onHide}
          refreshList={refreshList}
          setSuccess={onSuccess}
        />
      </Modal.Body>
    </Modal>
  );
}
