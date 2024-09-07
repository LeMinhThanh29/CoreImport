import { useState, useEffect } from "react";
import styles from "../page/Home/Home.module.scss";
import classNames from "classnames/bind";
import { Typography, Modal, Table,message } from "antd";
import axios from "axios";
import { api } from "../api/index.js";
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
} from "../redux/slice/ImportFileSlice";
import { Tag,Button, } from "antd";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Moment from "react-moment";
import { loadAllUser } from "../redux/slice/UserManagerSlice";
import { loadingProgress } from "../redux/slice/ProgramSlice";
import moment from "moment";
const cx = classNames.bind(styles);
const { Text } = Typography;

function TableInfo(props) {

  const dispatch = useDispatch();
  const allFileImport = useSelector((state) => state.import.listFileImports);
  const allFileImportStauts = useSelector((state) => state.import.fileStatus);
  const listprogram = useSelector((state) => state.program.programList);

  const listUserCty = useSelector((state) => state.user.listUserStaff);
  const fileImportDetails = useSelector((state) => state.import.fileDetail);
  const statusPr = useSelector((state) => state.import.statusProgess);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [pageDetail, setPageDetail] = useState(1);
  const [pageSizeDetails, setPageSizeDetails] = useState(10);
  const [totalPagesDetail, setTotalPagesDetail] = useState(1);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [listprogram_detail , setProgramDetail] = useState([])
  const datane = useSelector((state) => state.import.dataAfterParse);
  const columnsFileImports = useSelector(
    (state) => state.import.columnsFileImports
  );
  const { confirm } = Modal;


  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const showModal = (record) => {
    setIsModalOpen(true);
    const detailFile = async () => {
      setLoadingDetail(true);
      const result = await axios
        .get(api + `/import/detail?import_id=${record.import_id}`)
        .then((response) => {
          setLoadingDetail(false);
          console.log(response.data.data);
          dispatch(getFileDetails(response.data.data));
          setLoadingDetail(false);
          dispatch(getValueData( response.data.data.data))

          response.data.data.columns.map((column) => {
          
            dispatch(detailFileColumn(column));
          });
           
          setTotalPagesDetail(datane.length);
        })
        .catch((err) => {
          message.error(err.response.data.mess);
        });
    };
    detailFile();
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
          message.error(error.message);
        });
    };
    dowload();
  };


  const loadingListFileImport = () => {
    const fileList = async () => {
      setLoading(true);
      const result = await axios
        .get(api + `/import/list`)
        .then((response) => {
          setLoading(false);
          dispatch(getAllFileimport(response.data.data));
          setTotalPages(allFileImport.length);
          loadProgram();
          loadingAlluser();
        })
        .catch((err) => {
          message.error(err.message);
        });
    };
    fileList();
  };

  const loadProgram = async () => {
    const result = await axios
      .get(api + "/program/list")
      .then((resp) => {
      
        setProgramDetail(resp.data.data)
        dispatch(loadingProgress(resp.data.data));
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const loadingAlluser = async () => {
    const result = await axios
      .get(api + "/users")
      .then((response) => {
        dispatch(loadAllUser(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const statusFileImport = async () => {
    const result = await axios
      .get(api + "/import/status")
      .then((response) => {
        dispatch(getFileStatus(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };


  useEffect(() => {
    setTimeout(() => {
    statusFileImport();
    loadingListFileImport();
    
  }, 200);
  }, []);

  const columns = [
    {
      title: "Tên Chương Trình",
      render: (_, record) => (
        <span>
        {record.program_code}
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


  
 




  return (
    <>
      <div className={cx("progress_file")}>
        <div className={cx("status_title")}>
          <p>Tiến Độ Các File Đã Được Import</p>
          <div className="table-responsive-md" id={cx("table_import")}>
            <Table
              loading = {loading}
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
                ;

                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default TableInfo;
