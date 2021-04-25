import ProTable from '@ant-design/pro-table';
import { getAccountType } from '@/services/order';
import { Divider, Popconfirm, message, Button } from 'antd';
import { useRef, useState } from 'react';
import Constants from '@/constans';
import AccountModal from './AccountModal';
import { updateCodeAccount } from '@/services/system/codeConfig';

const CodeAccount = props => {
  const columns = [
    {
      title: '代码',
      dataIndex: 'account_code',
      key: 'account_code',
    },
    {
      title: '中文描述',
      dataIndex: 'description',
      key: 'description',
    },
    // {
    //   title: '英文',
    //   dataIndex: 'description_en',
    //   key: 'description_en',
    // },
    {
      title: '类型',
      dataIndex: 'account_type',
      key: 'account_type',
      valueEnum: {
        XF: {
          text: '消费',
        },
        FK: {
          text: '付款',
        },
        TK: {
          text: '退款',
        },
        YS: {
          text: '应收',
        },
      },
    },
    {
      title: '小类',
      dataIndex: 'account_detail_type',
      key: 'account_detail_type',
    },
    {
      title: '借贷方',
      dataIndex: 'credit_debit',
      key: 'credit_debit',
      valueEnum: {
        '1': {
          text: '贷方',
        },
        '2': {
          text: '借方',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '有效期起始',
      dataIndex: 'date_start',
      key: 'date_start',
    },
    {
      title: '有效期截止',
      dataIndex: 'date_end',
      key: 'date_end',
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
      title: '操作',
      key: 'action',
      width: 160,
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleUpdateRow(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => handleDeleteRow(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
      hideInSearch: true,
    },
  ];

  const actionRef = useRef();
  const [modalVis, setModalVis] = useState(false);
  const [add, setAdd] = useState(false);
  const [formValues, setFormValues] = useState();

  const handleAdd = () => {
    setFormValues(null);
    setAdd(true);
    setModalVis(true);
  };

  const handleUpdateRow = record => {
    setFormValues(record);
    setAdd(false);
    setModalVis(true);
  };

  const handleDeleteRow = record => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    updateCodeAccount([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const handleCancel = refush => {
    setModalVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        search={false}
        request={() => getAccountType()}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />

      <AccountModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />
    </>
  );
};

export default CodeAccount;
