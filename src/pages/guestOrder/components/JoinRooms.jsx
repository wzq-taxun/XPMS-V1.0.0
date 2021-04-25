import { unJoinRoom } from '@/services/order';
import { Modal } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import styles from '../style.less';
const { confirm } = Modal;

const JoinRooms = props => {
  const handleClickJoin = (orderId, e) => {
    e.stopPropagation();
    router.push({ pathname: 'orderDetail', query: { orderId: orderId } });
  };

  const handleUnJoin = (item, e) => {
    e.stopPropagation();
    confirm({
      title: '退出联房?',
      content: '确认退出联房?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          unJoinRoom(item).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
          });
        }
      },
    });
  };

  return (
    <>
      <div className={styles.infoTitle}>联房</div>
      <div className={styles.infoContain}>
        {props.joinRooms && props.joinRooms.length > 1 && (
          <ul className={styles.joinUl}>
            {props.joinRooms.map(item => (
              <li
                key={item.id}
                className={item.order_info_id == props.orderInfo.id ? styles.active : null}
                onClick={e => handleClickJoin(item.order_info_id, e)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '2px 4px',
                }}
              >
                <span>
                  {item.room_no
                    ? item.is_mianroom == '1'
                      ? `${item.room_no}(房)(主) ${item.status}`
                      : `${item.room_no}(房) ${item.status}`
                    : `${item.order_no}(单) ${item.status}`}
                </span>
                <span onClick={e => handleUnJoin(item, e)}>X</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(JoinRooms);
