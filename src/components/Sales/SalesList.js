import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Fragment,useState } from 'react';
import SalesDetail from './SalesDetail';
import './SalesList.css'
import SaleDeleteModal from './SaleDeleteModal'

const SalesList = (props)=>{
    //set Sale Detail Modal state
    const[show,setShow] = useState(false);
    const handleClose = () => {
        setShow(false);        
    };
    const handleShow = () => {
        setShow(true);
    };

    //set Modal for Delete Sale
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => {
        setShowDelete(true);
    };
    
    
    return(
        <Fragment>
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title>P{props.sale.total_selling_price}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
            <ListGroup.Item><b>Sale Date:</b> {props.sale.sale_date} </ListGroup.Item>
            <ListGroup.Item><b>Total Items:</b> {props.sale.total_item_count} </ListGroup.Item>
            <ListGroup.Item><b>Profit:</b> P{props.sale.total_selling_price-props.sale.total_price} </ListGroup.Item>
        </ListGroup>
        <Card.Body>
            <Button variant="primary" onClick={handleShow}>Sale Details</Button>{' '}
            <Button variant="danger" onClick={handleShowDelete}>Delete</Button>
        </Card.Body>
        </Card>
        <div className='sales-modal'>
            <SalesDetail show={show} handleClose={handleClose} sale={props.sale}/>
            <SaleDeleteModal 
                show={showDelete} 
                amount={props.sale.total_selling_price}
                id={props.sale.id}
                handleClose={handleCloseDelete} 
                deleteSale={props.deleteSale}
            />
        </div>
    </Fragment>        
    )
}

export default SalesList;