import './Debt.css'
import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DebtList from './DebtList';
import { debtActions } from '../../store/debt-slice';
import { salesActions } from '../../store/sales-slice';
import { homeActions } from '../../store/home-slice';
import { deleteSales,paidDebt } from '../../lib/sari-api';
import DebtDeleteNotif from './DebtDeleteNotif';
import PageUI from '../UI/PageUI';
//import { paidDebt } from '../../lib/dummy-api'

const Debt = ()=> {
    const dispatch = useDispatch();
    const debtList = useSelector(state=>state.debt.debtPage);
    const currentPage = useSelector(state=>state.debt.currentPage);
    const pageCount = useSelector(state=>state.debt.debtsPageCount);

    const [filterDebt,setFilterDebt] = useState({month:'Jan',year:'2022'});

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

        //update today home state if debt sale_date is today
        const dateToday = new Date().toLocaleDateString();
        if(dateToday===paidObject.sale_date){
            dispatch(homeActions.addTodayTotalSales({
                ...paidObject
            }));
        }

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
    }

    //generate salesList element
    const debtListElement = debtList.map(debt=>{
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
                <label>{filterDebt.month} {filterDebt.year}</label>
                <select 
                    value={filterDebt.month} 
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
                    value={filterDebt.year} 
                    onChange={yearChangeHandler}
                    className="form-select-sm" 
                >
                    <option>2022</option>
                    <option>2021</option>
                </select>
            </section>
            <section className='page'>
                <PageUI currentPage={currentPage} pageCount={pageCount} actionFor="Debts"/>
            </section>
            <section className='items'>
                {debtListElement}
            </section>
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