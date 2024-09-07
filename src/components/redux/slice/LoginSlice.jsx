import { createSlice } from '@reduxjs/toolkit';

const  initialState = {
    token: "",
    userid: 0,
    userInfo: {},
    messageIsAdmin :""
  }

export const LoginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        saveUserInfo(state, action) {
            state.token = action.payload.token;
            state.userid = action.payload.data.userid;
            state.userInfo = action.payload.data;
        },
        logout() {
            return initialState;
        },
        setMess(state, action) {
            console.log(action.payload);
            state.messageIsAdmin = action.payload;
        }
    }

});


export const {saveUserInfo , logout ,setMess} = LoginSlice.actions;
export default LoginSlice.reducer;