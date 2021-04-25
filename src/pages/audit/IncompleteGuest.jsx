import { Table } from 'antd';
import { useEffect } from 'react';
import { getAuditTableData } from '@/services/audit';
import { useState } from 'react';
import Constants from '@/constans';
import styles from './style.less';
import { router } from 'umi';

const IncompleteGuest = props => {
  const columns = [
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
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: '证件号',
      dataIndex: 'credential_no',
      key: 'credential_no',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
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

  const handleRowClick = record => {
    router.push({
      pathname: 'orderDetail',
      query: { orderId: record.order_id },
    });
  };

  return (
    <Table
      columns={columns}
      dataSource={list}
      rowKey="guest_id"
      rowClassName={styles.rowSty}
      scroll={{ x: 'max-content' }}
      onRow={record => {
        return {
          onClick: e => {
            handleRowClick(record);
          },
        };
      }}
    />
  );
};

export default IncompleteGuest;
