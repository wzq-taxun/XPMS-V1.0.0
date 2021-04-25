import { Component } from 'react';
import styles from './style.less';
import classNames from 'classnames';
import Constants from '@/constans';
import { getRoomMaintainDetail } from '@/services/rooms';

class MaintainDetail extends Component {
  state = {
    maintain: {},
  };

  componentDidMount() {
    getRoomMaintainDetail(this.props.room_no_id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || {};
        this.setState({ maintain: data });
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
            <span>{this.state.maintain.description}</span>
          </div>
          <div>
            <span>开始时间:</span>
            <span>{this.state.maintain.date_start}</span>
          </div>
          <div>
            <span>结束时间:</span>
            <span>{this.state.maintain.date_end}</span>
          </div>
          <div>
            <span>操作人:</span>
            <span>{this.state.maintain.username}</span>
          </div>
          <div>
            <span>操作时间:</span>
            <span>{this.state.maintain.create_time}</span>
          </div>
          <div>
            <span>备注:</span>
            <span>{this.state.maintain.memo}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default MaintainDetail;
