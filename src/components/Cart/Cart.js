import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
//import { itemsActions } from '../../store/items-slice';
import Button from 'react-bootstrap/Button';
import CartList from './CartList';
import CartModal from './CartModal';
import CartSaleComplete from './CartSaleComplete';
import PageUI from '../UI/PageUI';
import './Cart.css'


const Cart = ()=> {

    //set Items Element
    const itemsList = useSelector(state=>state.items.pageItems);
    //get all items from item slice
    const allItemList = useSelector(state=>state.items.items);
    //get total page count
    const pageCount = useSelector(state=>state.items.pages);
    //get current page
    const currentPage = useSelector(state=>state.items.currentPage);
    //set cart Element
    const cartTotal = useSelector(state=>state.cart.total_item_count);
    //set State for filtered Items
    const [filteredItems,setFilteredItems] = useState(allItemList);
    const [searchItem,setSearchItem] = useState('');

    //set Modal state for Sales notif
    /*const [showModal, setShowModal] = useState({show:false,heading:null,message:null});
    const handleCloseModal = () => setShowModal({show:false,heading:null,message:null});
    const handleShowModal = (heading,message) => {
        setShowModal({show:true,heading:heading,message:message});
    };  */  
    //set Cart Modal for Checking out
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
    };

    //set Cart Modal for Sale Notification
    const [showSaleComplete, setShowSaleComplete] = useState(false);
    const handleCloseSaleComplete = () => {
        setShowSaleComplete(false);
    };
    const handleShowSaleComplete = () => {
        setSearchItem('');
        setShowSaleComplete(true);
    };

    const clearSearchItemHandler = ()=>{
        setSearchItem('');
    }


    //set use effect for itemsList to make sure we are getting the lastest filtered items
    useEffect(()=>{
        setFilteredItems(itemsList);
    }
    ,[itemsList]);

    //set Items Element
    const itemsElement = filteredItems.map(item=>{
        //console.log(item.id);
        return(
            <CartList 
                key={item.id} 
                item={item} 
                clearSearchItemHandler={clearSearchItemHandler}
            />
        );
    });

    //item filter change handler
    const filterChangeHandler =(event)=>{
        const newSearch = event.target.value;
        let newItems;
        setSearchItem(newSearch);
        if(newSearch.trim()===''){
            newItems = itemsList.filter(item=>item.name.toLowerCase().includes(newSearch.toLowerCase()));
        }
        else{
            newItems = allItemList.filter(item=>item.name.toLowerCase().includes(newSearch.toLowerCase()));
        }
        
        setFilteredItems(newItems);
        //console.log(newItems);

    }

    return(
        <Fragment>
        <section className="sort">
            <input type='text' maxLength='50' onChange={filterChangeHandler} value={searchItem}/>
            <Button variant="primary" onClick={handleShow}>
                    <i>Cart Items -</i> <b>{cartTotal}</b>
            </Button>
        </section>
        {searchItem===''&&
            <section className="page">
                <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Items" />
            </section>
        }
        <section className="items">
            {itemsElement}
        </section>
        {searchItem===''&&
            <section className="page">
                <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Items" />
            </section>
        }
        <section>
            <CartModal 
                show={show} 
                handleClose={handleClose} 
                itemList={itemsList} 
                handleShowSaleComplete={handleShowSaleComplete}
                clearSearchItemHandler={clearSearchItemHandler}
            />
            <CartSaleComplete show={showSaleComplete} handleClose={handleCloseSaleComplete}/>
        </section>          
    </Fragment>  
    )
}

export default Cart;