import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    program_code : "",
    listUser : [],
    listUserChoose :  [],
    userInfo : [],
    userids : [],
  };

  export const AuthoritySlice = createSlice({
    name : "company",
    initialState,
    reducers : {
        getUserAuthor(state, action) {
          state.program_code = action.payload.program_code;
            state.listUser = action.payload.data;
        },
        getUserCompany(state, action) {
          state.listUserChoose = action.payload
        },
        saveUser(state, action) {
            state.userInfo= action.payload;
        },
        addAuthUser(state, action) {
            state.listUser = [...state.listUser,action.payload];
        },
        removePermission(state, action) {
          const currentId = action.payload;
          console.log(currentId)
          state.listUser = state.listUser.filter((user) => user.id !== currentId);
        }

       
    }
  });
  export const {getUserAuthor,getUserCompany,saveUser,addAuthUser,delPermission , removePermission} = AuthoritySlice.actions;
  export default AuthoritySlice.reducer;