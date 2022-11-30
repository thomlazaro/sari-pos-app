import ItemList from "./ItemList";
import './Items.css';
import { Fragment,useState,useEffect } from "react";
import { useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import ItemForm from "./ItemForm";
import { useDispatch } from 'react-redux';
import { itemsActions } from '../../store/items-slice';
import { homeActions } from "../../store/home-slice";
import { deleteItem } from '../../lib/sari-api';
import ItemModal from "./ItemModal";
import PageUI from "../UI/PageUI";

const Items = ()=>{
    const dispatch = useDispatch();
    //set Items Element
    const itemsList = useSelector(state=>state.items.pageItems);
    //get all items in items state
    const allItemList = useSelector(state=>state.items.items);
    //get total page count
    const pageCount = useSelector(state=>state.items.pages);
    //get current page
    const currentPage = useSelector(state=>state.items.currentPage);
    //console.log(formatPageArray(10));
    //set State for filtered Items
    const [filteredItems,setFilteredItems] = useState(allItemList);
    const [searchItem,setSearchItem] = useState('');

    //set Modal state for Inventory notif
    const [showModal, setShowModal] = useState({show:false,heading:null,message:null});
    const handleCloseModal = () => setShowModal({show:false,heading:null,message:null});
    const handleShowModal = (heading,message) => {
        setShowModal({show:true,heading:heading,message:message});
    };    
    //set Item Modal for Add
    const [show, setShow] = useState(false);
    const handleClose = (heading,message) => {
        setShow(false);
        if(heading&&message){
            handleShowModal(heading,message);
        }
    };
    const handleShow = () => {
        setShow(true);
    };

    const clearSearchItemHandler = ()=>{
        setSearchItem('');
    }

    //delete item handler function
    const deleteItemHandler = async(id,name)=>{
        //delete item from backend using id
        const token = localStorage.getItem('token');
        const responseObj = await deleteItem({id:id},token);
        //update home state total possible displays
        const itemToDelete = allItemList.find(item=>item.id===id);
        const profit = 
            (itemToDelete.count*itemToDelete.selling_price)-(itemToDelete.count*itemToDelete.price);
        const updateObject = {
            count:itemToDelete.count,
            selling_price:itemToDelete.selling_price,
            price:itemToDelete.price,
            profit:profit
        }

        dispatch(homeActions.subtractTotalSales(
            updateObject
        ));

        //delete item by id
        dispatch(itemsActions.removeItem(
            { id:id }
        ));

        dispatch(itemsActions.updatePage({
            currentPage:currentPage,
            item_page_count:responseObj.item_page_count
        }))

        dispatch(itemsActions.replacePageItems({
            currentPage:1
        }));

        //clear search filter state
        clearSearchItemHandler();
        //filterChangeHandler();
        //console.log(newItems);
        handleShowModal(`Delete Notification`,`${name} Deleted!`);
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
            <ItemList 
                key={item.id} 
                item={item} 
                deleteItem={deleteItemHandler}
                closeModal={handleCloseModal}
                openModal={handleShowModal}
                showModal={showModal}
                searchItem={searchItem}
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
                    Add New Item
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
                <ItemForm 
                    show={show} 
                    handleClose={handleClose} 
                    clearSearchItemHandler={clearSearchItemHandler}
                    closeModal={handleCloseModal}
                    openModal={handleShowModal}
                />
                <ItemModal show={showModal} handleClose={handleCloseModal} />
            </section>              
        </Fragment>  
    )
}

export default Items;