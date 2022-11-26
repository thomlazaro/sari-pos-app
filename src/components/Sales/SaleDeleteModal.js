import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function SaleDeleteModal(props) {

  return (
    <>
      <Modal size="sm" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Sale with amount of P{props.amount}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            No
          </Button>
          <Button variant="danger" 
            onClick={()=>{
              props.deleteSale(props.id,props.amount);
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

export default SaleDeleteModal;

