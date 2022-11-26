import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ItemDeleteModal(props) {

  return (
    <>
      <Modal size="sm" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete {props.name}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            No
          </Button>
          <Button variant="danger" 
            onClick={()=>{
              props.deleteItem(props.id,props.name);
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

export default ItemDeleteModal;

