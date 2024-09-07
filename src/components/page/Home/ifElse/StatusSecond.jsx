import { Tag } from 'antd';
import {
    ClockCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

function StatusSecond(props) {
    const { trangthai } = props;
    return (
        <>
            {
                trangthai == 0 ? <Tag icon={<ClockCircleOutlined />} color="default">
                    Chờ Xử Lý
                </Tag>
                    : trangthai == 1 ? <Tag icon={<SyncOutlined spin />} color="processing">
                        Đang Xử Lý
                    </Tag> : trangthai == 2 ? <Tag icon={<CheckCircleOutlined />} color="success">
                        Đã Xử Lý
                    </Tag> : <Tag icon={<CloseCircleOutlined />} color="error">
                        Xử Lý Lỗi
                    </Tag>
            }
        </>
    );
}

export default StatusSecond;