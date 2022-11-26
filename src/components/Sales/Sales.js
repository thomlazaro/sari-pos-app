import './Sales.css'
import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SalesList from './SalesList';
import { salesActions } from '../../store/sales-slice';
import { homeActions } from '../../store/home-slice';
import { deleteSales } from '../../lib/sari-api';
import SaleDeleteNotif from './SaleDeleteNotif';
import PageUI from '../UI/PageUI';

const Sales = ()=> {
    const dispatch = useDispatch();
    const salesList = useSelector(state=>state.sales.salePage);
    //get total page count
    const pageCount = useSelector(state=>state.sales.salesPageCount);
    //get current page
    const currentPage = useSelector(state=>state.sales.currentPage);

    const [filterSale,setFilterSale] = useState({month:'Jan',year:'2022'});

    //set Delete Notification modal state
    const [amount,setAmount] = useState(0);
    const [show,setShow] = useState(false);
    const handleShow = ()=>{
        setShow(true);
    }
    const handleClose = ()=>{
        setShow(false);
    }


    const yearChangeHandler = (event)=>{
        //console.log(event.target.value);
        setFilterSale(prevValue=>{
            return {...prevValue,year:event.target.value}
        });
    };

    const monthChangeHandler = (event)=>{
        //console.log(event.target.value);
        setFilterSale(prevValue=>{
            return {...prevValue,month:event.target.value}
        });
    };

    //delete sale handler function to be passed to SalesList then SaleDeleteModal
    const deleteSaleHandler = async(id,amount)=>{
        //delete item from backend using id
        setAmount(amount);
        const token = localStorage.getItem('token')
        const responseObj = await deleteSales({id:id},token);
        //update home state if sale date is today
        const currentSale = salesList.find(sale=>sale.id===id);
        dispatch(homeActions.subtractTodayTotalSales({
            ...currentSale
        }));


        //delete item by id
        dispatch(salesActions.removeSale(
            { id:id }
        ));
        //console.log(responseObj)
        dispatch(salesActions.updatePage({
            currentPage:1,
            salesPageCount:responseObj.sale_page_count
        }))

        dispatch(salesActions.replacePageSales({
            currentPage:currentPage
        }));
        //clear search filter state
        //setSearchItem('');
        //filterChangeHandler();      
        handleShow();//show delete sale notification
        //handleShowModal(`Delete Notification`,`${name} Deleted!`);
            
    }

    //generate salesList element
    const salesListElement = salesList.map(sale=>{
        return(
            <SalesList key={sale.id} sale={sale} deleteSale={deleteSaleHandler}/>
        )
    });

    return(
        <Fragment>
            <section className="sort">
                <label>{filterSale.month} {filterSale.year}</label>
                <select 
                    value={filterSale.month} 
                    onChange={monthChangeHandler}
                    className="form-select-sm" 
                >
                    <option>Jan</option>
                    <option>Feb</option>
                    <option>Mar</option>
                    <option>Apr</option>
                    <option>May</option>
                    <option>Jun</option>
                    <option>Jul</option>
                    <option>Aug</option>
                    <option>Sep</option>
                    <option>Oct</option>
                    <option>Nov</option>
                    <option>Dec</option>
                </select>
                <select 
                    value={filterSale.year} 
                    onChange={yearChangeHandler}
                    className="form-select-sm" 
                >
                    <option>2022</option>
                    <option>2021</option>
                </select>
            </section>
            <section className='page'>
                <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Sales"/>
            </section>
            <section className='items'>
                {salesListElement}
            </section>
            <section className='page'>
                <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Sales"/>
            </section>
            <section>
                <SaleDeleteNotif show={show} handleClose={handleClose} amount={amount}/>
            </section>
        </Fragment>  
    )
}

export default Sales;