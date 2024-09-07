import { Tag } from 'antd';
import {
    ClockCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';

function Status(props) {
    const {trangthai,ketqua} = props;
    return (
        <>
            {
            trangthai == 3 ? <Tag icon={<CloseCircleOutlined />} color="error">
                 error
             </Tag> : trangthai == 0 ? <Tag icon={<ClockCircleOutlined />} color="default">
                 Chờ Xử Lý
             </Tag> : trangthai == 1 ? <Tag icon={<SyncOutlined spin />} color="processing">
                 Đang Xử Lý
             </Tag> : ketqua
            }
        </>
    );
}

export default Status;