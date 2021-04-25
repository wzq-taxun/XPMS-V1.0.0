import { Table } from 'antd';
import { useEffect } from 'react';
import { getAuditTableData } from '@/services/audit';
import { useState } from 'react';
import Constants from '@/constans';
import styles from './style.less';
import { router } from 'umi';

const AccountUnSettle = props => {
  const columns = [
    {
      title: '房型',
      dataIndex: 'type_name',
      key: 'type_name',
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
      title: '订单类型',
      dataIndex: 'descr',
      key: 'descr',
    },
    {
      title: '到达时间',
      dataIndex: 'checkin_time',
      key: 'checkin_time',
    },
    {
      title: '离开时间',
      dataIndex: 'checkout_time',
      key: 'checkout_time',
    },
    {
      title: '是否有账',
      dataIndex: 'has_account',
      key: 'has_account',
      render: text => {
        if (text == '1') {
          return '有';
        } else {
          return '无';
        }
      },
    },
    {
      title: '协议单位',
      dataIndex: 'company_name',
      key: 'company_name',
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
      rowKey="order_id"
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

export default AccountUnSettle;
