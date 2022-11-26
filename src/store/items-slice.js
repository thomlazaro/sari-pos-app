import { createSlice } from "@reduxjs/toolkit";

const initialItemState = {
    items:[],
    pageItems:[],
    pages:0,
    currentPage:0
}


const itemsSlice = createSlice({
    name:'items',
    initialState: initialItemState,
    reducers:{
        //add item to state
        addtoItem(state,action){
            state.items.unshift(action.payload);
            state.pageItems.unshift(action.payload);         
        },
        //update item
        updateItem(state,action){
            const existingItem = state.items.find(item=>item.id===action.payload.id);
            //console.log(existingItem);
            existingItem.name = action.payload.name;
            existingItem.type = action.payload.type;
            existingItem.count = action.payload.count;
            existingItem.selling_price = action.payload.selling_price;
            existingItem.price = action.payload.price;
            existingItem.date_added = action.payload.date_added;
            existingItem.date_edit = action.payload.date_edit;
            //existingItem.total = existingItem.price * existingItem.quantity  
        },
        //update item count only
        updateItemCount(state,action){
            const existingItem = state.items.find(item=>item.id===action.payload.id);
            //console.log(existingItem);
            existingItem.count = action.payload.count;
            //existingItem.total = existingItem.price * existingItem.quantity  
        },
        //delete item
        removeItem(state,action){
            
            state.items = state.items.filter(item=>item.id!==action.payload.id);
       
        },
        updatePage(state,action){
            state.currentPage = action.payload.currentPage;
            state.pages = action.payload.item_page_count;
        },     
        //update items state from back-end on initial load
        replacePageItems(state,action){
            const limitStart = (Math.ceil(action.payload.currentPage-1))*10
            const pageArray = state.items.slice(limitStart,limitStart+10)
            //console.log(action.payload)
            state.pageItems = pageArray;
            state.currentPage = action.payload.currentPage;
            //return action.payload;
        },
        //update items state from back-end on initial load
        replaceItems(state,action){
            //console.log(action.payload)
            return action.payload;
        }
    }
});

export const itemsActions = itemsSlice.actions;//exporting list of actions on reducer created on slice
export default itemsSlice.reducer;