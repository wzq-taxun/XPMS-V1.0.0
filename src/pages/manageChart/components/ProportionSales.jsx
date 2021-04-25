import { Card, Radio, DatePicker } from 'antd';
import React, { useState } from 'react';
import { Pie } from './Charts';
import Yuan from '..//utils/Yuan';
import styles from '../style.less';
import { getTimeDistance } from '../utils/utils';
import { useEffect } from 'react';
import { getSaleRoomType } from '@/services/manageChart';
import Constants from '@/constans';

const { RangePicker } = DatePicker;

const ProportionSales = props => {
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('year'));
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = (start, end) => {
    if (!start) {
      const now = new Date();
      const year = now.getFullYear();
      start = year + '-01-01';
    }
    if (!end) {
      const now = new Date();
      const year = now.getFullYear();
      end = year + '-12-31';
    }
    getSaleRoomType({ start_date: start, end_date: end }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || {};
        setTotal(data.sale);
        setList(data.list);
      }
    });
  };

  const handleRangePickerChange = rangePickerValue => {
    setRangePickerValue(rangePickerValue);
    const start = rangePickerValue[0].format('YYYY-MM-DD');
    const end = rangePickerValue[1].format('YYYY-MM-DD');
    getData(start, end);
  };
  return (
    <Card
      // loading={loading}
      className={styles.salesCard}
      bordered={false}
      bodyStyle={{
        padding: '20px 20px 20px 0',
      }}
    >
      <div style={{ lineHeight: '30px', borderLeft: '2px solid red', paddingLeft: '10px' }}>
        <span>销售额类别占比</span>
        {/* <Radio.Group value={salesType} style={{ float: 'right' }} onChange={handleChangeSalesType}>
          <Radio.Button value="all">全部渠道</Radio.Button>
          <Radio.Button value="online">线上</Radio.Button>
          <Radio.Button value="stores">门店</Radio.Button>
        </Radio.Group> */}
        <RangePicker
          value={rangePickerValue}
          onChange={handleRangePickerChange}
          style={{
            width: 256,
            float: 'right',
          }}
        />
      </div>
      <Pie
        hasLegend
        subTitle="销售额"
        total={() => <Yuan>{total}</Yuan>}
        data={list}
        valueFormat={value => <Yuan>{value}</Yuan>}
        height={248}
        lineWidth={4}
      />
    </Card>
  );
};

export default ProportionSales;
