import Login from "./components/login/Login";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefauleLayout from "./components/Layout/DefaultLayout/index";
import "../src/App.css";
import Home from "./components/page/Home/Home";
import Program from "./components/page/ProgramManager/Program";
import PrivateRouters from "./components/routes/PrivateRouter";
import User from "./components/page/UserManager/User";
import ImportFile from "./components/page/Import/ImportFile";
import Configuration from "./components/page/Configuration/ConfigImport";
import axios from "axios";
import AdminRouter from "./components/routes/AdminRouter";
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("userToken");
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
function App() {
  const onFileChange = (files) => {
    console.log(files);
  };

  return (
    <Router>
      <Routes>
        <Route element={<DefauleLayout />}>
          {/* <Route element={<PrivateRouters />}> */}
          <Route element={<Home />} path="/home" exact />
          {/* <Route element={<AdminRouter />}> */}
          <Route element={<Program />} path="/program" exact />
          <Route element={<User />} path="/user" exact />
          <Route element={<Configuration />} path="/program/config/:id" exact />
          {/* </Route> */}
          <Route
            element={
              <ImportFile onFileChange={(files) => onFileChange(files)} />
            }
            path="/import"
            exact
          />
        </Route>
        {/* </Route> */}
        <Route element={<Login />} path="/" />
      </Routes>
    </Router>
  );
}

export default App;
