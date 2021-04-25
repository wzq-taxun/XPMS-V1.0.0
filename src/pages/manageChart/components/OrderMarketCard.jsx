import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { Bar } from './Charts';
import styles from '../style.less';
import StackedBar from './Charts/Bar/StackedBar';
import { useEffect } from 'react';
import { getOrderMarket } from '@/services/manageChart';
import Constants from '@/constans';
import { useState } from 'react';
import { getTimeDistance } from '../utils/utils';

const { RangePicker } = DatePicker;

const OrderMarketCard = props => {
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
    getOrderMarket({ start_date: start, end_date: end }).then(rsp => {
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
          <div className={styles.title}>订单市场</div>
          <div className={styles.salesFilter}>
            <div className={styles.salesChoose}>
              <a className={isActive('firstHalfYear')} onClick={() => selectDate('firstHalfYear')}>
                上半年
              </a>
              <a className={isActive('lastHalfYear')} onClick={() => selectDate('lastHalfYear')}>
                下半年
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

export default OrderMarketCard;
