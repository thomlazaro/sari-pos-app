import './App.css';
import Header from './components/Header/Headers';
import Home from './components/Home/Home';
import Inventory from './components/Inventory/Inventory';
import Cart from './components/Cart/Cart';
import Sales from './components/Sales/Sales';
import Login from './components/Login/Login';
import NotFound from './components/NotFound/NotFound';
import ItemModal from './components/Inventory/ItemModal';
import { Fragment, useEffect,useState } from 'react';
import { Route,Switch,useHistory,useLocation } from 'react-router-dom';
//real api
import { getAllItems,getAllSales,getHomeData } from './lib/sari-api';
import { useDispatch } from 'react-redux';
import { itemsActions } from './store/items-slice';
import { salesActions } from './store/sales-slice';
import { debtActions } from './store/debt-slice';
import { userActions } from './store/user-slice';
import { homeActions } from './store/home-slice';
import Debt from './components/Debt/Debt';

function App() {
  const dispatch = useDispatch();
  const [showModal,setShowModal] = useState({
    show:false,
    heading:"Connection to Server Error",
    message:"Could not connect to server at the moment. Please contact server host provider!"
  });
  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem('token');


  const handleClose=()=>{
    setShowModal(prevVal=>{
      return({...prevVal,show:false});
    });
  }

  const handleShow=()=>{
    setShowModal(prevVal=>{
      return({...prevVal,show:true});
    });
  }


  //get token when app initially loads
  useEffect(()=>{
        //get token on local storage if it exist
        const initialToken = localStorage.getItem('token');
        if(initialToken&&initialToken.trim().length!==0){
          dispatch(userActions.saveToken({
            token:initialToken
          }));
        }
        
        if(initialToken){
          if(location.pathname==='/'){
            history.replace('/home');
          }
          else{
            history.replace(location.pathname);
          } 
        }
        else{
          //redirect to login if there is no token
          history.replace('/');
        }
  },[dispatch,history,location.pathname])

  //get items from backend when app initially loads
  useEffect(()=>{
    //only do http call if token exist
    if(token){
      //getAllItems from sari-api and replace items on slice
      
      getAllItems(token,1).then(data=>{
        //console.log(data);
        dispatch(itemsActions.replaceItems(
          {
            items:[...data.items],
            pageItems:[...data.pageItems],
            pages:data.pages,
            currentPage:data.currentPage
          }
        ));
      }
      ).catch((err)=>{
        console.log(err);
        handleShow();
      });
  
      //getAllSales from sari-api and replace sales and debt on slice
      
      getAllSales(token).then(sales=>{
        dispatch(salesActions.replaceSales(
          {sales:[...sales.sales],salePage:[],currentPage:1,salesPageCount:sales.salesPageCount}
        ));
        dispatch(salesActions.replacePageSales({
          currentPage:1
        }));

        dispatch(debtActions.replaceDebt(
          {debts:[...sales.debt],debtPage:[],currentPage:1,debtsPageCount:sales.debtsPageCount}
          
        ));
        dispatch(debtActions.replacePageDebts({
          currentPage:1
        }));
      }
      ).catch((err)=>{
        console.log(err);
      });;

      //get Home data from backend
      getHomeData(token).then(result=>{
        dispatch(homeActions.replaceHome(
          result.data
        ))
      }).catch((err)=>{
        console.log(err);
        handleShow();
      });;

    }
    
  }
  ,[dispatch,token]);

  return (
    <Fragment>
      <Header />
      <Switch> 
        <Route path='/' exact>
          <Login />
        </Route>
        <Route path='/home'>
          <Home />
        </Route>
        <Route path='/inventory'>
          <Inventory />
        </Route>
        <Route path='/cart'>
          <Cart />
        </Route>
        <Route path='/sales'>
          <Sales />
        </Route>
        <Route path='/debt'>
          <Debt />
        </Route>
        <Route path='/*'>
          <NotFound />
        </Route>
      </Switch>
      <ItemModal show={showModal} handleClose={handleClose}/>
    </Fragment>
   
  );
}

export default App;
