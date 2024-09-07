import React from 'react';
import classNames from "classnames/bind";
import styles from '../MenuComponent/Menu.module.scss'
const cx = classNames.bind(styles);
function Menu(props) {
    const {title,icon} = props;
     
    return (
        <>
          <div className={cx("menu_main")}>
                <p className={cx("title_main")}>{title} |
                    <i className={icon} id={cx("icon")}></i>
                </p>
            </div>   
        </>
    );
}

export default Menu;