import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import './ItemList.css'
import { useState,Fragment } from 'react';
import ItemUpdateForm from "./ItemUpdateForm";
import ItemDeleteModal from './ItemDeleteModal';

export const getItemImage = (imgType) =>{
    if(imgType==="Can"){
        return './images/Cans.jpg'
    }
    else if(imgType==="Cook"){
        return './images/Cook.jpg'
    }
    else if(imgType==="Noodle"){
        return './images/Noodle.jpg'
    }
    else if(imgType==="Snack"){
        return './images/Snack.jpg'
    }
    else if(imgType==="Household"){
        return './images/Household.jpg'
    }
    else if(imgType==="Personal"){
        return './images/Personal.jpg'
    }
    else if(imgType==="Digital"){
        return './images/Digital.png'
    }
    else{
        return './images/Other.png'
    }
    
}

const ItemList = (props)=>{


    //set Item Modal for Update
    const [show, setShow] = useState(false);
    const handleClose = (heading,message) => {
        setShow(false);
        //if heading and message is not empty
        if(heading&&message){
            props.openModal(heading,message); 
        }
        
    };
    const handleShow = () => {
        setShow(true);
    };

    //set Item Modal for Delete
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => {
        setShowDelete(true);
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
            <ListGroup.Item><b>Price:</b> {props.item.price}</ListGroup.Item>
            <ListGroup.Item><b>Date Added:</b> {props.item.date_added}</ListGroup.Item>
            {props.item.date_edit&&
            <ListGroup.Item><b>Updated:</b> {props.item.date_edit}</ListGroup.Item>}
        </ListGroup>
        <Card.Body>
            <Button variant="primary" onClick={handleShow}>Update</Button>{' '}
            <Button variant="danger" onClick={handleShowDelete} >Delete</Button>
        </Card.Body>
        </Card>
        <div className="update-modal">
            <ItemUpdateForm show={show} handleClose={handleClose} item={props.item}/>
            <ItemDeleteModal 
                show={showDelete} 
                handleClose={handleCloseDelete} 
                deleteItem={props.deleteItem} 
                id={props.item.id}
                name={props.item.name}
                />
        </div>
    </Fragment>
    )
}

export default ItemList;