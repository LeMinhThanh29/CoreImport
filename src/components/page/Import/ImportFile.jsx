
import styles from "../Import/Import.module.scss";
import classNames from "classnames/bind";
import Menu from "../MenuComponent/Menu";
import { useState, useRef, useEffect } from "react";
import {
  Typography,
  Button,
  Table,
  message,
  Modal,
  Pagination,
  Upload,
  Form,
} from "antd";
import { Select } from "antd";
import axios from "axios";
import { api } from "../../api/index.js";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFileimport,
  getFileStatus,
  getFileDetails,
  getStatus,
  removeFile,
  importAFile,
  detailFileColumn,
  RefeshetailFileColumn,
  getValueData
} from "../../redux/slice/ImportFileSlice";
import { selectProgram } from "../../redux/slice/ProgramSlice";
import Moment from "react-moment";

import { loadAllUser } from "../../redux/slice/UserManagerSlice";
import { loadingProgress } from "../../redux/slice/ProgramSlice";
import { Tag } from "antd";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import moment from "moment";
// import fs from 'fs'

const cx = classNames.bind(styles);

const { Option } = Select;

const { Text } = Typography;
let progressInterval = null;
function ImportFile(props) {
  // ===========================================================
  // >>>> STATE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // ===========================================================
  const [fileImport, setFile] = useState("");
  const [statusImportFile, setStatusImport] = useState(false);
  const dispatch = useDispatch();
  const allFileImport = useSelector((state) => state.import.listFileImports);
  const allFileImportStauts = useSelector((state) => state.import.fileStatus);
  const listprogram = useSelector((state) => state.program.programList);
  const listUserCty = useSelector((state) => state.user.listUserStaff);
  const fileImportDetails = useSelector((state) => state.import.fileDetail);
  const statusPr = useSelector((state) => state.import.statusProgess);
  const program_CODE = useSelector((state) => state.program.programCode);
  const datane = useSelector((state) => state.import.dataAfterParse);
  const columnsFileImports = useSelector(
    (state) => state.import.columnsFileImports
  );
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [stateSelect , setStateSelect] = useState(false);


  
  const [pageDetail, setPageDetail] = useState(1);
  const [pageSizeDetails, setPageSizeDetails] = useState(10);
  const [totalPagesDetail, setTotalPagesDetail] = useState(1);


  const { confirm } = Modal;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (record) => {
    setIsModalOpen(true);
    const detailFile = async () => {
      setLoadingDetail(true);
      const result = await axios
        .get(api + `/import/detail?import_id=${record.import_id}`)
        .then((response) => {
          console.log(record.import_id);
          dispatch(getFileDetails(response.data.data));
          setLoadingDetail(false);
          dispatch(getValueData( response.data.data.data))

          response.data.data.columns.map((column) => {
          
            dispatch(detailFileColumn(column));
          });
           console.log(datane.length)
          setTotalPagesDetail(datane.length);
       
        })
        .catch((err) => {
          message.error(err.response.data.mess);
        });
    };
    
    detailFile();
  };



  const [selectProgram_id, setSelectProgram] = useState(1);
  const handleChange = (values) => {
    setSelectProgram(0);
    setStateSelect(true)
    dispatch(selectProgram(values));
    loadingListFileImport(values);
  };
  const handleOk = () => {
    dispatch(
      RefeshetailFileColumn([
        {
          column_name_desc: "Trạng Thái",
          column_name: "status_text",
        },
      ])
    );
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    dispatch(
      RefeshetailFileColumn([
        {
          column_name_desc: "Trạng Thái",
          column_name: "status_text",
        },
      ])
    );
    setIsModalOpen(false);
  };

  // ===========================================================
  // >>>> CALL API  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // ===========================================================

  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile.name.slice(newFile.name.lastIndexOf(".") + 1) === "xlsx") {
      if (newFile) {
        const updatedList = { ...fileList, newFile };
        setFileList(updatedList);
        props.onFileChange(updatedList);
      }
    }
  };

  const loadProgram = async () => {
    const result = await axios
      .get(api + "/program/list")
      .then((resp) => {
        dispatch(loadingProgress(resp.data.data));
      })
      .catch((error) => {
        message.error(error.response.data.mess);
      });
  };

  const loadingAlluser = async () => {
    const result = await axios
      .get(api + "/users")
      .then((response) => {
        dispatch(loadAllUser(response.data.data));
      })
      .catch((error) => {
        message.error(error.response.data.mess);
      });
  };

  const statusFileImport = async () => {
    const result = await axios
      .get(api + "/import/status")
      .then((response) => {
        dispatch(getFileStatus(response.data.data));
      })
      .catch((error) => {
        message.error(error.response.data.mess);
      });
  };

  const loadingListFileImport = (values) => {
    const fileList = async () => {
      setLoading(true);
      const result = await axios
        .get(api + `/import/list?program_code=${values}&status=0`)
        .then((response) => {
          setLoading(false);
          dispatch(getAllFileimport(response.data.data));
          loadProgram();
          loadingAlluser();
          console.log(allFileImport);
          setTotalPages(response.data.data.length)
        })
        .catch((err) => {
          message.error(err.response.data.mess);
        });
    };
    fileList();
  };

  const downloadFileClick = (record) => () => {
    const dowload = async () => {
      const result = await axios
        .get(api + `/import/download-file?import_id=${record.import_id}`, {
          method: "GET",
          responseType: "blob", // important
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${record.file_name}`);
          document.body.appendChild(link);
          link.click();
          message.success("Tải Thành Công");
        })
        .catch((error) => {
          message.error(error.response.data.mess);
        });
    };
    dowload();
  };

  const showDeleteConfirm = (import_main) => {
    confirm({
      title: `Bạn Có Muốn Xóa File  : ${import_main.file_name}`,
      icon: <ExclamationCircleOutlined />,
      content:
        `Được Import Vào Ngày` +
        " " +
        moment(import_main.created_at).format("YYYY/MM/DD kk:mm:ss"),
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        const deleteUserClick = async () => {
          const result = await axios
            .delete(api + `/import/delete?import_id=${import_main.import_id}`)
            .then((response) => {
              message.success("Xóa Thành Công");
              dispatch(removeFile(import_main.import_id));
            })
            .catch((err) => {
              message.error(err.response.data.mess);
            });
        };
        console.log(import_main.import_id);
        deleteUserClick();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const loadingProgressStatus = async () => {
    const result = await axios
      .get(api + "/import/process/status")
      .then((response) => {
        dispatch(getStatus(response.data.data));
      })
      .catch((error) => {
        message.error(error.response.data.mess);
      });
  };

  const downloadFileClickProgram_Code = () => () => {
    const dowload = async () => {
      const result = await axios
        .get(
          api + `/program/template-file/download?program_code=${program_CODE}`
        )
        .then((response) => {
          window.location.href = `https://import-api-test.mobifone9.vn/import/v2/program/template-file/download?program_code=${program_CODE}`;
        })
        .catch((err) => {
          message.error(err.response.data.mess);
        });
    };
    dowload();
  };

  // ===========================================================
  // >>>> FOR USEEFFECT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // ===========================================================

  useEffect(() => {
    setTimeout(() => {
      // statusFileImport();
      // loadingProgressStatus();
      // loadProgram();
    }, 200);
  }, []);

  // ===========================================================
  // >>>> FOR DATATABLE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // ===========================================================

  const columns = [
    {
      title: "Tên Chương Trình",
      render: (_, record) => (
        <span>
          {record.program_code}
          {/* {listprogram
            .filter((list) => list.program_code.includes(record.program_code))
            .map((i, index) => {
              return i.program_name;
            })} */}
        </span>
      ),
    },
    {
      title: "Tên File Import",
      render: (_, record) => (
        <a href="#" onClick={downloadFileClick(record)}>
          Tải Xuống {record.program_code}
        </a>
      ),
    },
    {
      title: "Người Import",
      render: (_, record) => (
        <span>
          {listUserCty
            .filter((list) => list.userid.includes(record.user_import))
            .map((i, index) => {
              return i.hoten;
            })}
        </span>
      ),
    },
    {
      title: "Thời Gian",
      render: (_, record) => (
        <Moment format="YYYY/MM/DD hh:mm:ss">{record.created_at}</Moment>
      ),
    },
    {
      title: "Trạng Thái Xử Lý",
      render: (_, record) => (
        <Tag
          icon={
            record.status === 1 ? (
              <ClockCircleOutlined />
            ) : record.status === 2 ? (
              <SyncOutlined spin />
            ) : record.status === 3 ? (
              <CheckCircleOutlined />
            ) : record.status === 4 ? (
              <CloseCircleOutlined />
            ) : (
              ""
            )
          }
          color={
            record.status === 1
              ? "default"
              : record.status === 2
              ? "processing"
              : record.status === 3
              ? "success"
              : record.status === 4
              ? "error"
              : ""
          }
        >
          {allFileImportStauts
            .filter((list) => list.status_id === record.status)
            .map((i, index) => {
              return i.status_name;
            })}
        </Tag>
      ),
    },
    {
      title: "Trạng Thái Hoạt Động",
      render: (_, record) => (
        <Tag color={statusPr === 1 ? "#87d068" : "#f50"}>
          {statusPr === 1 ? "Hoạt Động" : "Dừng Xử Lý"}
        </Tag>
      ),
    },

    {
      title: "Tổng số dòng",
      dataIndex: "total",
    },
    {
      title: "Thành công",
      dataIndex: "success",
    },
    {
      title: "Thất bại",
      dataIndex: "error",
    },
    {
      title: "Chức Năng",
      render: (_, record) => (
        <Button
          type="primary"
          style={{ fontSize: "15px" }}
          onClick={() => {
            showModal(record);
          }}
        >
          Chi Tiết
        </Button>
      ),
    },
    {
      title: "Thao Tác",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          style={{ fontSize: "15px" }}
          onClick={() => {
            showDeleteConfirm(record);
          }}
        >
          Xóa File
        </Button>
      ),
    },
  ];

  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };

  const showConfirm = (value) => {
    confirm({
      title: `Bạn Đã Import Thành Công File ${value.file_name}`,
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      content: `Vào Lúc ${value.created_at}`,
      onOk() {
        SetProgress(0);
        setStProgress(false);
      },
      onCancel() {
        SetProgress(0);
        setStProgress(false);
      },
    });
  };

  const handleSubmit = () => () => {
    setStProgress(true);
    setStatusImport(false);
    setStatusProgess(true);
    setSelectProgram(2);
    console.log(stProgress);
   
    onReset();

    // Import();
  };

  const [progress, SetProgress] = useState(0);
  const [statusProgess, setStatusProgess] = useState(false);
  const [stProgress, setStProgress] = useState(false);
  const [submitFile, setSubmitFile] = useState(false);
  useEffect(() => {
    if (stProgress === true) {
      progressInterval = setInterval(() => {
        SetProgress((prev) => prev + 1);
      }, 50);
    } else {
    }
  }, [stProgress]);

  useEffect(() => {
    if (progress == 100) {
      setSubmitFile(true);
      setStatusProgess(false);
      setStatusImport(false);

      var data = new FormData();
      data.append(
        "file",
        fileImport
        // fs.createReadStream(fileImport)
      );
      data.append("program_code", program_CODE);
      const Import = async () => {
        const result = await axios
          .post(api + "/import", data)
          .then((response) => {
            dispatch(importAFile(response.data.data));
            setFile("");
            setSelectProgram(1);

            showConfirm(response.data.data);
          })
          .catch((error) => {
            console.log(error);
            message.error("Import File Không Thành Công ");
          });
      };
      Import();

      clearInterval(progressInterval);
    }
  }, [progress]);

  const options = [];



  listprogram.map((i, index) => {
    options.push({
      value: i.program_code,
      label: i.program_name,
    });
  })

  return (
    <div className={cx("home")}>
      <Menu title="Import File" icon="fa fa-computer" />
      <div className={cx("import_controller")}>
        <div className={cx("import_main")}>
          <div className={cx("import_dowload_file")}>
            <div className="row">
              <Form form={form} className="row g-3">
                <div className="col-auto">
                  <label
                    htmlFor="staticEmail2"
                    className="form-control-plaintext"
                  >
                    Chọn Chương Trình
                  </label>
                </div>
                <div className="col-auto">
                  <Form.Item
                    name="program_code"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                       showSearch
                      defaultValue="Chọn Chương Trình"
                      style={{
                        width: 250,
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
                <div className="col-auto">
                  {stateSelect === true ? (
                    <Button
                      type="primary"
                      className="btn btn-primary mb-3"
                      onClick={downloadFileClickProgram_Code()}
                    >
                      Tải File Mẫu
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </Form>
            </div>
          </div>

          {selectProgram_id === 0 ? (
            <div
              id={cx("file-upload-form")}
              ref={wrapperRef}
              className={cx("drop-file-input")}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <label htmlFor="file-upload" id="file-drag">
                <div>
                  <div className={cx("drop-file-input__label")}>
                    <div id="start">
                      <i
                        className="fa fa-download"
                        style={{ fontSize: 35 }}
                        aria-hidden="true"
                      ></i>
                      <h4>Chọn hoặc Kéo thả file lên chương trình</h4>
                      <div>
                        (Hãy tổng hợp tất cả dữ liệu muốn import vào file execl
                        ){" "}
                      </div>
                      <Text type="success" id={cx("notimage")}>
                        {fileImport.name}
                      </Text>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    value=""
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (
                        file.name.slice(file.name.lastIndexOf(".") + 1) ===
                        "xlsx"
                      ) {
                        onFileDrop(e);
                        setFile(file);
                        setStatusImport(true);
                      } else {
                        message.error("Phải Import File Excel");
                      }
                    }}
                  />
                </div>
              </label>
            </div>
          ) 
          : selectProgram_id === 1 ? 
          (
            <div className={cx("no_file_upload")}>
              <div className={cx("drop-file-input__label")}>
                <div id="start">
                  <i
                    className="fa fa-circle-info"
                    style={{ fontSize: 35 }}
                    aria-hidden="true"
                  ></i>
                  <h4>Bạn Vui Lòng Chọn 1 Chương Trình</h4>
                  <Text type="danger" id={cx("notimage")}>
                    (Hãy chọn 1 chương trình để import dữ liệu nhé! )
                  </Text>
                </div>
              </div>
            </div>
          )
          
          : selectProgram_id === 2 ?
          (
            <div className={cx("no_file_upload")}>
              <div className={cx("drop-file-input__label")}>
                <div id="start">
                  {/* <i
                    className="fa fa-circle-info"
                    style={{ fontSize: 35 }}
                    aria-hidden="true"
                  ></i> */}
                  <img src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!c1024wm0"
                    style={{ fontSize: 35 }}
                  alt="" />
                  <h4>Dữ Liệu Của Bạn Đang Được Import Đợi Một Chút Nhé</h4>
                  <Text type="primary" id={cx("notimage")}>
                    (......... )
                  </Text>
                </div>
              </div>
            </div>
          )
          
          :""
          
          
          
          
          }

          {statusImportFile === true ? (
            <div className={cx("button_import")}>
              <Button type="dashed" onClick={handleSubmit()}>
                Bắt Đầu Import
              </Button>
            </div>
          ) : (
            <></>
          )}

          {statusProgess === true ? (
            <>
              <br />
              <div className="progress" style={{ height: "12px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-label="Example 1px high"
                  style={{ width: `${progress}%` }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {progress}%
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          <div className={cx("tableInfo")}>
            <Table
              loading={loading}
              columns={columns}
              dataSource={allFileImport}
              rowKey="import_id"
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
                y: 240,
              }}
            />
          </div>

          <div className={cx("progress_file")}>
            <Modal
              width={1000}
              title={`Thông Tin Của File `}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div className="row" id={cx("modal")}>
                <div className="col-sm-4">
                  <p>
                    Tên File : <a href="">{fileImportDetails.file_name}</a>
                  </p>
                  <p>
                    Ngày Import:{" "}
                    <Text type="success">
                      <Moment format="YYYY/MM/DD hh:mm:ss">
                        {fileImportDetails.created_at}
                      </Moment>
                    </Text>
                  </p>
                  <p>
                    Người Import :
                    <Text type="success">
                      {listUserCty
                        .filter((list) =>
                          list.userid.includes(fileImportDetails.user_import)
                        )
                        .map((i, index) => {
                          return i.hoten;
                        })}
                    </Text>
                  </p>
                  <p>
                    Trạng Thái :
                    <Tag
                      icon={
                        fileImportDetails.status === 1 ? (
                          <ClockCircleOutlined />
                        ) : fileImportDetails.status === 2 ? (
                          <SyncOutlined spin />
                        ) : fileImportDetails.status === 3 ? (
                          <CheckCircleOutlined />
                        ) : fileImportDetails.status === 4 ? (
                          <CloseCircleOutlined />
                        ) : (
                          ""
                        )
                      }
                      color={
                        fileImportDetails.status === 1
                          ? "default"
                          : fileImportDetails.status === 2
                          ? "processing"
                          : fileImportDetails.status === 3
                          ? "success"
                          : fileImportDetails.status === 4
                          ? "error"
                          : ""
                      }
                    >
                      {allFileImportStauts
                        .filter(
                          (list) => list.status_id === fileImportDetails.status
                        )
                        .map((i, index) => {
                          return i.status_name;
                        })}
                    </Tag>
                  </p>
                </div>
                <div className="col-sm-3">
                  <p>
                    Tổng Số Dòng :{" "}
                    <Text type="success">{fileImportDetails.total}</Text>
                  </p>
                  <p>
                    Thành Công :{" "}
                    <Text type="success">{fileImportDetails.success}</Text>
                  </p>
                  <p>
                    Thất Bại :{" "}
                    <Text type="danger">{fileImportDetails.error}</Text>
                  </p>
                </div>
                <div className={cx("table_detail")}>
                  <Table
                    rowKey="USERID"
                    loading={loadingDetail}
                    pagination={{
                      current: pageDetail,
                      pageSize: pageSizeDetails,
                      total: totalPagesDetail,
                      onChange: (pageDetail, pageSizeDetails) => {
                        setPageDetail(pageDetail);
                        setPageSizeDetails(pageSizeDetails);
                      },
                    }}
                    columns={columnsFileImports.map((i, index) => {
                      return {
                        title: i.column_name_desc,
                        dataIndex: i.column_name,
                      };
                    })}
                    dataSource={
                      datane === undefined
                        ? []
                        : datane
                    }
                    scroll={{
                      x: 1300,
                    }}
                  />
                </div>
              </div>
              <br />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportFile;
