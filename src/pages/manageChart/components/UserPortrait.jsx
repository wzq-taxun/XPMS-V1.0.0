import { Card, Col, Icon, Row, Table, Tooltip } from 'antd';
import React from 'react';
import styles from '../style.less';
import { Pie } from './Charts';
import Yuan from '../utils/Yuan';
import man from '@/assets/man.svg';
import woman from '@/assets/woman.svg';
import GuestFeaturePie from './Charts/Pie/GuestFeaturePie';

const UserPortrait = ({ loading, userData, geomLabel }) => (
  <Card
    loading={loading}
    bordered={false}
    // title="用户画像"
    bodyStyle={{
      padding: '20px 20px 20px 0',
    }}
  >
    <div style={{ lineHeight: '30px', borderLeft: '2px solid red', paddingLeft: '10px' }}>
      用户画像
    </div>
    <GuestFeaturePie
      hasLegend
      data={userData}
      height={248}
      lineWidth={1}
      geomLabel={geomLabel}
      inner={0}
    />
  </Card>
);

export default UserPortrait;
