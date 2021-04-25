import moment from 'moment';
import styles from './style.less';
import Dict from '@/dictionary';

const OrderInfo = props => {
  const { orderInfo } = props;
  const { days_num, hours_num, status, order_type_id } = orderInfo;
  let daysShow = '';
  // if (days_num == 0) {
  //   daysShow = hours_num + '小时';
  // } else {
  //   daysShow = days_num + '天';
  // }

  if (order_type_id == Dict.orderType[1].id) {
    daysShow = hours_num + '小时';
  } else {
    daysShow = days_num + '天';
  }
  let arriveText = '入住日期：';
  if (status == 'R') {
    arriveText = '到达日期：';
  }

  return (
    <>
      <div className={styles.infoTitle}>{status == 'R' ? '预定信息' : '入住信息'}</div>
      <div className={styles.infoContain}>
        <div>
          <span>类&emsp;&emsp;型：</span>
          <span>{orderInfo.order_type}</span>
        </div>
        <div>
          <span>{order_type_id == Dict.orderType[1].id ? '入住小时：' : '入住天数：'}</span>
          <span>{daysShow}</span>
        </div>
        <div>
          <span>{arriveText}</span>
          <span>
            {orderInfo.checkin_time && moment(orderInfo.checkin_time).format('MM-DD HH:mm')}
          </span>
        </div>
        <div>
          <span>退房日期：</span>
          <span>
            {orderInfo.checkout_time && moment(orderInfo.checkout_time).format('MM-DD HH:mm')}
          </span>
        </div>
        <div>
          <span>房&emsp;&emsp;型：</span>
          <span>{orderInfo.room_type}</span>
        </div>
        {status == 'R' && (
          <div>
            <span>房&emsp;&emsp;数：</span>
            <span>{orderInfo.room_nums}</span>
          </div>
        )}
        {status == 'I' && (
          <div>
            <span>房&emsp;&emsp;号：</span>
            <span>{orderInfo.room_no}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderInfo;
