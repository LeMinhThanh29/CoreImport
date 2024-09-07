import React from "react";
import styles from "../Header/Header.module.scss";
import classNames from "classnames/bind";
import Tippy from "@tippyjs/react/headless";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slice/LoginSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const cx = classNames.bind(styles);
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = localStorage.getItem("userInfo");
  const sigout = () => {
    dispatch(logout());
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const role = useSelector((state) => state.login.userInfo);

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("userLogin")}>
          <div className="row" id={cx("header")}>
            <div className="col-sm-10"></div>
            <Tippy
              interactive
              arrow={true}
              render={(attrs) => (
                <div className={cx("mainTooltip")} tabIndex="-1" {...attrs}>
                  <div className="text-center">
                    <a
                      href=""
                      onClick={() => {
                        sigout();
                      }}
                    >
                      {" "}
                      Đăng Xuất
                    </a>
                  </div>
                </div>
              )}
            >
              <div className="col-sm-2" id={cx("header_box")}>
                <div className={cx("boxHeader")}>
                  <span className={cx("header_wellcome")}>Xin chào,</span>
                  <span className={cx("header_info")}>{role.username}</span>
                </div>
              </div>
            </Tippy>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
