import { useState, useEffect, useRef } from "react";
import Menu from "../MenuComponent/Menu";
import styles from "../ProgramManager/Program.module.scss";
import classNames from "classnames/bind";
import { Input, Select, Button, Skeleton, Table, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Form, message } from "antd";
import Authen from "../Authentication/Authen";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../../api/index";
import { useDispatch, useSelector } from "react-redux";
import {
  saveProgramSlice,
  loadingProgress,
  editProgram,
  updateProgram,
  searchProgram,
} from "../../redux/slice/ProgramSlice";
import { getStatus, UpdateStatus } from "../../redux/slice/ImportFileSlice";
import { getAllConfigOfProgram } from "../../redux/slice/ConfigSice";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate } from "react-router-dom";
import { loadingCompany } from "../../redux/slice/CompanySlice";
import { loadingDepartment } from "../../redux/slice/Department";
import { getUserAuthor, saveUser } from "../../redux/slice/AuthoritySlice";

const { confirm } = Modal;
const cx = classNames.bind(styles);
const { Option } = Select;

function Program() {
  const dispatch = useDispatch();
  const [programStatus, setProgramStatus] = useState(false);
  const [updateButton, setUpdateButton] = useState(true);
  const [open, setOpen] = useState(false);
  const [timer, SetTime] = useState(true);
  const [statusAction, setStatusAction] = useState(true);

  //Thực Hiện Gọi API để Tải Các Chương Trình Lên
  const listprogram = useSelector((state) => state.program.programList);
  const edit = useSelector((state) => state.program.programInfo);
  const author = useSelector((state) => state.author);
  const [programCode, setProgramCode] = useState("");
  const [list_ora, setList_ora] = useState([]);

  const loadProgram = async () => {
    setLoading(true);
    const result = await axios
      .get(api + "/program/list")
      .then((resp) => {
        setLoading(false);

        dispatch(loadingProgress(resp.data.data));
        setTotalPages(listprogram.length);
      })
      .catch((error) => {
        message.error(error.response.data.mess);
      });
  };

  const load_Select_ora = async () => {
    const result = await axios
      .get(api + "/program/database-configs")
      .then((response) => {
        console.log(response.data);
        setList_ora(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      loadProgram();
      load_Select_ora();
      SetTime(false);
    }, 100);
  }, []);

  ////////////////////////////////
  //Các Sự Kiện Của Giao Diện
  const [form] = Form.useForm();
  const onReset = () => {
    setUpdateButton(true);
    form.resetFields();
  };

  const editUser = (id) => () => {
    console.log("@editUser", id);

    setProgramStatus(true);
    setUpdateButton(false);

    openMessage();

    if (id) {
      setProgramCode(edit.program_code);
      const onEditProgramAPi = async () => {
        const result = await axios
          .get(api + `/program/detail?program_code=${id}`)
          .then((resp) => {
            const newProgramInfo = {
              program_code: resp.data.data.program_code,
              program_name: resp.data.data.program_name,
              note: resp.data.data.note,
              database_config_name: resp.data.data.database_config_name,
              schema_name: resp.data.data.schema_name,
              pro_name: resp.data.data.pro_name,
              view_name: resp.data.data.view_name,
            };
            dispatch(editProgram(newProgramInfo));

            form.setFieldsValue(newProgramInfo);
          })
          .catch((error) => {
            message.error(error.response.data.mess);
          });
      };
      onEditProgramAPi();
    }
  };

  const backClick = () => {
    setProgramStatus(false);
    setUpdateButton(true);
    onReset();
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Thông Báo?",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn Có Muốn Xóa Chương Trình ${id}?`,
      okText: "Có",
      okType: "danger",
      cancelText: "Không",

      onOk() {
        const deleteProgram = async () => {
          const result = await axios
            .delete(api + `/program/delete?program_code=${id}`)
            .catch((error) => {
              message.error(error.response.data.mess);
            });
          form.resetFields();
          loadProgram();
        };
        deleteProgram();
        backClick();
      },

      onCancel() {
        console.log("Cancel");
      },
    });
  };
  //////////////Sự Kiện///////////////

  ////////////////////////////////
  // Xử Lý Tạo Mới 1 Chương Trình

  ///Tạo Mới
  const onFinish = async (values) => {
    const result = await axios
      .post(api + "/program/create", values)
      .catch((error) => {
        message.error(error.response.data.mess);
      });
    form.resetFields();
    const program_code = result.data.program_code;
    const program_info = { ...result.data, programCode: program_code };
    dispatch(saveProgramSlice(program_info));
    message.success("Tạo Chương Trình Thành Công");
    loadProgram();
    backClick();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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
        duration: 1,
      });
    }, 500);
  };
  /// Chỉnh Sửa

  ///Cập Nhật

  const onUpdate = async (values) => {
    console.log(edit);
    const result = await axios
      .post(api + `/program/update?program_code=${edit.program_code}`, values)
      .catch((error) => {
        message.error(error.response.data.mess);
      });

    const program_info = { ...result.data };
    dispatch(updateProgram(program_info));
    loadProgram();
    message.success("Cập Nhật Chương Trình Thành Công");
  };

  const filteredUsers = useSelector((state) => state.program.filteredUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const filterProgram = (e) => {
    setStatusAction(false);
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    dispatch(searchProgram(searchTerm));
  }, [searchTerm, dispatch]);

  const tableLoadingAction =
    statusAction === true ? listprogram : filteredUsers;

  const event = updateButton === true ? onFinish : onUpdate;

  const navigate = useNavigate();

  const detailConfig = (id) => () => {
    const getConfigOfProgram = async () => {
      const result = await axios.get(
        api + `/program/detail?program_code=${id}`
      );
      dispatch(getAllConfigOfProgram(result.data.data));
      navigate(`/program/config/${id}`);
    };
    getConfigOfProgram();
  };

  const loadCompany = () => {
    const getCompany = async () => {
      const result = await axios.get(api + `/company`);
      dispatch(loadingCompany(result.data.data));
    };
    getCompany();
  };

  const loadRoom = () => {
    const getRoom = async () => {
      const result = await axios.get(api + `/company/department`);
      dispatch(loadingDepartment(result.data.data));
    };
    getRoom();
  };

  useEffect(() => {
    loadCompany();
    loadRoom();
  }, []);
  // console.log(department)

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const clickButton = (id) => () => {
    setOpen(true);

    const getUserForAuth = async () => {
      const result = await axios
        .get(api + `/permission?program_code=${id}`)
        .catch((error) => {
          console.log(error);
        });
      const program_code = id;
      const payload = { ...result.data, program_code };

      dispatch(getUserAuthor(payload));
    };
    getUserForAuth();
  };

  const downloadFileClick = (pr_code) => () => {
    const dowload = async () => {
      const result = await axios
        .get(api + `/program/template-file/download?program_code=${pr_code}`)
        .then((response) => {
          window.location.href = `https://import-api-test.mobifone9.vn/import/v2/program/template-file/download?program_code=${pr_code}`;
        })
        .catch((err) => {
          console.error(err);
        });
    };
    dowload();
  };

  const columns = [
    {
      title: "Tải File Mẫu",
      render: (_, record) => (
        <Space size="middle">
          <a href="#" onClick={downloadFileClick(record.program_code)}>
            Tải Xuống {record.program_code}
          </a>
        </Space>
      ),
      key: "file",
    },
    {
      title: "Mã Chương Trình",
      dataIndex: "program_code",
      key: "program_code",
    },
    {
      title: "Tên Chương Trình",
      dataIndex: "program_name",
      key: "program_name",
    },
    {
      title: "Chức Năng",
      key: "action",
      render: (_, record) => (
        <Button
          style={{ width: "100%" }}
          type="primary"
          danger
          onClick={() => {
            showDeleteConfirm(record.program_code);
          }}
        >
          Xóa
        </Button>
      ),
    },
    {
      title: "Chỉnh Sửa",
      key: "action",
      render: (_, record) => (
        <Button
          style={{ width: "100%" }}
          type="primary"
          className={cx("warning")}
          onClick={editUser(record.program_code)}
        >
          Chỉnh Sửa
        </Button>
      ),
    },
    {
      title: "Tùy Chọn",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={clickButton(record.program_code)}
          style={{ width: "100%" }}
        >
          Phân Quyền
        </Button>
      ),
    },
    {
      title: "Cấu Hình",
      key: "action",
      render: (_, record) => (
        <Button
          style={{ width: "100%" }}
          type="primary"
          className={cx("success")}
          onClick={detailConfig(record.program_code)}
        >
          Cấu Hình
        </Button>
      ),
    },
  ];

  const loadingProgressStatus = async () => {
    const result = await axios
      .get(api + "/import/process/status")
      .then((response) => {
        dispatch(getStatus(response.data.data));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const statusPr = useSelector((state) => state.import.statusProgess);

  const updateStatusAction = (i) => () => {
    const newStatus = {
      active: i,
    };
    console.log(newStatus);
    const Active = async () => {
      const result = await axios
        .post(api + "/import/process/status-update", newStatus)
        .then((response) => {
          dispatch(getStatus(i));
        })
        .catch((err) => {
          console.error(err);
        });
    };
    Active();
  };

  const [option_data, setOption_data] =useState();
  useEffect(() => {
    setTimeout(() => {
      loadingProgressStatus();
    }, 200);
    list_ora.map((value, index) =>{
      
        const a = {
          value: value,
          label: value
        }
        setOption_data(a);
       
      })
  }, []);

  return (
    <div className={cx("home")}>
      <Menu title="Quản Lý Chương Trình" icon="fa fa-computer" />

      <div className={cx("program_controller")}>
        <div className={cx("program_form")}>
          {programStatus === false ? (
            <>
              <button
                className="btn btn-success"
                onClick={() => {
                  setProgramStatus(true);
                }}
              >
                Tạo Chương Trình
              </button>

              {statusPr === 1 ? (
                <button
                  className="btn btn-danger"
                  style={{ marginLeft: "10px" }}
                  onClick={updateStatusAction(0)}
                >
                  Tắt Trạng Thái Hoạt Động
                </button>
              ) : statusPr === 0 ? (
                <button
                  className="btn btn-success"
                  style={{ marginLeft: "10px" }}
                  onClick={updateStatusAction(1)}
                >
                  Bật Trạng Thái Hoạt Động
                </button>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <div
                className={cx("back_button")}
                onClick={() => {
                  backClick();
                }}
              >
                <Button type="dashed">Quay Về </Button>
                {statusPr === 1 ? (
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: "10px" }}
                    onClick={updateStatusAction(0)}
                  >
                    Tắt Trạng Thái Hoạt Động
                  </button>
                ) : statusPr === 0 ? (
                  <button
                    className="btn btn-success"
                    style={{ marginLeft: "10px" }}
                    onClick={updateStatusAction(1)}
                  >
                    Bật Trạng Thái Hoạt Động
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div className={cx("program_form_main")}>
                <div className="col-12 grid-margin">
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
                          <Form.Item
                            label="Tên Chương Trình"
                            name="program_name"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Tên Chương Trình",
                              },
                            ]}
                          >
                            <Input placeholder=" Tên Chương Trình" />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Mã Chương Trình"
                            name="program_code"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Mã Chương Trình",
                              },
                            ]}
                          >
                            <Input placeholder="Mã Chương Trình" />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Tên Cấu Hình Kết Nối"
                            name="database_config_name"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Vui Lòng Nhập Vào Tên Cấu Hình Kết Nối",
                              },
                            ]}
                          >
                          

                            <Select
                            showSearch
                              defaultValue="Tên Cấu Hình Kết Nối"
                              style={{
                                width: "100%",
                              }}
                            >
                              {list_ora.map((value, index) => {
                                return (
                                  <Option key={index} value={value}>
                                    {value}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Tên Schema"
                            name="schema_name"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Tên Schema",
                              },
                            ]}
                          >
                            <Input placeholder="Tên Schema" />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Tên view dữ liệu"
                            name="view_name"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Tên view dữ liệu",
                              },
                            ]}
                          >
                            <Input
                              defaultValue="vimp2_"
                              placeholder="Tên view dữ liệu"
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item
                            label="Procedure"
                            name="pro_name"
                            rules={[
                              {
                                required: true,
                                message: "Vui Lòng Nhập Vào Procedure",
                              },
                            ]}
                          >
                            <Input placeholder="Procedure" />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <Form.Item label="Ghi Chú" name="note">
                            <TextArea placeholder="Ghi Chú" />
                          </Form.Item>
                        </div>
                      </div>
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
                          Tạo Chương Trình +
                        </Button>
                      )}
                      <Link to="/program">
                        <Button htmlType="button" onClick={onReset}>
                          Reset
                        </Button>
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={cx("program_table")}>
          <div className={cx("program_title")}>Danh Sách Chương Trình</div>
          <div className={cx("program_table_main")}>
            <div className={cx("filter_program")}>
              <div className="row">
                <div className="col-md-4">
                  <form className="">
                    <div className="col-auto">
                      <Input
                        placeholder="Tìm Kiếm Chương Trình"
                        value={searchTerm}
                        onChange={filterProgram}
                        className={cx("input_find")}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <Table
              loading={loading}
              columns={columns}
              dataSource={tableLoadingAction}
              rowKey="program_code"
              pagination={{
                pageSize: 10,
                total: totalPages,
              }}
            ></Table>
          </div>
        </div>
      </div>

      <Modal
        title={`Cấp Quyền Chương Trình : ${author.program_code}`}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        className={cx("authen")}
      >
        <Authen open={open} />
      </Modal>
    </div>
  );
}

export default Program;
