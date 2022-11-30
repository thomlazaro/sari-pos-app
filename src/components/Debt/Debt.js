import './Debt.css'
import { Fragment, useState, useCallback,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DebtList from './DebtList';
import { debtActions } from '../../store/debt-slice';
import { salesActions } from '../../store/sales-slice';
import { homeActions } from '../../store/home-slice';
import { deleteSales,paidDebt } from '../../lib/sari-api';
import DebtDeleteNotif from './DebtDeleteNotif';
import PageUI from '../UI/PageUI';
import { getYears } from '../Sales/Sales';
import { Button } from 'react-bootstrap';
//import { paidDebt } from '../../lib/dummy-api'

const Debt = ()=> {
    const dispatch = useDispatch();
    const debtList = useSelector(state=>state.debt.debtPage);
    const allDebtList = useSelector(state=>state.debt.debts);
    const currentPage = useSelector(state=>state.debt.currentPage);
    const pageCount = useSelector(state=>state.debt.debtsPageCount);

    const [filterDebt,setFilterDebt] = useState({month:'',year:''});
    const [filterDebtList, setFilterDebtList] = useState(debtList);

    //set Delete Notification modal state
    const [debtDetails,setDebtDetails] = useState({name:"",amount:0});
    const [debtNotification,setDebtNotification] = useState({header:"",message:""});
    const [show,setShow] = useState(false);
    const handleShow = (header,message)=>{
        setDebtNotification({header:header,message:message});
        setShow(true);
    }
    const handleClose = ()=>{
        setShow(false);
    }

    const yearChangeHandler = (event)=>{
        //console.log(event.target.value);
        setFilterDebt(prevValue=>{
            return {...prevValue,year:event.target.value}
        });
    };

    const monthChangeHandler = (event)=>{
        //console.log(event.target.value);
        setFilterDebt(prevValue=>{
            return {...prevValue,month:event.target.value}
        });
    };

    //delete sale handler function to be passed to SalesList then SaleDeleteModal
    const deleteDebtHandler = async(id,amount,name)=>{
        //delete debt from backend using id
        setDebtDetails({name:name,amount:amount});
        const token = localStorage.getItem('token');
        const saleData = await deleteSales({id:id},token);
        //subtract debt values from home state
        const deleteDebt = debtList.find(debt=>debt.id===id);
        dispatch(homeActions.subtractTotalDebt({
            ...deleteDebt
        }));

        //delete item by id
        dispatch(debtActions.removeDebt(
            { id:id }
        ));

        dispatch(debtActions.updatePage({
            currentPage:1,debtsPageCount:saleData.debt_page_count
        }));

        dispatch(debtActions.replacePageDebts({
            currentPage:1
        }));
        //clear search filter state
        //setSearchItem('');
        //filterChangeHandler();   
        handleShow("Delete Debt Notification",
        `Debt of ${name} with amount of P${amount} deleted!`);//show delete sale notification
        //handleShowModal(`Delete Notification`,`${name} Deleted!`);
            
    }

    const paidDebtHandler =async(debtObject)=>{
        //console.log(id);
        //console.log(debtObject);
        //create new sales object
        const paidObject = {
            ...debtObject,
            debt:false
        }

        //update sales detail to backend
        const token = localStorage.getItem('token');
        const saleData = await paidDebt(paidObject,token);

        //subtract debt values from home state
        //const deleteDebt = debtList.find(debt=>debt.id===id);
        dispatch(homeActions.subtractTotalDebt({
            ...paidObject
        }));

        //update today & overall home state
        dispatch(homeActions.addTodayTotalSales({
            ...paidObject
        }));
        
        //remove paid debt from debt state
        dispatch(debtActions.removeDebt(
            { id:paidObject.id }
        ));

        dispatch(debtActions.updatePage({
            currentPage:1,debtsPageCount:saleData.debt_page_count
        }));

        dispatch(debtActions.replacePageDebts({
            currentPage:1
        }));

        //add paid debt to sales state
        dispatch(salesActions.addSale(
           {...paidObject}
        ));

        dispatch(salesActions.updatePage({
            currentPage:1,salesPageCount:saleData.sale_page_count
        }));

        dispatch(salesActions.replacePageSales({
            currentPage:1
        }));

        handleShow("Paid Debt Notification",
        `Debt of ${paidObject.debtors_name} with amount of P${paidObject.total_selling_price} is now marked as paid!`);//show delete sale notification
    };

    //check date filter and return filtered debt data as new debtList element
    const dateFilterCheck = useCallback(()=>{
        
        if(filterDebt.month!==""){
            if(filterDebt.year!==""){
                const filteredDebtList = allDebtList.filter(debt=>{             
                    return (debt.sale_date.substring(0,debt.sale_date.indexOf('/'))===filterDebt.month&&
                    debt.sale_date.substring(debt.sale_date.lastIndexOf('/')+1)===filterDebt.year)                      
                });
                setFilterDebtList(filteredDebtList);
            }
        }
        else{
            setFilterDebtList(debtList);
        }
        
    },[filterDebt,allDebtList,debtList]); 


    //check proper date filter and update content if there is one
    useEffect(()=>{dateFilterCheck()},[dateFilterCheck]);

    const debtDateList = getYears(allDebtList);

    const yearOptionElement = debtDateList.map(debtYear=>{
        return(
            <option key={debtYear} value={debtYear}>{debtYear}</option>
        )
    });

    const clearFilterHandler = ()=>{
        setFilterDebt({month:'',year:''});
    }

    //generate salesList element
    const debtListElement = filterDebtList.map(debt=>{
        return(
            <DebtList 
                key={debt.id} 
                debt={debt} 
                deleteDebt={deleteDebtHandler} 
                paidDebtHandler={paidDebtHandler}
                />
        )
    });

    return(
        <Fragment>
            <section className="sort">
                <select 
                    value={filterDebt.month} 
                    onChange={monthChangeHandler}
                    className="form-select-sm" 
                >
                    <option value="">Month</option>
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
                    value={filterDebt.year} 
                    onChange={yearChangeHandler}
                    className="form-select-sm" 
                >
                    <option value="">Year</option>
                    {yearOptionElement}
                </select>
                <Button variant="success" onClick={clearFilterHandler}>Clear</Button>
            </section>
            {filterDebt.month===""&&filterDebt.year===""&&
                 <section className='page'>
                     <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Debts"/>
                </section>
            }          
            <section className='items'>
                {debtListElement}
            </section>
            {filterDebt.month===""&&filterDebt.year===""&&
                 <section className='page'>
                     <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Debts"/>
                </section>
            }    
            <section>
                <DebtDeleteNotif 
                    show={show} 
                    debtNotification={debtNotification} 
                    handleClose={handleClose} 
                    amount={debtDetails.amount} 
                    name={debtDetails.name}
                />
            </section>
        </Fragment>  
    )
}

export default Debt;