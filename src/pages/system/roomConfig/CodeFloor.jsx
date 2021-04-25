import ProTable from '@ant-design/pro-table';
import { getFloors } from '@/services/rooms';
import { useState, useRef } from 'react';
import { updateFloor } from '@/services/system/roomConfig';
import FloorModal from './FloorModal';
import { Button, message, Divider, Popconfirm } from 'antd';
import Constants from '@/constans';

const CodeFloor = props => {
  const columns = [
    {
      title: '代码',
      dataIndex: 'floor_code',
      key: 'floor_code',
    },
    {
      title: '中文描述',
      dataIndex: 'floor_no',
      key: 'floor_no',
    },
    {
      title: '英文描述',
      dataIndex: 'floor_no_en',
      key: 'floor_no_en',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '排序',
      dataIndex: 'list_no',
      key: 'list_no',
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
            <Popconfirm title="是否要删除此行？" onConfirm={() => handleDeleteRow(record)}>
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
    updateFloor([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(function(rsp) {
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
        request={() => getFloors()}
        rowKey="id"
        style={{ minHeight: '650px' }}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />
      <FloorModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />
    </>
  );
};

export default CodeFloor;
