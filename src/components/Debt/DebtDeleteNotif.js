import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function DebtDeleteNotif(props) {
  return (
    <>
      <Modal size="sm" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.debtNotification.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.debtNotification.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DebtDeleteNotif;