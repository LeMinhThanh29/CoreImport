import React from 'react';
import {Outlet , Navigate ,useLocation } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {setMess} from '../redux/slice/LoginSlice'
import {message} from 'antd'
function AdminRouter(props) {
    const role = useSelector((state) => state.login.userInfo);
    
    const location = useLocation();
    const dispatch = useDispatch();
    return (
       role.isAdmin === 1 ? <Outlet/> : <Navigate replace  to ="/" 
       state ={
        dispatch(setMess("Bạn Vui Lòng Đăng Nhập Với Tài Khoản Nội Bộ Nhé! 🥰"))
       }/>
       
    );
}

export default AdminRouter;