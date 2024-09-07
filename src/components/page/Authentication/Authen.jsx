import { useEffect, useState } from "react";
import styles from "../Authentication/authen.module.scss";
import classNames from "classnames/bind";
import { Input, Select, Button, Modal, message, Table, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getUserCompany,
  saveUser,
  addAuthUser,
  getUserAuthor,
  removePermission,
} from "../../redux/slice/AuthoritySlice";
import { api } from "../../api/index";
import Moment from "react-moment";

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
const cx = classNames.bind(styles);
function Authen(props) {
  const { Option } = Select;
  const { confirm } = Modal;
  const [dep, setDepartment] = useState(false);
  const [cty, setCty] = useState("");

  const dispatch = useDispatch();

  const UserCompany = useSelector((state) => state.author.listUserChoose);
  const userFilter = useSelector((state) => state.author.listUser);
  const userListAuth = useSelector((state) => state.author.userInfo);

  const filterCompany = async (value) => {
    const resutls = await axios
      .get(api + `/users?company_code=${value}`)
      .then((resp) => {
        dispatch(getUserCompany(resp.data.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterCompanyAndDep = async (value) => {
    const resutls = await axios
      .get(api + `/users?company_code=${cty}&msphongban=${value}`)
      .then((resp) => {
        dispatch(getUserCompany(resp.data.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (value) => {
    if (value === "CONG-TY-9") {
      setDepartment(true);
    } else {
      setDepartment(false);
    }
    setCty(value);

    filterCompany(value);
  };

  const handleChangeDepartments = (value) => {
    filterCompanyAndDep(value);
  };

  const handleChangeUser = (value) => {
    console.log(`selected ${value}`);
  };

  const author = useSelector((state) => state.author);
  const company = useSelector((state) => state.company.listCompany);
  const department = useSelector((state) => state.department.listdepartment);

  const [loading, setLoading] = useState(false);

  const getAllUser = async () => {
    setLoading(true);
    const user = await axios
      .get(api + "/users")
      .then((resp) => {
        setLoading(false);
        dispatch(saveUser(resp.data.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { open } = props;

  useEffect(() => {
    getAllUser();
  }, []);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Mã Nhân Viên",
      render: (_, record) => (
        <p>
          {userListAuth
            .filter((list) => list.userid.includes(record.userid))
            .map((i, index) => {
              return i.username;
            })}
        </p>
      ),
      key: "userid",
    },
    {
      title: "Họ Tên",
      render: (_, record) => (
        <p>
          {userListAuth
            .filter((list) => list.userid.includes(record.userid))
            .map((i, index) => {
              return i.hoten;
            })}
        </p>
      ),
    },
    {
      title: "Ngày Cấp",
      render: (_, record) => (
        <p>
          <Moment format="YYYY/MM/DD hh:mm:ss">{record.created_at}</Moment>
        </p>
      ),
    },
    {
      title: "Tên Người Cấp",
      render: (_, record) => (
        <p>
          {userListAuth
            .filter((list) => list.userid.includes(record.user_create))
            .map((i, index) => {
              return i.hoten;
            })}
        </p>
      ),
    },
    {
      title: "Tùy Chọn",
      render: (_, record) => (
        <Button onClick={showDeleteConfirm(record.id)} type="primary" danger>
          Thu Hồi Quyền
        </Button>
      ),
    },
  ];

  const loadingAFTER = () => {
    const getUserForAuth = async () => {
      const result = await axios
        .get(api + `/permission?program_code=${author.program_code}`)
        .catch((error) => {
          console.log(error);
        });
      const program_code = author.program_code;
      const payload = { ...result.data, program_code };

      dispatch(getUserAuthor(payload));
    };
    getUserForAuth();
  };

  const showDeleteConfirm = (id) => () => {
    confirm({
      title: `Bạn Có Muốn Thu Hồi Quyền Của 
        ${userListAuth
          .filter((list) => list.userid.includes(id))
          .map((i) => {
            return i.hoten;
          })}?`,
      icon: <ExclamationCircleOutlined />,
      content: "Thu Hồi Quyền",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",

      onOk() {
        console.log(id);
        const deletepermission = async () => {
          const result = await axios
            .delete(api + `/permission?id=${id}`)
            .then((response) => {
              dispatch(removePermission(id));
            })
            .catch((error) => {
              console.error(error);
            });
        };
        form.resetFields();
        deletepermission();
      },

      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onReset = () => {
    form.resetFields();
    setLoading(false);
    console.log("Reset");
  };

  const onFinish = (values) => {
    const newPromise = {
      program_code: author.program_code,
      userids: [values.staff],
    };

    const promise = async () => {
      const result = await axios
        .post(api + "/permission/add", newPromise)
        .then((resp) => {
          dispatch(addAuthUser(resp.data));
          loadingAFTER();
          form.resetFields();
        })
        .catch((err) => {
          console.error(err);
        });
    };
    promise();
  };
  const options = [];
  const options_user = [];
  const options_cty = [];


  department.map((i, index) => {
    options.push({
      value: i.msphongban,
      label: i.tenphongban,
    });
  })

  UserCompany.map((i, index) => {
    options_user.push({
      value: i.userid,
      label: i.username,
    });
   
  })

  company.map((i, index) => {
    options_cty.push({
      value: i.company_code,
      label: i.company_name,
    });
  
  })
  return (
    <div className={cx("authen_controller")}>
      <div className="col-12 grid-margin">
        <Form form={form} className="form-sample" onFinish={onFinish}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Chọn Công Ty</label>
                <div className="col-sm-8">
                  <Form.Item
                    name="company"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                     
                      defaultValue="Chọn Công Ty"
                      className={cx("select_authen")}
                      showSearch
                   
                      style={{
                        width: "100%",
                      }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "").includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={options_cty}
                      onChange={handleChange}
                    >
                    
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </div>
            {dep === true ? (
              <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">
                    Chọn Phòng Ban
                  </label>
                  <div className="col-sm-8">
                    <Form.Item
                      name="department"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                     
                      <Select
                        showSearch
                        defaultValue="Chọn Phòng Ban"
                        className={cx("select_authen")}
                        onChange={handleChangeDepartments}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={options}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            ) : (
              "Chưa Có Phòng Ban"
            )}
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">
                  Chọn Nhân Viên
                </label>
                <div className="col-sm-8">
                  <Form.Item
                    name="staff"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      defaultValue="Chọn Nhân Viên"
                      className={cx("select_authen")}
                      onChange={handleChangeUser}
                       optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={options_user}
                    >
                      {/* {UserCompany.map((i, index) => {
                        return (
                          <Option key={index} value={i.userid}>
                            {i.username}
                          </Option>
                        );
                      })} */}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Chức Năng</label>
                <div className="col-sm-8">
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={cx("success")}
                  >
                    Cấp Quyền
                  </Button>
                  <Button htmlType="button" onClick={onReset}>
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Form>
        <div className={cx("table_authen")}>
          <Table
            columns={columns}
            dataSource={author.listUser}
            rowKey="userid"
            loading={loading}
            pagination={{
              pageSize: 50,
            }}
            scroll={{
              y: 240,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Authen;
