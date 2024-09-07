import React from 'react';
//Outlet giống như 1 component children
import {Outlet , Navigate ,useLocation } from 'react-router-dom'


function PrivateRouter() {
    const location = useLocation();
    const auth = localStorage.getItem("userToken")
    console.log(auth);
    
    /// oulet là trang con kiểu mới
    return (
        auth ? <Outlet/> : <Navigate to ="/" replace state ={{from :location}} />
    );
}

export default PrivateRouter;