import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function CartSaleComplete(props) {
  return (
    <>
      <Modal size="sm" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sale Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>Transaction completed!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CartSaleComplete;