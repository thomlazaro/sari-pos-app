import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import './CartList.css'
import { useState,Fragment } from 'react';
import AddToCartForm from './AddToCartForm';
import { getItemImage } from '../Inventory/ItemList';


const CartList = (props)=>{


    //set Add to Cart Modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
    };


    return(
    <Fragment>
        <Card style={{ width: '18rem' }}>
        <Card.Img className="card-img" variant="top" src={getItemImage(props.item.type)} />
        <Card.Body>
            <Card.Title>{props.item.name}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
            <ListGroup.Item><b>Stock:</b> {props.item.count}</ListGroup.Item>
            <ListGroup.Item><b>Selling Price:</b> {props.item.selling_price}</ListGroup.Item>
            <ListGroup.Item><b>Date Added:</b> {props.item.date_added}</ListGroup.Item>
            {props.item.date_edit&&
            <ListGroup.Item><b>Updated:</b> {props.item.date_edit}</ListGroup.Item>}
        </ListGroup>
        <Card.Body>
            <Button variant="primary" onClick={handleShow}>Add to Cart</Button>{' '}
        </Card.Body>
        </Card>
        <div className="update-modal">
            <AddToCartForm show={show} handleClose={handleClose} item={props.item}/>
        </div>
    </Fragment>
    )
}

export default CartList;