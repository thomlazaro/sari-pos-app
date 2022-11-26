import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function ItemModal(props) {
  return (
    <>
      <Modal size="sm" show={props.show.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.show.heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.show.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ItemModal;