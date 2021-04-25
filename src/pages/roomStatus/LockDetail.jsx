import { Component } from 'react';
import styles from './style.less';
import classNames from 'classnames';
import Constants from '@/constans';
import { getRoomLockDetail } from '@/services/rooms';

class LockDetail extends Component {
  state = {
    lock: {},
  };

  componentDidMount() {
    getRoomLockDetail(this.props.room_no_id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || {};
        this.setState({ lock: data });
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
      <div className={className}>
        <div className={styles.hiContent}>
          <div>
            <span>房号:</span>
            <span>{this.props.room_no}</span>
          </div>
          <div>
            <span>房型:</span>
            <span>{this.props.room_type}</span>
          </div>
          <div>
            <span>客房状态:</span>
            <span>{this.props.status}</span>
          </div>
          <div>
            <span>原因:</span>
            <span>{this.state.lock.description}</span>
          </div>
          <div>
            <span>开始时间:</span>
            <span>{this.state.lock.date_start}</span>
          </div>
          <div>
            <span>结束时间:</span>
            <span>{this.state.lock.date_end}</span>
          </div>
          <div>
            <span>操作人:</span>
            <span>{this.state.lock.username}</span>
          </div>
          <div>
            <span>操作时间:</span>
            <span>{this.state.lock.create_time}</span>
          </div>
          <div>
            <span>备注:</span>
            <span>{this.state.lock.memo}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default LockDetail;
