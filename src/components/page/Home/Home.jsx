import { useState, useEffect } from "react";
import styles from "../Home/Home.module.scss";
import classNames from "classnames/bind";
import { Carousel, Pagination, Button, Modal, Tag, Typography } from "antd";
import Menu from "../MenuComponent/Menu";
import image1 from "./img/image1.png";
import image2 from "./img/image2.png";
import image3 from "./img/image3.png";
import image4 from "./img/image4.png";
import imageCheck from "./img/check.png";
import imageWait from "./img/clock.png";
import imageWarning from "./img/warning.png";
import imageError from "./img/close.png";
import imageNotworking from "./img/5038308.png";
import StatusSecond from "./ifElse/StatusSecond";

import TableInfo from "../../TableDetail/TableInfo";
import { useDispatch, useSelector } from "react-redux";
import { getAllFileimport } from "../../redux/slice/ImportFileSlice";
import {getAllStatusFileimport} from '../../redux/slice/HomeStatusSlice'
import axios from "axios";
import { api } from "../../api/index.js";
const cx = classNames.bind(styles);
const { Text } = Typography;
function Home(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allFileImportStauts = useSelector((state) => state.home.listStatusFileImport);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const loadingListFileImport = () => {
    const fileList = async () => {
      setLoading(true);
      const result = await axios
        .get(api + `/import/list`)
        .then((response) => {
          setLoading(false);
          dispatch(getAllFileimport(response.data.data));
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fileList();
  };

  const loadingStatusFileImport = () => {
    const status = async () => {
      const result = await axios
        .get(api + "/import/report-dashboard")
        .then((response) => {
            dispatch(getAllStatusFileimport(response.data.data));
            console.log(response.data.data);
        })
        .catch((err) => {
            console.error(err);
        });
    };
    status();
  };

  useEffect(() => {
    loadingListFileImport();
    loadingStatusFileImport();
  }, []);

  const [detail, setDetail] = useState({});

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={cx("home")}>
      <Menu title="Trang Chủ" icon="bx bx-home-alt" />
      <div className={cx("slide_show_main")}>
        <Carousel autoplay>
          <div className={`${styles.slideshow} ${styles.slideshow_1}`}>
            <div className="row">
              <div className="col-sm-6" id={cx("toLeft")}>
                <img
                  src="https://mobifonemientay.vn/wp-content/uploads/2021/07/logo-mobifone-white-1.png"
                  className={cx("logoMobi_Home")}
                  alt=""
                />
                <div className={cx("Slide_Text")}>
                  <h4 className={cx("Slide_title")}>
                    Import Dữ Liệu Từ File Excel
                  </h4>
                  <h6 className={cx("Slide_title_caption")}>
                    Thao tác dễ dàng khi sử dụng , Lưu Hành Nội Bộ
                  </h6>
                </div>
              </div>
              <div className="col-sm-6" id={cx("toRight")}>
                <img src={image1} alt="" className={cx("Banner")} />
              </div>
            </div>
          </div>
          <div className={`${styles.slideshow} ${styles.slideshow_2}`}>
            <div className="row">
              <div className="col-sm-6" id={cx("toLeft")}>
                <img
                  src="https://mobifonemientay.vn/wp-content/uploads/2021/07/logo-mobifone-white-1.png"
                  className={cx("logoMobi_Home")}
                  alt=""
                />
                <div className={cx("Slide_Text")}>
                  <h4 className={cx("Slide_title")}>
                    Import Dữ Liệu Từ File Excel
                  </h4>
                  <h6 className={cx("Slide_title_caption")}>
                    Thao tác dễ dàng khi sử dụng , Lưu Hành Nội Bộ
                  </h6>
                </div>
              </div>
              <div className="col-sm-6" id={cx("toRight")}>
                <img src={image2} alt="" className={cx("Banner")} />
              </div>
            </div>
          </div>
          <div className={`${styles.slideshow} ${styles.slideshow_3}`}>
            <div className="row">
              <div className="col-sm-6" id={cx("toLeft")}>
                <img
                  src="https://mobifonemientay.vn/wp-content/uploads/2021/07/logo-mobifone-white-1.png"
                  className={cx("logoMobi_Home")}
                  alt=""
                />
                <div className={cx("Slide_Text")}>
                  <h4 className={cx("Slide_title")}>
                    Import Dữ Liệu Từ File Excel
                  </h4>
                  <h6 className={cx("Slide_title_caption")}>
                    Thao tác dễ dàng khi sử dụng , Lưu Hành Nội Bộ
                  </h6>
                </div>
              </div>
              <div className="col-sm-6" id={cx("toRight")}>
                <img src={image3} alt="" className={cx("Banner")} />
              </div>
            </div>
          </div>
          <div className={`${styles.slideshow} ${styles.slideshow_4}`}>
            <div className="row">
              <div className="col-sm-6" id={cx("toLeft")}>
                <img
                  src="https://mobifonemientay.vn/wp-content/uploads/2021/07/logo-mobifone-white-1.png"
                  className={cx("logoMobi_Home")}
                  alt=""
                />
                <div className={cx("Slide_Text")}>
                  <h4 className={cx("Slide_title")}>
                    Import Dữ Liệu Từ File Excel
                  </h4>
                  <h6 className={cx("Slide_title_caption")}>
                    Thao tác dễ dàng khi sử dụng , Lưu Hành Nội Bộ
                  </h6>
                </div>
              </div>
              <div className="col-sm-6" id={cx("toRight")}>
                <img src={image4} alt="" className={cx("Banner")} />
              </div>
            </div>
          </div>
        </Carousel>
      </div>

      <div className={cx("status_import_main")}>
        <div className={cx("status_title")}>
          <p>Trạng Thái Các File Đã Import </p>
        </div>
        <div className={cx("status_box")}>
          <div className="row justify-content-center" id={cx("itemList")}>

            {
                allFileImportStauts.map((value,index)=>{
                    return (
                        <div className="col-lg-3 col-md-12" key={index} style={{width : '20%'}}>
                        <div className={cx("status_tiem")}>
                          <div className={cx("status")}>
                            <img src={
                                value.status_id === 0 ? imageNotworking :
                                value.status_id === 1 ? imageWait : 
                                value.status_id === 2 ? imageWarning :
                                value.status_id === 3 ? imageCheck:
                                value.status_id === 4 ? imageError :""
                            } alt="" className={cx("iconCheck")} />
                            <p>{value.status_name}</p>
                          </div>
                          <div className={cx("qty_status")}>
                            <p>
                              {value.qty} <span>File Đã import</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                })
            }

       
          </div>
        </div>
      </div>

      <TableInfo />

      <Modal
        width={1000}
        title={`Thông Tin Của File ${detail.file}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="row" id={cx("modal")}>
          <div className="col-sm-3">
            <p>
              Tên File : <a href="">{detail.file}</a>
            </p>
            <p>
              Ngày Import: <Text type="success">{detail.thoigian}</Text>
            </p>
            <p>
              Người Import : <Text type="success">{detail.nguoiImport}</Text>
            </p>
            <p>
              Trạng Thái : <StatusSecond trangthai={detail.trangthai} />{" "}
            </p>
          </div>
          <div className="col-sm-3">
            <p>
              Tổng Số Dòng : <Text type="success">{detail.tongsodong}</Text>
            </p>
            <p>
              Thành Công : <Text type="success">{detail.thanhcong}</Text>
            </p>
            <p>
              Thất Bại : <Text type="danger">{detail.thatbai}</Text>
            </p>
          </div>
          {/* <div className={cx("table_detail")}>
            <TableDetail />
          </div> */}
        </div>
      </Modal>
    </div>
  );
}

export default Home;
