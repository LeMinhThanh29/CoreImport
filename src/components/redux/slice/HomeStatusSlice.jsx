import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    listStatusFileImport :[]
}

export const HomeStatusSlice = createSlice({
    name: 'home',
    initialState,
    reducers : {
        getAllStatusFileimport (state, action) {
            state.listStatusFileImport = action.payload;
        }
    }

});
export const {getAllStatusFileimport} = HomeStatusSlice.actions
export default HomeStatusSlice.reducer