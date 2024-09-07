import { useContext } from "react";
import Header from "../Header/Header";
import SideBar from "../SideBar/SlideBar";
import styles from "../DefaultLayout/Global.module.scss";
import classNames from "classnames/bind";
import { ThemeContext } from "../../Context/GlobalContext";
import { Outlet } from "react-router-dom";
const cx = classNames.bind(styles);

function Index() {
  const { toggle, toggleTheme } = useContext(ThemeContext);
  return (
    <>
      <SideBar />
      <div
        className={
          toggle == false ? `${styles.home}` : `${styles.home} ${styles.mini}`
        }
      >
        <div className={cx("global_header")}>
          <Header />
        </div>
        <div className={cx("global_home")}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Index;
