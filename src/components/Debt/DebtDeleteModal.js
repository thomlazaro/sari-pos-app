import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DebtDeleteModal(props) {

  return (
    <>
      <Modal size="sm" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Debt</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Debt of <b>{props.name}</b> with amount of <b>P{props.amount}</b>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            No
          </Button>
          <Button variant="danger" 
            onClick={()=>{
              props.deleteDebt(props.id,props.amount,props.name);
              props.handleClose();
              }
            }>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DebtDeleteModal;

