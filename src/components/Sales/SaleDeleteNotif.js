import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function SaleDeleteNotif(props) {
  return (
    <>
      <Modal size="sm" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Sale Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sale with amount of P{props.amount} deleted!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SaleDeleteNotif;