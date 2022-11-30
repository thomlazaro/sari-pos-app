import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch,useSelector } from 'react-redux';
import { useState } from 'react';
import { cartActions } from '../../store/cart-slice';
import { itemsActions } from '../../store/items-slice';

//validate number input and return object
export const validateNumberInput = (numberInput,totalItemCount)=>{
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
             if(numberInput>totalItemCount){
                return {valid:false,error:"Quantity cannot be greater than current stock!"};
             }
             else{
                return {valid:true,error:null};
             }
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



const AddToCartForm = (props)=>{

    const dispatch = useDispatch();
    const currentPage = useSelector(state=>state.items.currentPage);
    //Sales State
    const [count,setCount] = useState(1);

    //Sales validation state
    const [isCountValid,setIsCountValid] = useState({valid:false,error:null});
    const [isFormTouched,setIsFormTouched] = useState(false);
    

    const submitFormHandler = async(event) =>{
        event.preventDefault();


        //check first if count is valid
        const isForm = validateNumberInput(count,parseInt(props.item.count));
        setIsCountValid(isForm);
   

        //validate data
        if(isForm.valid){
            //do nothing
        }
        else{
            return;
        }

        //format item object
        let newItem = {
            id:props.item.id,
            name: props.item.name, 
            buy_count: parseInt(count), 
            selling_price: parseFloat(props.item.selling_price), 
            price: parseFloat(props.item.price)
        }
        //handleForm Action
        //add item to cart state
        dispatch(cartActions.addItemtoCart(
            {...newItem}
        ));
        //update item count
        dispatch(itemsActions.updateItemCount(
            {
                id:props.item.id,
                count:parseInt(props.item.count)-parseInt(count)
            }
        ));

        dispatch(itemsActions.replacePageItems(
            {
                currentPage:currentPage
            }
        ));

        //update item count to items state

        //reset form state and close modal
        setCount(1);
        props.clearSearchItemHandler();
        props.handleClose();
        //console.log(event);
    }

    //on Change Form Handler
    const countChangeHandler=(event)=>{
        setIsFormTouched(true);
        const countNum = event.target.value;
        setCount(countNum);
        setIsCountValid(validateNumberInput(countNum,parseInt(props.item.count)));
    }

    return(
        <Modal size="sm" show={props.show} onHide={props.handleClose} backdrop="static">
        <Modal.Header closeButton>
        <Modal.Title>Add To Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
                <Form.Group className="mb-3" controlId="addItemForm.name">
                    <Form.Label><b>{props.item.name}</b></Form.Label>
                </Form.Group>
                <Form.Group className="mb-3" controlId="addItemForm.stock">
                    <Form.Label><i>Current Stock: </i><b>{props.item.count}</b></Form.Label>
                </Form.Group>
                <Form.Group className="mb-3" controlId="addItemForm.count">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="number"
                        step="1"
                        min='1'
                        value={count}
                        className={isCountValid.valid?'':'input-invalid'}
                        onChange={countChangeHandler}
                        autoFocus
                    />
                    {isFormTouched&&!isCountValid.valid&&<Form.Text className='text-invalid'>{isCountValid.error}</Form.Text>}
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

export default AddToCartForm;