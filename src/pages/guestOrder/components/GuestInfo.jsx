import styles from './style.less';
import moment from 'moment';

const GuestInfo = props => {
  const { orderInfo, guests } = props;
  let name = orderInfo.reserve_name;
  let phone = orderInfo.reserve_tel;
  if (guests && guests.length > 0) {
    name = '';
    phone = '';
    guests.map(item => {
      if (item.name) {
        name = '|' + item.name;
      }
      if (item.phone) {
        phone = '|' + item.phone_number;
      }
    });
    if (name.startsWith('|')) {
      name = name.substring(1);
    }

    if (phone.startsWith('|')) {
      phone = phone.substring(1);
    }

    if (!name) {
      name = orderInfo.reserve_name;
    }
    if (!phone) {
      phone = orderInfo.reserve_tel;
    }

    // name = guests[0].name || name;
    // phone = guests[0].phone_number || phone;
  }
  return (
    <>
      <div className={styles.infoTitle}>住客信息</div>
      <div className={styles.infoContain}>
        <div>
          <span>姓&emsp;&emsp;名：</span>
          <span>{name}</span>
        </div>
        <div>
          <span>手机号码：</span>
          <span>{phone}</span>
        </div>
        {props.orderInfo.status == 'R' && (
          <>
            <div>
              <span>到&emsp;&emsp;达：</span>
              <span>
                {orderInfo.checkin_time && moment(orderInfo.checkin_time).format('MM-DD HH:mm')}
              </span>
            </div>
            <div>
              <span>保&emsp;&emsp;留：</span>
              <span>
                {orderInfo.retain_time && moment(orderInfo.retain_time).format('MM-DD HH:mm')}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GuestInfo;
