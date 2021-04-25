import styles from './style.less';
import { Row, Col } from 'antd';
import Dict from '@/dictionary';

const Header = props => {
  const { orderInfo } = props;
  const { days_num, hours_num } = orderInfo;
  let daysShow = '';
  // if (days_num == 0) {
  if (orderInfo.order_type_id == Dict.hourTypeId) {
    daysShow = hours_num + '小时';
  } else {
    daysShow = days_num + '天';
  }
  return (
    <Row className={styles.header}>
      <Col span={8}>
        <span className={orderInfo.status == 'RG' ? styles.typeIconRG : styles.typeIcon}>
          {orderInfo.status}
        </span>
        <h2 className={styles.top} style={{ borderRight: 0 }}>
          {orderInfo.reserve_name}
        </h2>
        <h3 style={{ borderRight: 0 }}>{orderInfo.reserve_tel}</h3>
      </Col>
      <Col span={4} style={{ textAlign: 'center' }}>
        <h3 className={styles.top}>房号</h3>
        <h2> {orderInfo.room_no}</h2>
      </Col>
      <Col span={4} style={{ textAlign: 'center' }}>
        <h3 className={styles.top}>
          {orderInfo.order_type_id == Dict.hourTypeId ? '入住小时' : '入住天数'}
        </h3>
        <h2>{daysShow}</h2>
      </Col>
      <Col span={4} style={{ textAlign: 'center' }}>
        <h3 className={styles.top}>房型</h3>
        <h2>{orderInfo.room_type}</h2>
      </Col>
      <Col span={4} style={{ textAlign: 'center' }}>
        <h3 className={styles.top} style={{ borderRight: 0 }}>
          类型
        </h3>
        <h2 style={{ borderRight: 0 }}>{orderInfo.guest_type}</h2>
      </Col>
    </Row>
  );
};

export default Header;
