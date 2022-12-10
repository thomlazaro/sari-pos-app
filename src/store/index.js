import { configureStore } from '@reduxjs/toolkit'

import itemsSlice from './items-slice';
import cartSlice from './cart-slice';
import salesSlice from './sales-slice';
import debtSlice from './debt-slice';
import userSlice from './user-slice';
import homeSlice from './home-slice';
import orderSlice from './order-slice';

const store = configureStore({
    reducer:{
        items:itemsSlice,
        cart:cartSlice,
        sales:salesSlice,
        debt:debtSlice,
        user:userSlice,
        home:homeSlice,
        order:orderSlice
    }
})

export default store;


