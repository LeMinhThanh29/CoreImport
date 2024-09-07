import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listCompany : [],

  };

  export const CompanySlice = createSlice({
    name : "company",
    initialState,
    reducers : {
        loadingCompany(state, action) {
            state.listCompany = action.payload;
        },
      
    }
  });
  export const {loadingCompany} = CompanySlice.actions;
  export default CompanySlice.reducer;