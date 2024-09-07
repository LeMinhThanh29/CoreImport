import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listdepartment : []
  };

  export const Department = createSlice({
    name : "department",
    initialState,
    reducers : {
        loadingDepartment(state, action) {
            state.listdepartment = action.payload;
        }
    }
  });
  export const {loadingDepartment} = Department.actions;
  export default Department.reducer;