
import {  Skeleton} from 'antd';
import React, { useState , useEffect } from 'react';
function TestSkeleton(props) {
    const [timer,SetTime] = useState(true);
        useEffect(()=>{
                setTimeout(() => {
                    SetTime(false);
                }, 1000);
        },[])

    return (
        <div>
            {timer === true ?   <Skeleton active /> : <h1>HI</h1> } 

        </div>
    );
}

export default TestSkeleton;