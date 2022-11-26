import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
    items:[],
    total_item_count:0,
    total_selling_price:0,
    total_price:0,
    sale_date:new Date().toLocaleDateString(),
    debt:false,
    debtors_name:""
}


const cartSlice = createSlice({
    name:'cart',
    initialState: initialCartState,
    reducers:{
        //add item to state
        addItemtoCart(state,action){
            //update items
            const existingItem = state.items.find(item=>item.id===action.payload.id);//when assigned, the const variable becomes a pointer to the state
            //if item does not exist, push to cart
            if(!existingItem){
                state.items.unshift(action.payload);
            }
            else{//otherwise update buy_count with new buy_count by adding the payload
                existingItem.buy_count =  existingItem.buy_count+action.payload.buy_count;
            }                     
            //update total_count
            state.total_item_count = state.total_item_count + action.payload.buy_count;
            //update total_selling_price
            state.total_selling_price = state.total_selling_price + (action.payload.selling_price*action.payload.buy_count);
            //update total_price
            state.total_price = state.total_price + (action.payload.price*action.payload.buy_count);        
        },
        //add one item to cart
        addOneItemtoCart(state,action){
            const existingItem = state.items.find(item=>item.id===action.payload.id);
            existingItem.buy_count =  existingItem.buy_count+1;
            //update total_count
            state.total_item_count = state.total_item_count + 1;
            //update total_selling_price
            state.total_selling_price = state.total_selling_price + existingItem.selling_price;
            //update total_price
            state.total_price = state.total_price + existingItem.price;
        },
        //remove one item to cart
        removeOneItemtoCart(state,action){
            const existingItem = state.items.find(item=>item.id===action.payload.id);
            //if there is only 1 quantity, remove the item entirely
            if(existingItem.buy_count===1){
                state.items = state.items.filter(item=>item.id!==action.payload.id);
            }
            else{
                existingItem.buy_count =  existingItem.buy_count-1;
            }
            
            //update total_count
            state.total_item_count = state.total_item_count - 1;
            //update total_selling_price
            state.total_selling_price = state.total_selling_price - existingItem.selling_price;
            //update total_price
            state.total_price = state.total_price - existingItem.price;
        },
        //remove all buy count of one item to cart
        removeAllItemtoCart(state,action){
            const existingItem = state.items.find(item=>item.id===action.payload.id);
            state.items = state.items.filter(item=>item.id!==action.payload.id);
            //update total_count
            state.total_item_count = state.total_item_count - existingItem.buy_count;
            //update total_selling_price
            state.total_selling_price = state.total_selling_price - (existingItem.buy_count*existingItem.selling_price);
            //update total_price
            state.total_price = state.total_price - (existingItem.buy_count*existingItem.price);        
        },
        //reset cart
        resetCart(state,action){
            return initialCartState;
        }
    }
});

export const cartActions = cartSlice.actions;//exporting list of actions on reducer created on slice
export default cartSlice.reducer;