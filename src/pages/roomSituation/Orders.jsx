import Constants from '@/constans';
import { getRoomType } from '@/services/checkIn';
import { useEffect, useRef, useState } from 'react';
import styles from './style.less';

const { getOrderday } = require('@/services/order');
const { default: ProTable } = require('@ant-design/pro-table');
const { Modal, Button } = require('antd');

const Orders = props => {
  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
    },
    {
      title: '房号',
      dataIndex: 'room_no',
      hideInSearch: true,
    },
    {
      title: '房型',
      dataIndex: 'room_type_id',
      render: (text, record) => record.room_name,
      valueEnum: props.roomTypeEnum,
    },
    {
      title: '预订人',
      dataIndex: 'reserve_name',
      hideInSearch: true,
    },
    {
      title: '入住人',
      dataIndex: 'guest_name',
      hideInSearch: true,
    },
    {
      title: '到店时间',
      dataIndex: 'checkin_time',
      hideInSearch: true,
    },
    {
      title: '离店时间',
      dataIndex: 'checkout_time',
      hideInSearch: true,
    },
  ];

  const actionRef = useRef();

  useEffect(() => {
    if (props.visible) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }, [props.visible]);

  return (
    <Modal
      visible={props.visible}
      title="订单列表"
      width={1000}
      onCancel={() => props.handleCancel()}
      footer={
        <Button type="primary" onClick={e => props.handleCancel()}>
          关闭
        </Button>
      }
    >
      <ProTable
        columns={columns}
        actionRef={actionRef}
        rowKey="order_no"
        className={styles.myProtable}
        request={param => getOrderday({ ...param, day: props.orderDay })}
        // search={false}
        size="small"
      />
    </Modal>
  );
};

export default Orders;
