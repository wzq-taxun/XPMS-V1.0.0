import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { useState, useEffect } from 'react';
import numeral from 'numeral';
import { Bar } from './Charts';
import styles from '../style.less';
import StackedBar from './Charts/Bar/StackedBar';
import { getSaleMarket } from '@/services/manageChart';
import { getTimeDistance } from '../utils/utils';
import Constants from '@/constans';

const { RangePicker } = DatePicker;

const SalesCard = props => {
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('year'));
  const [list, setList] = useState([]);
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
    getSaleMarket({ start_date: start, end_date: end }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setList(list);
      }
    });
  };

  const isActive = type => {
    const value = getTimeDistance(type);

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  const handleRangePickerChange = rangePickerValue => {
    setRangePickerValue(rangePickerValue);
    const start = rangePickerValue[0].format('YYYY-MM-DD');
    const end = rangePickerValue[1].format('YYYY-MM-DD');
    getData(start, end);
  };

  const selectDate = type => {
    const rangePickerValue = getTimeDistance(type);
    setRangePickerValue(rangePickerValue);
    const start = rangePickerValue[0].format('YYYY-MM-DD');
    const end = rangePickerValue[1].format('YYYY-MM-DD');
    getData(start, end);
  };

  return (
    <Card
      // loading={loading}
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.salesCard}>
        <div className={styles.header}>
          <div className={styles.title}>销售额</div>
          <div className={styles.salesFilter}>
            <div className={styles.salesChoose}>
              <a className={isActive('today')} onClick={() => selectDate('today')}>
                今日
              </a>
              <a className={isActive('week')} onClick={() => selectDate('week')}>
                本周
              </a>
              <a className={isActive('month')} onClick={() => selectDate('month')}>
                本月
              </a>
              <a className={isActive('year')} onClick={() => selectDate('year')}>
                全年
              </a>
            </div>
            <RangePicker
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              style={{
                width: 256,
              }}
            />
          </div>
        </div>

        <div className={styles.salesBar}>
          <StackedBar height={295} data={list} />
        </div>
      </div>
    </Card>
  );
};

export default SalesCard;
