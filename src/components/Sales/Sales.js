import './Sales.css'
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SalesList from './SalesList';
import { salesActions } from '../../store/sales-slice';
import { homeActions } from '../../store/home-slice';
import { deleteSales } from '../../lib/sari-api';
import SaleDeleteNotif from './SaleDeleteNotif';
import PageUI from '../UI/PageUI';
import { Button } from 'react-bootstrap';

//get unique year values from sale slice
export const getYears = (salesData) =>{
    const saleDateOnly = salesData.map(sale=>{
        const getRawYear = sale.sale_date.substring(10,3);
        const getYearIndex = getRawYear.indexOf('/2');
        const getFinalYear = getRawYear.substring(getYearIndex+1);
        return getFinalYear;
    });

    const getUniqueYear = saleDateOnly.filter((value,index,self)=>self.indexOf(value) === index);
    return getUniqueYear;
}

const Sales = ()=> {
    const dispatch = useDispatch();
    const salesList = useSelector(state=>state.sales.salePage);
    const allSalesList = useSelector(state=>state.sales.sales);
    //get total page count
    const pageCount = useSelector(state=>state.sales.salesPageCount);
    //get current page
    const currentPage = useSelector(state=>state.sales.currentPage);

    const [filterSale,setFilterSale] = useState({month:'',year:''});
    const [filterSaleList,setFilterSaleList] = useState(salesList);

    //set Delete Notification modal state
    const [amount,setAmount] = useState(0);
    const [show,setShow] = useState(false);
    const handleShow = ()=>{
        setShow(true);
    }
    const handleClose = ()=>{
        setShow(false);
    }


    const yearChangeHandler = async (event)=>{
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

    //check date filter and return filtered sale data as new saleList element
    const dateFilterCheck = useCallback(()=>{
        
        if(filterSale.month!==""){
            if(filterSale.year!==""){
                const filteredSaleList = allSalesList.filter(sale=>{             
                    return (sale.sale_date.substring(0,sale.sale_date.indexOf('/'))===filterSale.month&&
                    sale.sale_date.substring(sale.sale_date.lastIndexOf('/')+1)===filterSale.year)                      
                });
                setFilterSaleList(filteredSaleList);
            }
        }
        else{
            setFilterSaleList(salesList);
        }
        
    },[filterSale,allSalesList,salesList]); 


    //check proper date filter and update content if there is one
    useEffect(()=>{dateFilterCheck()},[dateFilterCheck]);

    //delete sale handler function to be passed to SalesList then SaleDeleteModal
    const deleteSaleHandler = async(id,amount)=>{
        //delete item from backend using id
        setAmount(amount);
        const token = localStorage.getItem('token')
        const responseObj = await deleteSales({id:id},token);
        //update home state if sale date is today
        const currentSale = allSalesList.find(sale=>sale.id===id);
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

    const clearFilterHandler = ()=>{
        setFilterSale({month:'',year:''});
    }

    //generate salesList element
    const salesListElement = filterSaleList.map(sale=>{
        return(
            <SalesList key={sale.id} sale={sale} deleteSale={deleteSaleHandler}/>
        )
    });

    const saleDateList = getYears(allSalesList);

    const yearOptionElement = saleDateList.map(saleYear=>{
        return(
            <option key={saleYear} value={saleYear}>{saleYear}</option>
        )
    })
    
    return(
        <Fragment>
            <section className="sort">
                <select 
                    value={filterSale.month} 
                    onChange={monthChangeHandler}
                    className="form-select-sm" 
                >   <option value="">Month</option>
                    <option value="1">Jan</option>
                    <option value="2">Feb</option>
                    <option value="3">Mar</option>
                    <option value="4">Apr</option>
                    <option value="5">May</option>
                    <option value="6">Jun</option>
                    <option value="7">Jul</option>
                    <option value="8">Aug</option>
                    <option value="9">Sep</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                </select>
                <select 
                    value={filterSale.year} 
                    onChange={yearChangeHandler}
                    className="form-select-sm" 
                >
                    <option value="">Year</option>
                    {yearOptionElement}
                </select>
                <Button variant="success" onClick={clearFilterHandler}>Clear</Button>
            </section>
            {filterSale.month===""&&filterSale.year===""&&
                 <section className='page'>
                    <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Sales"/>
                </section>
            }
            <section className='items'>
                {salesListElement}
            </section>
            {filterSale.month===""&&filterSale.year===""&&
                 <section className='page'>
                    <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Sales"/>
                </section>
            }
            <section>
                <SaleDeleteNotif show={show} handleClose={handleClose} amount={amount}/>
            </section>
        </Fragment>  
    )
}

export default Sales;