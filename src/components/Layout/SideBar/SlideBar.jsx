import { useState, useContext, useEffect } from "react";
import styles from "../SideBar/SideBar.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../Context/GlobalContext";
import MenuLink from "../SideBar/MenuLink";
import MenuItem from "../SideBar/MenuItem";
const cx = classNames.bind(styles);

function SlideBar(props) {
  const { toggle, toggleTheme, setToggle } = useContext(ThemeContext);

  useEffect(() => {
    const handleScreen = () => {
      if (window.innerWidth == 800) {
        setToggle(true);
      } else if (window.innerWidth > 800) {
        setToggle(false);
      } else {
        setToggle(true);
      }
    };
    window.addEventListener("resize", handleScreen);
    return () => {
      window.removeEventListener("resize", handleScreen);
    };
  }, []);

  return (
    <>
      <nav
        className={
          toggle == false
            ? `${styles.sidebar}`
            : `${styles.sidebar} ${styles.close}`
        }
      >
        <header>
          <div className="text-center" id={cx("imageMobi")}>
            {toggle == false ? (
              <img
                src="https://media.loveitopcdn.com/3807/logo-mobifone-dongphucsongphu.png"
                className={cx("mobiLogo")}
                alt=""
              />
            ) : (
              <img
                src="https://play-lh.googleusercontent.com/rGSQFdxLz8-8lKQXZuzWDTs1fcA6QbnRXSik0cJFGP2chv9vV6nI-UPngsg-io9NIw"
                className={cx("mobiLogoMini")}
                alt=""
              />
            )}
          </div>
          <i
            className="bx bx-chevron-right"
            id={cx("toggle")}
            onClick={toggleTheme}
          ></i>
        </header>

        <div className={cx("menu-bar")}>
          <div className={cx("menu")}>
            <MenuLink>
              <MenuItem
                title={"Trang Chủ"}
                icon={"bx bx-home-alt"}
                to={"/home"}
              />
              <MenuItem
                title={"Quản Lý Người Dùng"}
                icon={"bx bx-bar-chart-alt-2"}
                to={"/user"}
              />
              <MenuItem
                title={"Quản lý chương trình "}
                icon={"bx bx-bell"}
                to={"/program"}
              />
              <MenuItem
                title={"Import File"}
                icon={"bx bx-pie-chart-alt "}
                to={"/import"}
              />
            </MenuLink>
          </div>
        </div>
      </nav>
    </>
  );
}

export default SlideBar;
