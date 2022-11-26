import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { itemsActions } from '../../store/items-slice';
import { homeActions } from '../../store/home-slice';
//dummy api
//import { addItem } from '../../lib/dummy-api';
//real api
import { addItem } from '../../lib/sari-api';

import './ItemForm.css'

//validate number input and return object
export const validateNumberInput = (numberInput)=>{
        //check if valid number
        if(!isNaN(numberInput)){
          //do nothing
          //console.log(countNum)
      }
      else{   
          return {valid:false,error:"Number must be in correct format and cannot be negative!"};
      }


      if (numberInput.toString().indexOf('-')===-1){
          if((numberInput-1)===-1){
              return {valid:false,error:"Number must be in correct format and cannot be negative!"};
          }
          else{
             return {valid:true,error:null};
          }
          
      }  
      else{
          //check if not empty
          if(numberInput.toString().length===0){       
              return {valid:false,error:"This field is invalid! Please input a valid number!"};
          }
           //else
          return {valid:false,error:"Number must be in correct format and cannot be negative!"};
      }   

  }



const ItemForm = (props)=>{

    const dispatch = useDispatch();
    //item State
    const [name,setName] = useState('');
    const [type,setType] = useState('Can');
    const [count,setCount] = useState(1);
    const [sellingPrice,setSellingPrice] = useState(1);
    const [price,setPrice] = useState(1);

    //item validation state
    const [isNameValid,setIsNameValid] = useState(true);
    const [isCountValid,setIsCountValid] = useState({valid:true,error:null});
    const [isSellingPriceValid,setIsSellingPriceValid] = useState({valid:true,error:null});
    const [isPriceValid,setIsPriceValid] = useState({valid:true,error:null});
    const [isFormTouched,setIsFormTouched] = useState({valid:true,error:null});
    

    const submitFormHandler = async(event) =>{
        event.preventDefault();
        //if any input is not touched
        if(!isFormTouched){
            return;
        }

        //validate data
        if(isNameValid&&isCountValid.valid&&isSellingPriceValid.valid&&isPriceValid.valid){

        }
        else{
            return;
        }
        //get date today
        const dateToday = new Date().toLocaleDateString();
        //const dateString = dateToday.toLocaleDateString();
        //format item object
        let newItem = {
            name: name, 
            type:type,
            count: count, 
            selling_price: sellingPrice, 
            price: price,
            date_added:dateToday
        }
        //handleForm Action
        //add item to back-end
        let itemData;
        const token = localStorage.getItem('token');
        //const token = 'dsadsa'
        await addItem(newItem,token).then(data=>itemData=data);//add .then or .catch to handle response
        //console.log(itemID);
        //update home state total possible displays
        const profit = 
            (newItem.count*newItem.selling_price)-(newItem.count*newItem.price);
        const updateObject = {
            count:newItem.count,
            selling_price:newItem.selling_price,
            price:newItem.price,
            profit:profit
        }

        dispatch(homeActions.addTotalSales(
            updateObject
        ));

        dispatch(itemsActions.updatePage({
            currentPage:1,
            item_page_count:itemData.item_page_count
        }));

        dispatch(itemsActions.replacePageItems({
            currentPage:1
        }))

        //add item to state
        dispatch(itemsActions.addtoItem(
            {...newItem,id:itemData.id}
        ));

        

        //reset form state and close modal
        setName('');
        setCount(1);
        setSellingPrice(1);
        setPrice(1);
        props.handleClose(`Add Item Notification`,`${newItem.name} added!`);
        //console.log(event);
    }

    //on Change Form Handler
    const nameChangeHandler=(event)=>{
        setIsFormTouched(true);
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

    const blurNameHandler = (event)=>{
        setIsFormTouched(true);
        const nameValue = event.target.value;
        setName(nameValue);
        //check if empty or not
        if(nameValue.trim().length===0){
            setIsNameValid(false);
        }
        else{
            setIsNameValid(true);
        }
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
        <Modal.Title>Add New Item</Modal.Title>
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
                        onBlur={blurNameHandler}
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
                        step="1"
                        min='1'
                        value={count}
                        className={isCountValid.valid?'':'input-invalid'}
                        onChange={countChangeHandler}
                    />
                    {isFormTouched&&!isCountValid.valid&&<Form.Text className='text-invalid'>{isCountValid.error}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="addItemForm.selling_price">
                    <Form.Label>Selling Price</Form.Label>
                    <Form.Control
                        type="number"
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
            Add
        </Button>
        </Modal.Footer>
    </Modal>
    )
}

export default ItemForm;