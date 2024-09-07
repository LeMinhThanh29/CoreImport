import styles from "../SideBar/SideBar.module.scss";
import classNames from "classnames/bind";
import PropTypes from "prop-types";
const cx = classNames.bind(styles);
function MenuLink({ children }) {
  return <ul className={cx("menu-links")}>{children}</ul>;
}
MenuLink.propTypes = {
  children: PropTypes.node.isRequired,
};
export default MenuLink;
