import { Table } from 'antd';
import { useEffect } from 'react';
import { getAuditTableData } from '@/services/audit';
import { useState } from 'react';
import Constants from '@/constans';

const RoomRatePreview = props => {
  const columns = [
    {
      title: '房型',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '房号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '姓名',
      dataIndex: 'reserve_name',
      key: 'reserve_name',
    },
    {
      title: '房价码',
      dataIndex: 'descr',
      key: 'descr',
    },
    {
      title: '定价',
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: '成交价',
      dataIndex: 'vrate',
      key: 'vrate',
    },
    {
      title: '包价',
      dataIndex: 'rate_package',
      key: 'rate_package',
    },
    {
      title: '实过房价',
      dataIndex: 'vroom_rate',
      key: 'vroom_rate',
    },
    {
      title: '到达',
      dataIndex: 'checkin_time',
      key: 'checkin_time',
    },
    {
      title: '离开',
      dataIndex: 'checkout_time',
      key: 'checkout_time',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
  ];

  useEffect(() => {
    if (props.url && props.id) {
      const param = { url: props.url, id: props.id };
      getAuditTableData(param).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          setList(rsp.data || []);
        }
      });
    }
  }, [props.url, props.id]);

  const [list, setList] = useState([]);

  return (
    <Table columns={columns} dataSource={list} rowKey="order_id" scroll={{ x: 'max-content' }} />
  );
};

export default RoomRatePreview;
