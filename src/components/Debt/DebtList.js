import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Fragment,useState } from 'react';
import DebtDetail from './DebtDetail';
import './DebtList.css'
import DebtDeleteModal from './DebtDeleteModal'
import DebtPaidModal from './DebtPaidModal';

const DebtList = (props)=>{
    //set Debt Detail Modal state
    const[show,setShow] = useState(false);
    const handleClose = () => {
        setShow(false);        
    };
    const handleShow = () => {
        setShow(true);
    };

    //set Modal for Delete Debt
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => {
        setShowDelete(true);
    };

    //set Debt Paid Modal
    const [showPaid,setShowPaid] = useState(false);
    const handleShowPaid = ()=>{
        setShowPaid(true);
    }
    const handleClosePaid = ()=>{
        setShowPaid(false);
    }
    
    
    return(
        <Fragment>
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title>P{props.debt.total_selling_price}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
            <ListGroup.Item><b>Debtor's Name:</b> {props.debt.debtors_name} </ListGroup.Item>
            <ListGroup.Item><b>Sale Date:</b> {props.debt.sale_date} </ListGroup.Item>
            <ListGroup.Item><b>Total Items:</b> {props.debt.total_item_count} </ListGroup.Item>
            <ListGroup.Item><b>Profit:</b> P{props.debt.total_selling_price-props.debt.total_price} </ListGroup.Item>
        </ListGroup>
        <Card.Body>
            <Button variant="primary" onClick={handleShow}>Debt Details</Button>{' '}
            <Button variant="danger" onClick={handleShowDelete}>Delete</Button>
        </Card.Body>
        </Card>
        <div className='sales-modal'>
            <DebtDetail 
                show={show} 
                handleClose={handleClose} 
                debt={props.debt} 
                paidDebt={handleShowPaid}
            />
            <DebtDeleteModal 
                show={showDelete} 
                amount={props.debt.total_selling_price}
                name={props.debt.debtors_name}
                id={props.debt.id}
                handleClose={handleCloseDelete} 
                deleteDebt={props.deleteDebt}
            />
            <DebtPaidModal 
                show={showPaid} 
                handleClose={handleClosePaid} 
                debtPaid={props.paidDebtHandler} 
                id={props.debt.id} 
                debt={props.debt}       
            />
        </div>
    </Fragment>        
    )
}

export default DebtList;