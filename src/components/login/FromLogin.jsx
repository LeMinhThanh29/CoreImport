import { Button, Form, message, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveUserInfo } from "../redux/slice/LoginSlice";
import { api } from "../api/index";
import axios from "axios";
function FromLogin(props) {
  const { id, loginApi } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messager = useSelector((state) => state.login.messageIsAdmin);

  if (messager !== "") {
    message.error(messager);
  }

  const onFinish = async (values) => {
    const result = await axios.post(api + loginApi, values).catch((error) => {
      console.error(error);
      message.error("Đăng Nhập Thất Bại");
    });
    // let { data } = result.data;
    // const token = data.token;
    // const userInfo = { ...result.data, token: token };
    // console.log(userInfo);
    // dispatch(saveUserInfo(userInfo));
    localStorage.setItem(
      "userToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmFtZSAzOSIsImF2YXRhciI6ImF2YXRhciAzOSIsInBhc3N3b3JkIjoicGFzc3dvcmQgMzkiLCJ1cGRhdGVBdCI6MTcyNTY4ODk4NywiY3JlYXRlZEF0IjoxNzI1Njg4OTg3LCJzdGF0dXMiOmZhbHNlLCJtYWxlIjpmYWxzZSwiZW1haWwiOiJlbWFpbCAzOSIsInVzZXJuYW1lIjoidXNlcm5hbWUgMzkiLCJ0b2tlbiI6InRva2VuIDM5IiwiaWQiOiIzOSJ9.If6kGRm2-hsIuowxlDA4o3nUqYEBX5VTcBZpT7_Ag9Q"
    );
    localStorage.setItem("userInfo", {
      name: "name 39",
      avatar: "avatar 39",
      password: "password 39",
      updateAt: 1725688987,
      createdAt: 1725688987,
      status: false,
      male: false,
      email: "email 39",
      username: "username 39",
      token: "token 39",
      id: "39",
    });
    navigate("/home");
    message.success("Đăng Nhập Thành Công 💚");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input placeholder="Tên Đăng Nhập" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password placeholder="Mật Khẩu" />
      </Form.Item>

      <Form.Item>
        {id === 1 ? (
          <Button
            type="primary"
            danger
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Submit Người Dùng Nội Bộ
          </Button>
        ) : (
          <Button
            type="primary"
            danger
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Submit Người Dùng Ngoài
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}

export default FromLogin;
