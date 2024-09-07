import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../Context/GlobalContext";
import { Link, useParams } from "react-router-dom";
import { Button, message } from "antd";
import styles from "../Configuration/Config.module.scss";
import classNames from "classnames/bind";
import Menu from "../MenuComponent/Menu";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Space, Select, Typography, Checkbox } from "antd";
import axios from "axios";
import { api } from "../../api/index";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  updateDragAndDrop,
  insertConfig,
  getAllConfigOfProgram,
} from "../../redux/slice/ConfigSice";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);
const { Text } = Typography;
const { Option } = Select;

function ConfigImport(props) {
  const { id } = useParams();
  const { datatypes } = useContext(ThemeContext);

  const [statusUpdate, setStatus_update] = useState(false);
  const onFinish = async (values) => {
    const newValue = {
      header_row: listConfig.header_row,
      begin_row: listConfig.begin_row,
      columns: listConfig.columns,
    };
    console.log(newValue);
    const result = await axios
      .post(api + `/program/save-config?program_code=${id}`, values)
      .then((resp) => {
        message.success("Cấu Hình Thành Công");
        setStatus_update(!statusUpdate);
        getConfigOfProgram();

        console.log(resp);
      })
      .catch((error) => {
        console.log(error);
        message.error(error.response.data.mess);
      });
  };
  const navigate = useNavigate();
  const onUpdate = async (values) => {
    const newValue = {
      header_row: listConfig.header_row,
      begin_row: listConfig.begin_row,
      columns: listConfig.columns,
    };

    const result = await axios
      .post(api + `/program/save-config?program_code=${id}`, newValue)
      .then((resp) => {
        message.success("Cấu Hình Thành Công");
        getConfigOfProgram();
        console.log(listConfig);
        navigate(`/program`);
      })
      .catch((error) => {
        console.log(error);
        message.error("Cấu Hình Thất Bại");
      });
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const dispatch = useDispatch();

  const listConfig = useSelector((state) => state.config.listConfig);

  const [form] = Form.useForm();

  const getConfigOfProgram = async () => {
    const result = await axios
      .get(api + `/program/detail?program_code=${id}`)
      .then((response) => {
        dispatch(getAllConfigOfProgram(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getConfigOfProgram();
  }, [id]);

  const initialState = {
    header_row: listConfig.header_row,
    begin_row: listConfig.begin_row,
    columns: listConfig.columns,
  };

  // Function to update list on drop
  const handleDrop = (droppedItem) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...initialState.columns];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    dispatch(updateDragAndDrop(updatedList));
  };

  return (
    <div className={cx("home")}>
      <Menu title="Quản Lý Chương Trình(Cấu Hình)" icon="fa fa-computer" />
      <div className={cx("config_main")}>
        <div className={cx("config_controller")}>
          <Form
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            initialValues={initialState}
          >
            <div className={cx("config_top")}>
              <p>
                Cấu Hình Của Chương Trình : <Text type="success">{id}</Text>
              </p>
              <div className="col-12 grid-margin">
                <div className="row">
                  <div>
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">
                        Số Thứ Tự Dòng Tiêu Đề
                      </label>
                      <div className="col-sm-5">
                        <Form.Item
                          name="header_row"
                          rules={[
                            {
                              required: true,
                              message: "Nhập Vào Số Thứ Tựu Dong Tiêu Đề",
                            },
                          ]}
                        >
                          <Input placeholder="Số Thứ Tựu Dong Tiêu Đề" />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">
                        Số Thứ Tự Dòng Lấy Dữ Liệu
                      </label>
                      <div className="col-sm-5">
                        <Form.Item
                          name="begin_row"
                          rules={[
                            {
                              required: true,
                              message: "Nhập Vào Số Thứ Tự Dòng Lấy Dữ Liệu",
                            },
                          ]}
                        >
                          <Input placeholder="Số Thứ Tự Dòng Lấy Dữ Liệu" />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Cấu hình chương trình" key="1">
                <div className={cx("config_bottom")}>
                  <div className="row">
                    <Form.List name="columns">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space
                              key={key}
                              style={{
                                display: "flex",
                                marginBottom: 8,
                              }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "column_name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Nhập Vào Tên Cột",
                                  },
                                ]}
                              >
                                <Input placeholder="Tên Cột" />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, "column_name_desc"]}
                                rules={[
                                  {
                                    required: true, 
                                    message: "Nhập Vào Mô Tả",
                                  },
                                ]}
                              >
                                <Input placeholder="Mô Tả" />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, "data_type"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Chọn Kiểu Dữ Liệu",
                                  },
                                ]}
                              >
                                <Select
                                  defaultValue="Chọn Kiểu Dữ Liệu "
                                  style={{
                                    width: 200,
                                  }}
                                  onChange={handleChange}
                                >
                                  {datatypes.map((i, index) => {
                                    return (
                                      <Option key={index} value={i.type}>
                                        {i.lable}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                name={[name, "check_not_null"]}
                                valuePropName="checked"
                              >
                                <Checkbox onChange={onChange}>
                                  Kiểm Tra Dữ Liệu Rỗng
                                </Checkbox>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "check_duplicate"]}
                                valuePropName="checked"
                              >
                                <Checkbox onChange={onChange}>
                                  Kiểm Tra Dữ Liệu Trùng
                                </Checkbox>
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Thêm cấu hình
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                  <Form.Item>
                    <Link to="/program">
                      <Button type="dashed">Quay Lại</Button>
                    </Link>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </div>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Kéo thả vị trí" key="2">
                <DragDropContext onDragEnd={handleDrop}>
                  <Droppable droppableId="list-container">
                    {(provided) => (
                      <div
                        className="list-container"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {initialState.columns === undefined
                          ? []
                          : initialState.columns.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    className="item-container"
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                  >
                                    <Form>
                                      <Space
                                        style={{
                                          display: "flex",
                                          marginBottom: 8,
                                        }}
                                        align="baseline"
                                      >
                                        <Form.Item
                                          name="column_name"
                                          rules={[
                                            {
                                              required: true,
                                              message: "Nhập Vào Tên Cột",
                                            },
                                          ]}
                                        >
                                          <Input
                                            placeholder="Tên Cột"
                                            defaultValue={item.column_name}
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          name="column_name_desc"
                                          rules={[
                                            {
                                              required: true,
                                              message: "Nhập Vào Mô Tả",
                                            },
                                          ]}
                                        >
                                          <Input
                                            placeholder="Mô Tả"
                                            defaultValue={item.column_name_desc}
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          name="data_type"
                                          rules={[
                                            {
                                              required: true,
                                              message: "Chọn Kiểu Dữ Liệu",
                                            },
                                          ]}
                                        >
                                          <Select
                                            defaultValue={item.data_type}
                                            style={{
                                              width: 200,
                                            }}
                                            onChange={handleChange}
                                          >
                                            {datatypes.map((i, index) => {
                                              return (
                                                <Option
                                                  key={index}
                                                  value={i.type}
                                                >
                                                  {i.lable}
                                                </Option>
                                              );
                                            })}
                                          </Select>
                                        </Form.Item>

                                        <Checkbox
                                          onChange={onChange}
                                          checked={
                                            item.check_not_null == 1
                                              ? true
                                              : false
                                          }
                                        >
                                          Kiểm Tra Dữ Liệu Rỗng
                                        </Checkbox>

                                        <Form.Item>
                                          <Checkbox
                                            onChange={onChange}
                                            checked={
                                              item.check_duplicate == 1
                                                ? true
                                                : false
                                            }
                                          >
                                            Kiểm Tra Dữ Liệu Trùng
                                          </Checkbox>
                                        </Form.Item>
                                      </Space>
                                    </Form>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <Link to="/program">
                  <Button type="dashed">Quay Lại</Button>
                </Link>
                <Button type="primary" onClick={onUpdate}>
                  Cập nhật vị trí
                </Button>
              </Tabs.TabPane>
            </Tabs>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ConfigImport;
