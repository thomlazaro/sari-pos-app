import { createSlice } from "@reduxjs/toolkit";

const initialHomeState = {
    today_total_profit:0,
    today_total_selling_price:0,
    today_total_price:0,
    overall_total_profit:0,
    overall_total_selling_price:0,
    overall_total_price:0,
    total_profit:0,
    total_selling_price:0,
    total_price:0,
    total_debt_profit:0,
    total_debt_selling_price:0,
    total_debt_price:0
}

const homeSlice = createSlice({
    name:'home',
    initialState: initialHomeState,
    reducers:{
        subtractTotalSales(state,action){
            state.total_profit=state.total_profit-action.payload.profit;
            state.total_selling_price=state.total_selling_price-(action.payload.selling_price*action.payload.count);
            state.total_price=state.total_price-(action.payload.price*action.payload.count);
        },
        addTotalSales(state,action){
            state.total_profit=state.total_profit+action.payload.profit;
            state.total_selling_price=state.total_selling_price+(action.payload.selling_price*action.payload.count);
            state.total_price=state.total_price+(action.payload.price*action.payload.count);
        },
        updateTotalSales(state,action){

            //remove total with current values
            state.total_profit=state.total_profit-action.payload.current.profit;
            state.total_selling_price=state.total_selling_price-(action.payload.current.selling_price*action.payload.current.count);
            state.total_price=state.total_price-(action.payload.current.price*action.payload.current.count);

            //add back the updated
            state.total_profit=state.total_profit+action.payload.updated.profit;
            state.total_selling_price=state.total_selling_price+(action.payload.updated.selling_price*action.payload.updated.count);
            state.total_price=state.total_price+(action.payload.updated.price*action.payload.updated.count);
        },
        addTodayTotalSales(state,action){
            //update total possible values
            state.total_profit=state.total_profit-(action.payload.total_selling_price-action.payload.total_price);
            state.total_selling_price=state.total_selling_price-action.payload.total_selling_price;
            state.total_price=state.total_price-action.payload.total_price;
            //add todays values
            state.today_total_profit=state.today_total_profit+(action.payload.total_selling_price-action.payload.total_price);
            state.today_total_selling_price=state.today_total_selling_price+action.payload.total_selling_price;
            state.today_total_price=state.today_total_price+action.payload.total_price;
            //add overall values
            state.overall_total_profit=state.overall_total_profit+(action.payload.total_selling_price-action.payload.total_price);
            state.overall_total_selling_price=state.overall_total_selling_price+action.payload.total_selling_price;
            state.overall_total_price=state.overall_total_price+action.payload.total_price;
        },
        addTotalDebt(state,action){
            state.total_debt_profit = state.total_debt_profit+(action.payload.total_selling_price-action.payload.total_price);
            state.total_debt_selling_price = state.total_debt_selling_price+action.payload.total_selling_price;
            state.total_debt_price = state.total_debt_price+action.payload.total_price;
        },
        subtractTotalDebt(state,action){
            state.total_debt_profit = state.total_debt_profit-(action.payload.total_selling_price-action.payload.total_price);
            state.total_debt_selling_price = state.total_debt_selling_price-action.payload.total_selling_price;
            state.total_debt_price = state.total_debt_price-action.payload.total_price;
        },
        subtractTodayTotalSales(state,action){
            //subtract todays values
            const dateToday = new Date().toLocaleDateString();
            if(dateToday===action.payload.sale_date){
                state.today_total_profit=state.today_total_profit-(action.payload.total_selling_price-action.payload.total_price);
                state.today_total_selling_price=state.today_total_selling_price-action.payload.total_selling_price;
                state.today_total_price=state.today_total_price-action.payload.total_price;
            }

            state.overall_total_profit=state.overall_total_profit-(action.payload.total_selling_price-action.payload.total_price);
            state.overall_total_selling_price=state.overall_total_selling_price-action.payload.total_selling_price;
            state.overall_total_price=state.overall_total_price-action.payload.total_price;
        },
        replaceHome(state,action){
            //console.log(action.payload)
            return action.payload;
        }
    }
});

export const homeActions = homeSlice.actions;//exporting list of actions on reducer created on slice
export default homeSlice.reducer;