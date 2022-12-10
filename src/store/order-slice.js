import { createSlice } from "@reduxjs/toolkit";

const initialOrderState = {orders:[],ordersPage:[],currentPage:0,orderPageCount:0}


const ordersSlice = createSlice({
    name:'orders',
    initialState: initialOrderState,
    reducers:{
        //add order on state
        addOrder(state,action){
            state.orders.unshift(action.payload);
        },
        //delete order
        removeOrder(state,action){
            
            state.orders = state.orders.filter(order=>order.id!==action.payload.id);
       
        },
        replacePageOrders(state,action){
            const limitStart = (Math.ceil(action.payload.currentPage-1))*12
            const pageArray = state.orders.slice(limitStart,limitStart+12)
            //console.log(action.payload)
            state.orderPage = pageArray;
            state.currentPage = action.payload.currentPage;
            //return action.payload;
        },
        updatePage(state,action){
            state.currentPage = action.payload.currentPage;
            state.OrdersPageCount = action.payload.ordersPageCount;
        },
        //update orders state from back-end on initial load
        replaceOrders(state,action){
            //console.log(action.payload)
            return action.payload;
        }
    }
});

export const ordersActions = ordersSlice.actions;//exporting list of actions on reducer created on slice
export default ordersSlice.reducer;