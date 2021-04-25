import { Card } from 'antd';
import React from 'react';
import { TimelineChart } from './Charts';
import styles from '../style.less';

const SalesDistribution = ({ loading, offlineData, offlineChartData, handleTabChange }) => (
  <Card
    loading={loading}
    title='销售分布'
    className={styles.offlineCard}
    bordered={false}
    style={{
      marginTop: 32,
    }}
  >
    <TimelineChart
      height={400}
      data={offlineChartData}
      titleMap={{
        y1: '今日',
        y2: '昨日',
      }}
    />
  </Card>
);

export default SalesDistribution;
