import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function DebtPaidModal(props) {
  return (
    <>
      <Modal size="sm" show={props.show} onHide={props.handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Paid Debt Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>Debt of <b>{props.debt.debtors_name}</b> with amount of <b>P{props.debt.total_selling_price}</b> will be marked as paid, Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={()=>{
            props.handleClose()
            props.debtPaid(props.debt)         
          }}>
            Yes
          </Button>          
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DebtPaidModal;