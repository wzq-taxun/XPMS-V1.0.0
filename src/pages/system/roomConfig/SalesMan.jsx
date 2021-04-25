import ProTable from '@ant-design/pro-table';
import { useState, useRef } from 'react';
import { Button, message, Divider, Popconfirm } from 'antd';
import Constants from '@/constans';
import { getSalesMan } from '@/services/checkIn';
import SalesManModal from './SalesManModal';
import moment from 'moment';
import { updateSalesMan } from '@/services/system/codeConfig';

const SalesMan = props => {
  const columns = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '全职',
      dataIndex: 'is_fulltime',
      key: 'is_fulltime',
      valueEnum: {
        0: {
          text: '否',
        },
        1: {
          text: '是',
        },
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      valueEnum: {
        1: {
          text: '男',
        },
        2: {
          text: '女',
        },
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      key: 'birthday',
      render: (text, record) => {
        return (record.birthday && moment(record.birthday).format('YYYY-MM-DD')) || '-';
      },
    },
    {
      title: '加入日期',
      dataIndex: 'join_date',
      key: 'join_date',
      render: (text, record) => {
        return (record.join_date && moment(record.join_date).format('YYYY-MM-DD')) || '-';
      },
    },
    {
      title: '电话',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '传真',
      dataIndex: 'fax',
      key: 'fax',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '地址1',
      dataIndex: 'address1',
      key: 'address1',
    },
    {
      title: '地址2',
      dataIndex: 'address2',
      key: 'address2',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '有效',
      dataIndex: 'valid',
      key: 'valid',
      valueEnum: {
        0: {
          text: '无效',
        },
        1: {
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
            <Popconfirm title="是否要删除此销售员？" onConfirm={() => handleDeleteRow(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const [modalVis, setModalVis] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [add, setAdd] = useState(true);
  const actionRef = useRef();

  const [columnsStateMap, setColumnsStateMap] = useState({
    country: { show: false },
    city: { show: false },
    address1: { show: false },
    address2: { show: false },
    fax: { show: false },
    email: { show: false },
    valid: { show: false },
  });

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
    updateSalesMan({ id: record.id, valid: '0', modify_user: currentUser.id }).then(rsp => {
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
        search={false}
        actionRef={actionRef}
        request={() => getSalesMan()}
        rowKey="id"
        style={{ minHeight: '650px' }}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={map => {
          setColumnsStateMap(map);
        }}
      />
      <SalesManModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />
    </>
  );
};

export default SalesMan;
