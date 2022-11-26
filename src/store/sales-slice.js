import { createSlice } from "@reduxjs/toolkit";

const initialSalesState = {sales:[],salePage:[],currentPage:0,salesPageCount:0}


const salesSlice = createSlice({
    name:'sales',
    initialState: initialSalesState,
    reducers:{
        //add sale on state
        addSale(state,action){
            state.sales.unshift(action.payload);
        },
        //delete sale
        removeSale(state,action){
            
            state.sales = state.sales.filter(sale=>sale.id!==action.payload.id);
       
        },
        replacePageSales(state,action){
            const limitStart = (Math.ceil(action.payload.currentPage-1))*10
            const pageArray = state.sales.slice(limitStart,limitStart+10)
            //console.log(action.payload)
            state.salePage = pageArray;
            state.currentPage = action.payload.currentPage;
            //return action.payload;
        },
        updatePage(state,action){
            state.currentPage = action.payload.currentPage;
            state.salesPageCount = action.payload.salesPageCount;
        },
        //update sales state from back-end on initial load
        replaceSales(state,action){
            //console.log(action.payload)
            return action.payload;
        }
    }
});

export const salesActions = salesSlice.actions;//exporting list of actions on reducer created on slice
export default salesSlice.reducer;