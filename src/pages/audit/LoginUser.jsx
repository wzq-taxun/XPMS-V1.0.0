import { Table } from 'antd';
import { useEffect } from 'react';
import { getAuditTableData } from '@/services/audit';
import { useState } from 'react';
import Constants from '@/constans';

const LoginUser = props => {
  const columns = [
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '站点IP',
      dataIndex: 'login_ip',
      key: 'login_ip',
    },
    {
      title: '登陆时间',
      dataIndex: 'login_time',
      key: 'login_time',
    },
    {
      title: '营业日',
      dataIndex: 'audit_date',
      key: 'audit_date',
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

export default LoginUser;
