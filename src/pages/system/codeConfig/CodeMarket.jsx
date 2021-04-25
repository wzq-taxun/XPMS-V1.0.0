import { getMarket } from '@/services/checkIn';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Popconfirm, message } from 'antd';
import MarketModal from './MarketModal';
import { useState } from 'react';
import { useRef } from 'react';
import { updateMarket } from '@/services/system/codeConfig';
import Constants from '@/constans';

const CodeMarket = props => {
  const columns = [
    {
      title: '代码',
      dataIndex: 'market_code',
      key: 'market_code',
    },
    {
      title: '中文描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '退房时间',
      dataIndex: 'default_checkout_time',
      key: 'default_checkout_time',
    },
    {
      title: '会员等级',
      dataIndex: 'member_level_description',
      key: 'member_level_description',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '排序',
      dataIndex: 'line_up',
      key: 'line_up',
    },
    // {
    //   title: '有效',
    //   dataIndex: 'valid',
    //   key: 'valid',
    //   valueEnum: {
    //     '0': {
    //       text: '无效',
    //     },
    //     '1': {
    //       text: '有效',
    //     },
    //   },
    // },
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
    },
  ];

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
    updateMarket([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(function(rsp) {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const [modalVis, setModalVis] = useState(false);
  const [add, setAdd] = useState(false);
  const [formValues, setFormValues] = useState();
  const actionRef = useRef();

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
        request={() => getMarket()}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />

      <MarketModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />
    </>
  );
};

export default CodeMarket;
