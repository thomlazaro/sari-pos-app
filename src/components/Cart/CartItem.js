import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState,useEffect } from 'react';
//import { useSelector } from 'react-redux';

const CartItem = (props)=>{

    //set max stock state
    const [show, setShow] = useState(false);
    //const itemList = useSelector(state=>state.items.items);
    //get current item from props.itemList to get current count
    const currentItem = props.itemList.find(itemList=>itemList.id===props.item.id);
    //const currentItem = itemList.find(itemList=>itemList.id===props.item.id);
    //modify add one item function
    const addOneItem =()=>{
        if(currentItem.count===0){
            //Show label when max stock is reached
            setShow(true);  
            //show=true;      
            return;
        }
        props.addOneItemHandler(props.item.id);
    }

    //useEffect for max stock
    useEffect(()=>{
        let timeOut;
        if(show){
            timeOut = setTimeout(()=>{setShow(false)},4000);
        }
        //clean up
        return () => {
            clearTimeout(timeOut);
        }
    },
    [show]);

    return(
        <Form.Group className="mb-3" controlId={`addItemForm.${props.item.id}`}>
            <div>
                <Form.Label><b>{props.item.name}</b></Form.Label>
            </div>
            {show&&
                <div>
                    <Form.Label className='cart-item-no-stock'><b>No more stock left for this item!</b></Form.Label>
                </div>
            }
            <div>
                <Form.Label>Remaining Stock: <b>{currentItem.count}</b></Form.Label>
            </div>
            <div>
                <Form.Label>Price per unit: <b>P{props.item.selling_price}</b></Form.Label>
            </div>
            <div className='cart-button'>
                <Button variant="outline-secondary" size="lg" type="button" onClick={()=>props.removeOneItemHandler(props.item.id)}>
                    -
                </Button>
                <span> </span>
                <Button variant="outline-success" size="lg" type="button" onClick={addOneItem}>
                    +
                </Button>
                <span> </span>
                <Button variant="outline-danger" size="lg" type="button" onClick={()=>props.removeAllItemHandler(props.item.id,props.item.buy_count)}>
                    Remove
                </Button>  
            </div>
            <Form.Label><i>Quantity: </i><b>{props.item.buy_count}</b></Form.Label> 
            <div>
            <Form.Label><i>Paying Price: </i><b>P{props.item.buy_count*props.item.selling_price}</b></Form.Label>                
            </div> 
            <hr />         
        </Form.Group>
    )
}

export default CartItem;