import styles from './statisticsCard.less';
import { Component } from 'react';
import Yuan from '../Yuan';
import { Icon } from 'antd';

class StatisticsCard extends Component {
  render() {
    const { bg, title, total, sale, today } = this.props;
    return (
      <div style={{ backgroundImage: `url(${bg})`, height: '125px' }}>
        <div className={styles.header}>
          <span>{title}</span>
        </div>
        <div className={styles.content}>
          <Yuan className={styles.total}>{today}</Yuan>
          <span className={styles.unit}>元</span>
        </div>

        <div className={styles.footer}>
          <span>本月销售额</span>
          <Yuan className={styles.daySale}>{total}</Yuan>
          <span>元</span>
        </div>
      </div>
    );
  }
}

export default StatisticsCard;
