import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './DebtDetail.css'
import { Fragment } from 'react';
import SaleItem from '../Sales/SaleItem';


const DebtDetail = (props)=>{

     //cart item List
     const saleItemElement = props.debt.items.map(item=>{
        return(
            <SaleItem 
            key={item.id}
            item={item}
            />
        )
    });

    return(
        <Fragment>
            <Modal size="sm" show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Debt Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <div className='cart-items'>
                        {saleItemElement}
                    </div> 
                    
                    <div>
                        <Form.Group className="mb-3" controlId={`addItemForm.total_selling_price`}>
                            <Form.Label><i>Total Debt: </i><b>P{props.debt.total_selling_price}</b></Form.Label>
                        </Form.Group>
                    </div> 
                    <div>
                        <Form.Group className="mb-3" controlId={`addItemForm.debtors_name`}>
                            <Form.Label><i>Debtor's Name: </i><b>{props.debt.debtors_name}</b></Form.Label>
                        </Form.Group>
                    </div>     
                </Form>
                </Modal.Body>
                
                <Modal.Footer>
                <Button variant="primary" onClick={()=>{
                    props.handleClose();
                    props.paidDebt()
                    }}>
                    Mark as Paid
                </Button>    
                <Button variant="success" onClick={props.handleClose}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default DebtDetail;