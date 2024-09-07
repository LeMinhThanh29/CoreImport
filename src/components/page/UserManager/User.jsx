import { useState, useContext, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../UserManager/User.module.scss";
import MenuComponent from "../MenuComponent/Menu";
import { Input, Select, Button, Form, Table } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import {
  loadAllUser,
  searchUser,
  findCompany,
  findDepartment,
  InsertUser,
  editUserClick,
  updateUser,
  deleteUser,
} from "../../redux/slice/UserManagerSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../api/index.js";
import { loadingCompany } from "../../redux/slice/CompanySlice";
import { loadingDepartment } from "../../redux/slice/Department";

const cx = classNames.bind(styles);
const { Option } = Select;
const { confirm } = Modal;
function User(props) {
  const [createHidden, setCreateHidden] = useState(false);

  const [updateButton, setUpdateButton] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const [status_cty, setStatus_cty] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status_search, setStatus_search] = useState(false);
  const [tblLoading, setTblLoading] = useState(false);

  const company_value = useSelector((state) => state.company.listCompany);
  const userinfo = useSelector((state) => state.user.userInfo);
  const listUserCty = useSelector((state) => state.user.listUserStaff);
  const listUserAffterSearch = useSelector((state) => state.user.filteredUsers);

  const key = "updatable";
  const openMessage = () => {
    message.loading({
      content: "Loading...",
      key,
    });
    setTimeout(() => {
      message.success({
        content: "Loaded!",
        key,
        duration: 2,
      });
    }, 180);
  };

  const department_value = useSelector(
    (state) => state.department.listdepartment
  );

  const handleOnChange = (e) => {
    if (e === "CONG-TY-9") {
      setStatus_cty(true);
      LoadingDepartment();
    } else {
      setStatus_cty(false);
    }
    setStatus_search(true);
    dispatch(findCompany(e));
  };

  const handleChangeDep = (e) => {
    dispatch(findDepartment(e));
    console.log(e);
  };

  const editUser = (id) => () => {
    openMessage();
    const editUserApi = async () => {
      const result = await axios
        .get(api + `/users/user?userid=${id}`)
        .then((response) => {
          dispatch(editUserClick(response.data.data));
          const newProgramInfo = response.data.data;
          if (response.data.data.congty_code === "CONG-TY-9") {
            setStatus_cty(true);
          } else {
            setStatus_cty(false);
          }
          form.setFieldsValue(newProgramInfo);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    editUserApi();
    console.log(userinfo);
    setCreateHidden(true);
    setUpdateButton(false);
  };

  const backClick = () => {
    setCreateHidden(false);
    setUpdateButton(true);
    form.resetFields();
  };

  const onFinish = (values) => {
    const insertUser = async () => {
      const result = await axios
        .post(api + "/users/add", values)
        .then((response) => {
          console.log(response.data);
          dispatch(InsertUser(response.data.data));
          console.log(response.data.data);
          message.success("Thêm Người Dùng Thành Công");
          loadingAlluser();
        })
        .catch((error) => {
          message.error(error.response.data.mess);
         
        });
    };
    form.resetFields();
    insertUser();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onReset = () => {
    setUpdateButton(true);
    form.resetFields();
  };

  const handleChange = (value) => {
    if (value === "CONG-TY-9") {
      setStatus_cty(true);
      LoadingDepartment();
    } else {
      setStatus_cty(false);
    }
  };
  const handleChangeDepartments = (value) => {
    console.log(`selected ${value}`);
  };
  const [form] = Form.useForm();

  // ===========================================================
  // >>>> CALL API <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // ===========================================================

  const loadingAlluser = async () => {
    setTblLoading(true);
    const result = await axios
      .get(api + "/users")
      .then((response) => {
        dispatch(loadAllUser(response.data.data));
        setTotalPages(listUserCty.length);
        setTblLoading(false);
      })
      .catch((error) => {
        message.error(error.response.data.mess);
      });
  };

  const LoadCty = () => {
    const loading = async () => {
      const result = await axios
        .get(api + "/company")
        .then((resp) => {
          dispatch(loadingCompany(resp.data.data));
        })
        .catch((err) => {
          message.error(err.response.data.mess);
        });
    };
    loading();
  };

  const LoadingDepartment = () => {
    const loading = async () => {
      const result = await axios
        .get(api + "/company/department")
        .then((resp) => {
          dispatch(loadingDepartment(resp.data.data));
        })
        .catch((err) => {
          message.error(err.response.data.mess);
        });
    };
    loading();
  };

  useEffect(() => {
    LoadCty();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loadingAlluser();
    }, 100);
  }, []);

  const showDeleteConfirm = (user) => {
    confirm({
      title: `Bạn Có Muốn Xóa  : ${user.hoten}`,
      icon: <ExclamationCircleOutlined />,
      content: `Nhân Viên Của ${user.congty}`,
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        const deleteUserClick = async () => {
          const result = await axios
            .delete(api + `/users/delete?userid=${user.userid}`)
            .then((response) => {
              dispatch(deleteUser(user.userid));
              message.success("Xóa Thành Công");
              backClick();
            })
            .catch((err) => {
              backClick();
              message.error(err.response.data.mess);
            });
        };
        deleteUserClick();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "Họ Và Tên",
      dataIndex: "hoten",

      width: 150,
    },
    {
      title: "Tên Đăng Nhập",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Công Ty",
      dataIndex: "congty",
    },
    {
      title: "Phòng Ban",
      dataIndex: "tenphongban",
    },
    {
      title: "Chức Danh",
      dataIndex: "tenchucdanh",
    },
    {
      title: "Chức Năng",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={editUser(record.userid)}
          style={{ width: "100%" }}
        >
          Chỉnh Sửa
        </Button>
      ),
    },
    {
      title: "Thao Tác",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          style={{ width: "100%" }}
          onClick={() => {
            showDeleteConfirm(record);
          }}
        >
          Xóa Người Dùng
        </Button>
      ),
    },
  ];

  const filterUser = (e) => {
    setStatus_search(true);
    setSearch(e.target.value);
  };

  const tableLoadingAction =
    status_search === true ? listUserAffterSearch : listUserCty;

  useEffect(() => {
    dispatch(searchUser(search));
  }, [dispatch, search]);

  const onUpdate = (value) => {
    const userUpdate = async () => {
      const result = await axios
        .post(api + `/users/update`, value)
        .then((response) => {
          dispatch(updateUser(response.data.data));
          console.log(response.data.data);
          message.success("Cập Nhật Thành Công")
          loadingAlluser();
        })
        .catch((error) => {
        
          message.error(error.response.data.mess);
        });
    };
    userUpdate();
  };

  const sync_mf9  = () => {
    confirm({
      title: 'Bạn Có Muốn Đồng Bộ Công Ty 9?',
      icon: <ExclamationCircleOutlined />,
      content: 'Đồng Bộ Người Dùng',
      onOk() {
        const mf9 = async () => {
          const result = await axios
            .get(api+"/users/sync-mf9")
            .then((response) => {
              loadingAlluser();
              console.log(response.data);
            })
            .catch((err) => {
              message.error(err.response.data.mess);
            });
        };
        mf9();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const options = [];
  const options_department = [];


  company_value.map((i, index) => {
    options.push({
      value: i.company_code,
      label: i.company_name,
    });
  })

  department_value.map((i, index) => {
    options_department.push({
      value: i.id,
      label: i.tenphongban,
    });
   
  })


  const event = updateButton === true ? onFinish : onUpdate;

  return (
    <div className={cx("home")}>
      <MenuComponent title="Quản Lý Người Dùng" icon="fa fa-users" />
      <div className={cx("user_container")}>
        <div className={cx("user_from")}>
          {createHidden === false ? (
            <button
              type="button"
              onClick={() => {
                setCreateHidden(!createHidden);
              }}
              className="btn btn-success"
            >
              Tạo Người Dùng +
            </button>
          ) : (
            <>
              <div
                className={cx("back_button")}
                onClick={() => {
                  backClick();
                }}
              >
                <Button type="dashed">Quay Về</Button>
              </div>
              <div className={cx("form_user")}>
                <div className="col-12 grid-margin">
                  {/* onClick={handleSubmit} */}
                  <Form
                    form={form}
                    name="basic"
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    onFinish={event}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          {updateButton === false ? (
                            <div
                              style={{
                                display: "none",
                              }}
                            >
                              <Form.Item label="Tên Đăng Nhập" name="userid">
                                <Input placeholder=" Tên Đăng Nhập" />
                              </Form.Item>
                            </div>
                          ) : (
                            ""
                          )}

                          <Form.Item
                            label="Tên Đăng Nhập"
                            name="username"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Tên Đăng Nhập",
                              },
                            ]}
                          >
                            {updateButton === false ? (
                              <Input placeholder=" Tên Đăng Nhập" disabled />
                            ) : (
                              <Input placeholder=" Tên Đăng Nhập" />
                            )}
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Mật Khẩu"
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Mật Khẩu",
                              },
                            ]}
                          >
                            {updateButton === false ? (
                              <Input.Password placeholder="Mật Khẩu" disabled />
                            ) : (
                              <Input.Password placeholder="Mật Khẩu" />
                            )}
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Họ Và Tên"
                            name="hoten"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Họ Và Tên",
                              },
                            ]}
                          >
                            <Input placeholder="Họ Và Tên" />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Tên Chức Danh"
                            name="tenchucdanh"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Tên Chức Danh",
                              },
                            ]}
                          >
                            <Input placeholder="Tên Chức Danh" />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Chọn Công Ty"
                            name="congty"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Chọn Công Ty",
                              },
                            ]}
                          >
                            <Select
                               showSearch
                              defaultValue="Chọn Công Ty"
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
                              options={options}
                              onChange={handleChange}
                            >
                              
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                      {status_cty === true ? (
                        <div className="col-md-6">
                          <div className="form-group row">
                            <Form.Item
                              label="Chọn Phòng Ban"
                              name="tenphongban"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui Lòng Chọn Phòng Ban",
                                },
                              ]}
                            >
                              <Select
                              showSearch
                                defaultValue="Chọn phòng ban"
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
 

                                options={options_department}
                                onChange={handleChangeDepartments}
                              >
                                {department_value.map((value, index) => {
                                  return (
                                    <Option key={index} value={value.id}>
                                      {value.tenphongban}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className={cx("button_action")}>
                      {updateButton === false ? (
                        <button className="btn btn-primary active">
                          Cập Nhật Chương Trình{" "}
                        </button>
                      ) : (
                        <Button
                          type="primary"
                          htmlType="submit"
                          className={cx("success")}
                        >
                          Thêm Người Dùng +
                        </Button>
                      )}
                      <Button htmlType="button" onClick={onReset}>
                        Reset
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={cx("user_table")}>
          <div className={cx("user_title")}>Danh Sách User</div>
          <div className={cx("table_main")}>
            <div className={cx("filter_user")}>
              <div className="row">
                <div className="col-md-6">
                  <form className="row g-3">
                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-primary active"
                        onClick={() =>{sync_mf9()}}
                      >
                        Đồng Bộ Công Ty 9
                      </button>
                    </div>
                    <div className="col-auto">
                      <Input
                        value={search}
                        onChange={filterUser}
                        placeholder="Tìm Kiếm Người Dùng"
                        className={cx("input_find")}
                      />
                    </div>
                  </form>
                </div>
                <div className="col-md-6" id={cx("select_cty")}>
                  <form className="row g-3">
                    <div className="col-auto">
                      <Select
                       showSearch
                        className={cx("choose_search")}
                        placeholder="Chọn Công Ty"
                        onChange={handleOnChange}
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
                      >
                       
                      </Select>
                    </div>
                    <div className="col-auto">
                      {status_cty === true ? (
                        <Select
                        showSearch
                          className={cx("choose_search")}
                          placeholder="Chọn Phòng Ban"
                          onChange={handleChangeDep}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                          }
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toLowerCase()
                              .localeCompare((optionB?.label ?? "").toLowerCase())
                          }
                          options={options_department}
                        >
                         
                        </Select>
                      ) : (
                        "Chưa Có Phòng Ban"
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="table-responsive-md">
              <Table
                columns={columns}
                dataSource={tableLoadingAction}
                rowKey="username"
                loading={tblLoading}
                pagination={{
                  current: page,
                  pageSize: pageSize,
                  total: totalPages,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                  },
                }}
                scroll={{
                  y: 300,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
