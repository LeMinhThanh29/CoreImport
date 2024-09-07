import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listConfig: [],

};

export const ConfigSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    getAllConfigOfProgram(state, action) {
      state.listConfig = action.payload;
    },
    updateDragAndDrop (state, action) {
        console.log(action.payload)
        state.listConfig.columns = action.payload;
    },
    insertConfig (state, action) {
    
      state.listConfig = [...state.listConfig, action.payload];
    }
    
  },
});
export const { getAllConfigOfProgram , updateDragAndDrop, insertConfig } = ConfigSlice.actions;
export default ConfigSlice.reducer;
