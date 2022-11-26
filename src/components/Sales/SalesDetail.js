import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './SalesDetail.css'
import { Fragment } from 'react';
import SaleItem from './SaleItem';


const SalesDetail = (props)=>{

     //cart item List
     const saleItemElement = props.sale.items.map(item=>{
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
                <Modal.Title>Sales Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <div className='cart-items'>
                        {saleItemElement}
                    </div> 
                    
                    <div>
                        <Form.Group className="mb-3" controlId={`addItemForm.total_selling_price`}>
                            <Form.Label><i>Total Price: </i><b>P{props.sale.total_selling_price}</b></Form.Label>
                        </Form.Group>
                    </div>    
                </Form>
                </Modal.Body>
                
                <Modal.Footer>
                <Button variant="success" onClick={props.handleClose}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default SalesDetail;