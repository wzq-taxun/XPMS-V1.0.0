import { Table } from 'antd';
import { useEffect } from 'react';
import { getAuditTableData } from '@/services/audit';
import { useState } from 'react';
import Constants from '@/constans';

const MemberValidity = props => {
  const columns = [
    {
      title: '会员卡号',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '开始时间',
      dataIndex: 'start',
      key: 'start',
    },
    {
      title: '截止时间',
      dataIndex: 'end',
      key: 'end',
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

export default MemberValidity;
