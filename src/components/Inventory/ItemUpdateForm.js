import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch,useSelector } from 'react-redux';
import { useState } from 'react';
import { itemsActions } from '../../store/items-slice';
import { homeActions } from '../../store/home-slice';
import { updateItem } from '../../lib/sari-api';
import { validateNumberInput } from './ItemForm'
import './ItemForm.css'

const ItemUpdateForm = (props)=>{

    const dispatch = useDispatch();
    const itemsList = useSelector(state=>state.items.items);
    const currentPage = useSelector(state=>state.items.currentPage);

    //item State
    const [name,setName] = useState(props.item.name);
    const [type,setType] = useState(props.item.type);
    const [count,setCount] = useState(props.item.count);
    const [sellingPrice,setSellingPrice] = useState(props.item.selling_price);
    const [price,setPrice] = useState(props.item.price);

    //item validation state
    const [isNameValid,setIsNameValid] = useState(true);
    const [isCountValid,setIsCountValid] = useState({valid:true,error:null});
    const [isSellingPriceValid,setIsSellingPriceValid] = useState({valid:true,error:null});
    const [isPriceValid,setIsPriceValid] = useState({valid:true,error:null});
    const [isFormTouched,setIsFormTouched] = useState({valid:true,error:null});    

    const submitFormHandler = async(event) =>{
        event.preventDefault();
        //get date today
        const dateToday = new Date().toLocaleDateString();
        //const dateString = dateToday.toLocaleDateString();
        //format item object
        const newItem = {
            id:props.item.id,
            name: name,
            type:type, 
            count: count, 
            selling_price: sellingPrice, 
            price: price,
            date_added:props.item.date_added,
            date_edit:dateToday
        }
        //handleForm Action
        //update item to back-end
        const token = localStorage.getItem('token')
        let updateComplete;
        let errorMsg="";
        
        await updateItem(newItem,token)
            .then(()=>{
                updateComplete=true;
            })
            .catch((err)=>{
                console.log(err);
                errorMsg = err;
                updateComplete = false;
               
            });//add .then or .catch to handle response
        if(!updateComplete){
            props.handleClose(`Update Item Notification`,`${errorMsg}`);
            return;
        }
        

        //update home state total possible displays
        const currentItem = itemsList.find(item=>item.id===props.item.id);
        const profit = 
            (currentItem.count*currentItem.selling_price)-(currentItem.count*currentItem.price);
        const newProfit = 
            (newItem.count*newItem.selling_price)-(newItem.count*newItem.price);
        //console.log(profit);
        const currentObject = {
            count:currentItem.count,
            selling_price:currentItem.selling_price,
            price:currentItem.price,
            profit:profit
        }

        dispatch(homeActions.updateTotalSales({
            current:currentObject,
            updated:{...newItem,profit:newProfit}
        }
        ));

        //update item to state
        dispatch(itemsActions.updateItem(
            newItem
        ));

        dispatch(itemsActions.replacePageItems({
            currentPage:currentPage
        }));

        //reset form state and close modal
        //console.log(newItem);
        props.handleClose(`Update Item Notification`,`${newItem.name} updated!`);
        //console.log(event);
    }


    
    //on Change Form Handler
    const nameChangeHandler=(event)=>{
        setIsFormTouched(true);
        setName(event.target.value);
        const nameValue = event.target.value;
        setName(nameValue);
        //check if empty or not
        if(nameValue.trim().length===0){
            setIsNameValid(false);
        }
        else{
            setIsNameValid(true);
        }
        //console.log(event.target.value);
    }

    const typeChangeHandler=(event)=>{
        
        setType(event.target.value);
    }

    const countChangeHandler=(event)=>{
        setIsFormTouched(true);
        const countNum = event.target.value;
        setCount(countNum);
        setIsCountValid(validateNumberInput(countNum));
    }

    const sellingPriceChangeHandler=(event)=>{
        setIsFormTouched(true);
        setSellingPrice(event.target.value);
        setIsSellingPriceValid(validateNumberInput(event.target.value));
        //console.log(event.target.value);
    }

    const priceChangeHandler=(event)=>{
        setIsFormTouched(true);
        setPrice(event.target.value);
        setIsPriceValid(validateNumberInput(event.target.value));
        //console.log(event.target.value);
    }

    return(
        <Modal size="sm" show={props.show} onHide={props.handleClose} backdrop="static">
        <Modal.Header closeButton>
        <Modal.Title>Update Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
                <Form.Group className="mb-3" controlId="addItemForm.name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Item Name"
                        value={name}
                        maxLength="50"
                        onChange={nameChangeHandler}
                        className={isNameValid?'':'input-invalid'}
                        autoFocus
                    />
                    {isFormTouched&&!isNameValid&&<Form.Text className='text-invalid'>Name cannot be empty!</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="addItemForm.type">
                    <Form.Label>Type</Form.Label>
                    <Form.Select onChange={typeChangeHandler} value={type} aria-label="Item Type">
                        <option value="Can">Canned Goods</option>
                        <option value="Cook">Cook</option>
                        <option value="Noodle">Noodle</option>
                        <option value="Snack">Snack</option>
                        <option value="Household">Household</option>
                        <option value="Personal">Personal</option>
                        <option value="Digital">Digital</option>
                        <option value="Other">Other</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="addItemForm.count">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="1"
                        step="1"
                        min='1'
                        className={isCountValid.valid?'':'input-invalid'}
                        value={count}
                        onChange={countChangeHandler}
                    />
                    {isFormTouched&&!isCountValid.valid&&<Form.Text className='text-invalid'>{isCountValid.error}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="addItemForm.selling_price">
                    <Form.Label>Selling Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="1"
                        step="1"
                        min='1'
                        className={isSellingPriceValid.valid?'':'input-invalid'}
                        value={sellingPrice}
                        onChange={sellingPriceChangeHandler}
                    />
                    {isFormTouched&&!isSellingPriceValid.valid&&<Form.Text className='text-invalid'>{isSellingPriceValid.error}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="addItemForm.price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="1"
                        step="1"
                        min='1'
                        className={isPriceValid?'':'input-invalid'}
                        value={price}
                        onChange={priceChangeHandler}
                    />
                    {isFormTouched&&!isPriceValid.valid&&<Form.Text className='text-invalid'>{isPriceValid.error}</Form.Text>}
                </Form.Group>        
        </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
            Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={submitFormHandler}>
            Update
        </Button>
        </Modal.Footer>
    </Modal>
    )
}

export default ItemUpdateForm;