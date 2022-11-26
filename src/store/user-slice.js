import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
    token:''
}

const userSlice = createSlice({
    name:'user',
    initialState: initialUserState,
    reducers:{
        //add token on state
        saveToken(state,action){
            state.token = action.payload.token;
            return state;
        },
        //remove token on state
        removeToken(state,action){
            state.token = ''
            return state;
       
        }
    }
});

export const userActions = userSlice.actions;//exporting list of actions on reducer created on slice
export default userSlice.reducer;