import { createSlice } from "@reduxjs/toolkit";

const initialDebtState = {debts:[],debtPage:[],currentPage:0,debtsPageCount:0}


const debtSlice = createSlice({
    name:'debts',
    initialState: initialDebtState,
    reducers:{
        //add debt on state
        addDebt(state,action){
            state.debts.unshift(action.payload);
            state.debtPage.unshift(action.payload);
        },
        //delete debt
        removeDebt(state,action){
            
            state.debts = state.debts.filter(debt=>debt.id!==action.payload.id);
            //return state;
       
        },
        replacePageDebts(state,action){
            const limitStart = (Math.ceil(action.payload.currentPage-1))*10
            const pageArray = state.debts.slice(limitStart,limitStart+10)
            //console.log(action.payload)
            state.debtPage = pageArray;
            state.currentPage = action.payload.currentPage;
            //return action.payload;
        },
        updatePage(state,action){
            state.currentPage = action.payload.currentPage;
            state.debtsPageCount = action.payload.debtsPageCount;
        },
        //update debt state from back-end on initial load
        replaceDebt(state,action){
            //console.log(action.payload)
            return action.payload;
        }
    }
});

export const debtActions = debtSlice.actions;//exporting list of actions on reducer created on slice
export default debtSlice.reducer;