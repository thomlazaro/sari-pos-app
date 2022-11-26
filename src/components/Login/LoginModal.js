import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function LoginModal(props) {

  return (
    <>
      <Modal size="sm" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" 
            onClick={()=>{
              props.handleClose();
              }
            }>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;

