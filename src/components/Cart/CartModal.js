import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../store/cart-slice';
import { itemsActions } from '../../store/items-slice';
import { salesActions } from '../../store/sales-slice';
import { debtActions } from '../../store/debt-slice';
import { homeActions } from '../../store/home-slice';
import './CartModal.css'
import { Fragment,useState } from 'react';
import CartItem from './CartItem';
import Accordion from 'react-bootstrap/Accordion';
import { addSale } from '../../lib/sari-api';




const CartModal = (props)=>{

    const dispatch = useDispatch();

    //set cart items element
    const cartState = useSelector(state=>state.cart);

    //set inventory items element
    const itemsState = useSelector(state=>state.items.items);

    //get current page
    const currentPage = useSelector(state=>state.items.currentPage);

    //set state for debt flag
    const [debt,setDebt] = useState(false);
    const [debtorsName,setDebtorsName] = useState('');


    //gcash ref num
    const [refNum,setRefNum] = useState('');
    const [showRefNum,setShowRefNum] = useState(false);

    const token = localStorage.getItem('token');

    //when form modal is submitted
    const submitFormHandler = async(event) =>{
        event.preventDefault();
        const getToken = localStorage.getItem('token');
        if(refNum.trim().length===0&&!debt&&!getToken){
            //console.log('shit')
            setShowRefNum(true);
            return;
        }

        //get date today
        const dateToday = new Date().toLocaleDateString();
        //format sale object
        let newSale = {
            items:[...cartState.items],
            total_item_count:cartState.total_item_count,
            total_selling_price:cartState.total_selling_price,
            total_price:cartState.total_price,
            sale_date:dateToday,
            debt:debt,
            debtors_name:debtorsName,
            gcash_ref_num:refNum
        }
        //send to backend. add .then to get the id of the sale
        let salesData;
        const token = localStorage.getItem('token');
        await addSale(newSale,token).then(data=>salesData=data);
        //console.log("salesID:" + salesID)
        //update sales state if debt flag is false else update debt
        if(newSale.debt===false){
            //update home today stat
            dispatch(homeActions.addTodayTotalSales({
                ...newSale
            }));

            dispatch(salesActions.addSale({
                ...newSale,id:salesData.id
            }));

            dispatch(salesActions.updatePage({
                currentPage:1,
                salesPageCount:salesData.sale_page_count
            }));

            dispatch(salesActions.replacePageSales({
                currentPage:1
            }));
        }
        else{
            //add to home state
            dispatch(homeActions.addTotalDebt({
                ...newSale
            }));
            //update debt state
            dispatch(debtActions.addDebt({
                ...newSale,id:salesData.id
            }));

            dispatch(debtActions.updatePage({
                currentPage:1,
                debtsPageCount:salesData.debt_page_count
            }));

            dispatch(debtActions.replacePageDebts({
                currentPage:1
            }));
        }


        //get items that are bought to update inventory
        let boughtItems=[];
        cartState.items.forEach(item=>{  
            const findItem = itemsState.find(item2=>item2.id===item.id);
            boughtItems.push(findItem);          
        });

        //update items bought on back end - should be only one http request but for now will let multiple request
        /*boughtItems.forEach(item=>{

            //update item to back-end
            updateItem(item);//add .then or .catch to handle response
        });*/

        //reset cart after sending sale to back end
        dispatch(cartActions.resetCart());

        setDebt(false);
        setDebtorsName('');

        props.clearSearchItemHandler();

        //close cart modal
        props.handleClose();
        //show modal notification
        props.handleShowSaleComplete();

    }

    const addOneItemHandler = (id)=>{
      
        const currentItem = itemsState.find(item=>item.id===id);
        dispatch(cartActions.addOneItemtoCart({
            id:id
        }));

        dispatch(itemsActions.updateItemCount(
            {
                id:id,
                count:parseInt(currentItem.count)-1
            }
        ));

        dispatch(itemsActions.replacePageItems({
            currentPage:currentPage
        }));

        props.clearSearchItemHandler();
    }

    const removeOneItemHandler = (id)=>{
       
        dispatch(cartActions.removeOneItemtoCart({
            id:id
        }));
        //update items state count
        //get current item from props.itemList to get current count
        //const itemList = useSelector(state=>state.items.items);
        const currentItem = itemsState.find(item=>item.id===id);

        dispatch(itemsActions.updateItemCount(
            {
                id:id,
                count:parseInt(currentItem.count)+1
            }
        ));

        dispatch(itemsActions.replacePageItems({
            currentPage:currentPage
        }));

        props.clearSearchItemHandler();
    }

    const removeAllItemHandler =(id,buy_count)=>{
        dispatch(cartActions.removeAllItemtoCart({
            id:id
        }));
        //update items state count
        //get current item from props.itemList to get current count
        const currentItem = itemsState.find(item=>item.id===id)

        dispatch(itemsActions.updateItemCount(
            {
                id:id,
                count:parseInt(currentItem.count)+buy_count
            }
        ));

        dispatch(itemsActions.replacePageItems({
            currentPage:currentPage
        }));

        props.clearSearchItemHandler();

    }

    //debt flag change handler
    const debtChangeHandler = (event) =>{
        const debtFlag = event.target.checked;
        setDebt(debtFlag);
    }

    const changeDebtorsNameHandler = (event) =>{
        const debtors_name = event.target.value;
        setDebtorsName(debtors_name);
    }

    const changeRefNum = (event) => {
        const newRefNum = event.target.value;
        if(newRefNum.trim().length!==0){
            setShowRefNum(false);
        }
        else{
            setShowRefNum(true);
        }
        setRefNum(newRefNum);
    }

    //cart item List
    const cartItemElement = cartState.items.map(item=>{
        return(
            <CartItem 
            key={item.id}
            item={item}
            itemList={itemsState}
            removeOneItemHandler={removeOneItemHandler}
            removeAllItemHandler={removeAllItemHandler}
            addOneItemHandler={addOneItemHandler}
        />
        );

    });

   return(
        <Fragment>
        <Modal size="sm" show={props.show} onHide={props.handleClose} backdrop="static">
            <Modal.Header closeButton>
            <Modal.Title>Checkout Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <div className='cart-items'>
                    {cartItemElement}
                </div> 
                {cartItemElement.length===0&&<p>No Items yet. Use Add to Cart to add items here.</p>}
                {cartItemElement.length>0&& 
                <div>
                    <Form.Group className="mb-3" controlId={`addItemForm.total_selling_price`}>
                        <Form.Label><i>Total Price: </i><b>P{cartState.total_selling_price.toString()}</b></Form.Label>
                    </Form.Group>
                    {!token&& 
                        <Form.Group className="mb-3" controlId="addItemForm.refNum">  
                            <Form.Label><b>GCASH Reference Number </b></Form.Label>
                            <Form.Control
                                type="text"
                                value={refNum}
                                onChange={changeRefNum}
                            />
                            {showRefNum&&
                                <div>
                                    <Form.Label className='cart-item-no-stock'><b>Please Include the GCASH Reference Number!</b></Form.Label>
                                </div>
                            }
                        </Form.Group> 
                    }
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Option</Accordion.Header>
                            <Accordion.Body>
                            <Form.Group className="mb-3" controlId="addItemForm.debt">  
                                <input type="checkbox" id='debt' checked={debt} onChange={debtChangeHandler}/>
                                <label htmlFor='debt'>Debt</label>
                            </Form.Group>   
                            <Form.Group className="mb-3" controlId="addItemForm.debtors_name"> 
                                <Form.Label><b>Debtor's Name</b></Form.Label> 
                                <Form.Control
                                    type="text"
                                    value={debtorsName}
                                    onChange={changeDebtorsNameHandler}
                                    disabled={!debt}
                                />
                            </Form.Group>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>    
                }  
            </Form>
            </Modal.Body>
            
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Cancel
            </Button>
            {cartItemElement.length>0&& 
            <Button variant="primary" type="submit" onClick={submitFormHandler}>
                Checkout
            </Button>}
            </Modal.Footer>
        </Modal>
        </Fragment>
    )
}

export default CartModal;