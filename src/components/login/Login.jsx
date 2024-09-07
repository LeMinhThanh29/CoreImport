import React from "react";
import "./Scss/Login.scss";
import image1 from "./img/Group-1.png";
import logoMobi from "./img/Mobifone_logo.svg.png";
import Footer from "./Footer/Footer";
import { Tabs } from "antd";
import FromLogin from "./FromLogin";
import { ldap, standard } from "../api/index";
function Login() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-4 col-md-3 col-lg-2 mx-auto">
            <img src={image1} className="image1" alt="" />
          </div>
          <div className="col-sm-6 col-md-5 col-lg-4 mx-auto" id="fromLogin">
            <div className="card border-0  rounded-3 my-5">
              <div className="card-body p-4 p-sm-5" id="fromLogin_main">
                <div className="text-center my-5">
                  <img src={logoMobi} alt="logo" className="logoMobi" />
                  <Tabs
                    centered
                    defaultActiveKey="1"
                    className=""
                    items={[
                      {
                        label: `Người Dùng Nội Bộ`,
                        key: "1",
                        children: <FromLogin id={1} loginApi={ldap} />,
                      },
                      {
                        label: `Người Dùng Ngoài`,
                        key: "2",
                        children: <FromLogin id={2} loginApi={standard} />,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-md-3 col-lg-2 mx-auto">
            <img src={image1} className="image2" alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
