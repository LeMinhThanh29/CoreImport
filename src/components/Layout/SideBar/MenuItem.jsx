import { useState, useContext, useEffect } from "react";
import styles from "../SideBar/SideBar.module.scss";
import classNames from "classnames/bind";
import { NavLink, Link } from "react-router-dom";
import { ThemeContext } from "../../Context/GlobalContext";
import PropTypes from "prop-types";
const cx = classNames.bind(styles);

function MenuItem({ title, icon, to }) {
  return (
    <li>
      <NavLink
        className={(nav) => cx("nav_link", { clickButton: nav.isActive })}
        to={to}
      >
        <i className={icon} id={cx("icon")}></i>
        <span className=" nav-text" id={cx("text")}>
          {title}
        </span>
      </NavLink>
    </li>
  );
}
MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};
export default MenuItem;
