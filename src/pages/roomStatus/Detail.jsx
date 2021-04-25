import { Component } from 'react';
import styles from './style.less';
import classNames from 'classnames';
import { getOrderById } from '@/services/order';
import Constants from '@/constans';

class Detail extends Component {
  state = {
    orderInfo: {},
  };

  componentDidMount() {
    getOrderById(this.props.orderInfoId).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || {};
        this.setState({ orderInfo: data });
      }
    });
  }

  render() {
    let className = styles.hoverInfo;
    if (this.props.left && this.props.top) {
      className = classNames(styles.hoverInfoLeft, styles.hoverInfoTop, styles.hoverInfo);
    } else if (this.props.left) {
      className = classNames(styles.hoverInfoLeft, styles.hoverInfo);
    } else if (this.props.top) {
      className = classNames(styles.hoverInfoTop, styles.hoverInfo);
    }
    return (
      <div
        // className={
        //   this.props.left ? classNames(styles.hoverInfoLeft, styles.hoverInfo) : styles.hoverInfo
        // }
        className={className}
      >
        <div className={styles.hiContent}>
          <div>
            <span>房号:</span>
            <span>{this.state.orderInfo.room_no}</span>
          </div>
          <div>
            <span>房型:</span>
            <span>{this.state.orderInfo.room_type}</span>
          </div>
          <div>
            <span>客房状态:</span>
            <span>{this.state.orderInfo.status}</span>
          </div>
          <div>
            <span>订单号:</span>
            <span>{this.state.orderInfo.order_no}</span>
          </div>
          <div>
            <span>订单来源:</span>
            <span>{this.state.orderInfo.source}</span>
          </div>
          <div>
            <span>入住人:</span>
            <span>{this.state.orderInfo.reserve_name}</span>
          </div>
          <div>
            <span>手机号:</span>
            <span>{this.state.orderInfo.reserve_tel}</span>
          </div>
          <div>
            <span>入住时间:</span>
            <span>{this.state.orderInfo.checkin_time}</span>
          </div>
          <div>
            <span>退房时间:</span>
            <span>{this.state.orderInfo.checkout_time}</span>
          </div>
          <div>
            <span>入住天数:</span>
            <span>{this.state.orderInfo.days_num}</span>
            <span>入住类型:</span>
            <span>{this.state.orderInfo.order_type}</span>
          </div>
          <div>
            <span>房价:</span>
            <span>{this.state.orderInfo.room_rate}</span>
            <span>实付款：</span>
            <span>{this.state.orderInfo.room_reality_rate}</span>
          </div>
          {/* <div>
            <span>连房:</span>
            <span>3025</span>
          </div> */}
          <div>
            <span>备注:</span>
            <span>{this.state.orderInfo.order_desc}</span>
          </div>
        </div>
        {/* <div className={styles.hiFooter}>
          <button>日志</button>
          <button>换房</button>
          <button>续住</button>
        </div> */}
      </div>
    );
  }
}

export default Detail;
