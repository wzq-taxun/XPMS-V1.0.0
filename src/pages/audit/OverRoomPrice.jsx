import { Table } from 'antd';
import { useEffect } from 'react';
import { getAuditTableData } from '@/services/audit';
import { useState } from 'react';
import Constants from '@/constans';

const OverRoomPrice = props => {
  const columns = [
    {
      title: '房价码',
      dataIndex: 'room_rate_code',
      key: 'room_rate_code',
    },
    {
      title: '描述',
      dataIndex: 'room_rate_name',
      key: 'room_rate_name',
    },
    {
      title: '开始时间',
      dataIndex: 'date_start',
      key: 'date_start',
    },
    {
      title: '截止时间',
      dataIndex: 'validate_date',
      key: 'validate_date',
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

  return <Table columns={columns} dataSource={list} rowKey="expire_table_id" />;
};

export default OverRoomPrice;
