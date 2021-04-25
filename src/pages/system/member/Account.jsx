import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { getMemberAccount } from '@/services/account';
import { router } from 'umi';
import styles from './style.less';
import { useState } from 'react';

const Account = props => {
  const columns = [
    // {
    //   title: '会员编号',
    //   dataIndex: 'member_no',
    // },
    {
      title: '会员卡卡号',
      dataIndex: 'card_no',
    },
    // {
    //   title: '姓名',
    //   dataIndex: 'name',
    // },
    // {
    //   title: '证件类型',
    //   dataIndex: 'credential_type',
    //   hideInSearch: true,
    // },
    // {
    //   title: '证件号',
    //   dataIndex: 'credential_no',
    // },
    // {
    //   title: '电话',
    //   dataIndex: 'phone',
    // },
    {
      title: '账项代码',
      dataIndex: 'account_code',
    },
    {
      title: '账项描述',
      dataIndex: 'description',
    },
    {
      title: '账项小类',
      dataIndex: 'account_detail_type',
    },
    {
      title: '金额',
      dataIndex: 'charge',
    },
    {
      title: '房号',
      dataIndex: 'room_no',
    },
    {
      title: '付款单号',
      dataIndex: 'pay_account_no',
    },
    {
      title: '发生时间',
      dataIndex: 'generate_time',
    },
    // {
    //   title: '工作班次',
    //   dataIndex: 'work_shift',
    // },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        '1': {
          text: '正常',
        },
        '2': {
          text: '结账',
        },
        '3': {
          text: '挂账',
        },
        '4': {
          text: '冲账',
        },
        '5': {
          text: '锁定',
        },
        '6': {
          text: '挂S账',
        },
      },
    },
    {
      title: '有效',
      dataIndex: 'valid',
      key: 'valid',
      valueEnum: {
        '0': {
          text: '无效',
        },
        '1': {
          text: '有效',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },
    {
      title: '操作人',
      dataIndex: 'operate_user_name',
    },
  ];

  const [columnsStateMap, setColumnsStateMap] = useState({
    card_no: { show: false },
    account_code: { show: false },
    account_detail_type: { show: false },
    valid: { show: false },
    status: { show: false },
  });

  return (
    <ProTable
      search={false}
      columns={columns}
      rowKey="id"
      headerTitle={props.member && props.member.name + '/' + props.member.member_no}
      request={() => getMemberAccount(props.member.member_info_id)}
      //   scroll={{ x: 'max-content' }}
      toolBarRender={(action, { selectedRows }) => [
        <Button
          onClick={() => {
            props.handleBack();
          }}
        >
          返回
        </Button>,
      ]}
      rowClassName={styles.rowSty}
      columnsStateMap={columnsStateMap}
      onColumnsStateChange={map => {
        setColumnsStateMap(map);
      }}
      onRow={record => {
        return {
          onClick: e => {
            if (record.order_info_id) {
              router.push({ pathname: 'orderDetail', query: { orderId: record.order_info_id } });
            }
          },
        };
      }}
    />
  );
};

export default Account;
