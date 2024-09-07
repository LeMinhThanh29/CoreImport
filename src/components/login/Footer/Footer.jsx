import React from 'react';
import '../Scss/Footer.scss'
import logoMobi from '../img/Mobifone_logo.svg.png'
function Footer() {
    return (
        <>
            <div className="footer">
                <div className="container" >
                    <div className="row" >
                        <div className="col-12 col-md-3 col-sm-12">

                            <img src={logoMobi} width="250px" alt="" />


                        </div>
                        <div className="col-12 col-md-9 col-sm-12">
                            <p className="fs-5">Thông Tin Liên Hệ</p>

                            <div className="row">
                                <div className="col-6">
                                    <div>
                                        <h6>CÔNG TY DỊCH VỤ MOBIFONE KHU VỰC 9 </h6>
                                        <p>
                                            <img src="https://img.icons8.com/ios-filled/20/E67E22/marker.png" />
                                            Tòa nhà MobiFone, đường số 22, Khu CTXD 8, P. Hưng Thạnh ,Q. Cái Răng
                                            Tp. Cần Thơ</p>
                                        <p><img src="https://img.icons8.com/ios-filled/20/E67E22/apple-phone.png" /> 0292 3765 211</p>
                                    </div>
                                    <div>
                                        <h6>Công ty Dịch vụ MobiFone khu vực 1</h6>
                                        <p>
                                            <img src="https://img.icons8.com/ios-filled/20/E67E22/marker.png" />
                                            Tòa nhà MobiFone - Duy Tân, số 5/82 đường Duy Tân, Quận Cầu Giấy, TP. Hà Nội</p>
                                        <p><img src="https://img.icons8.com/ios-filled/20/E67E22/apple-phone.png" />(0236) 3710 999</p>
                                    </div>
                                    <div>
                                        <h6>Công ty Dịch vụ MobiFone khu vực 2</h6>
                                        <p>
                                            <img src="https://img.icons8.com/ios-filled/20/E67E22/marker.png" />
                                            MM 18, đường Trường Sơn, phường 14, Quận 10, TP. HCM.</p>
                                        <p><img src="https://img.icons8.com/ios-filled/20/E67E22/apple-phone.png" />0901759222</p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div>
                                        <h6>Công ty Dịch vụ MobiFone khu vực 3</h6>
                                        <p>
                                            <img src="https://img.icons8.com/ios-filled/20/E67E22/marker.png" />
                                            Số 586 Nguyễn Hữu Thọ, phường Khuê Trung, quận Cẩm Lệ, thành phố Đà Nẵng.</p>
                                        <p><img src="https://img.icons8.com/ios-filled/20/E67E22/apple-phone.png" />028 62523434/0901 660 002</p>
                                    </div>
                                    <div>
                                        <h6>Công ty Dịch vụ MobiFone khu vực 4</h6>
                                        <p>
                                            <img src="https://img.icons8.com/ios-filled/20/E67E22/marker.png" />
                                            Khu Đồng Mạ, đường Nguyễn Tất Thành, phường Tiên Cát, TP Việt Trì, tỉnh Phú Thọ.</p>
                                        <p><img src="https://img.icons8.com/ios-filled/20/E67E22/apple-phone.png" />(0262) 355 5678/0913493777</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Footer;