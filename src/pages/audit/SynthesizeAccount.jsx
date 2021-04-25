import { Table } from 'antd';
import { useEffect } from 'react';
import { getAuditTableData } from '@/services/audit';
import { useState } from 'react';
import Constants from '@/constans';

const SynthesizeAccount = props => {
  const columns = [
    {
      title: '订单ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: '房号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
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

  return <Table columns={columns} dataSource={list} rowKey="id" />;
};

export default SynthesizeAccount;
