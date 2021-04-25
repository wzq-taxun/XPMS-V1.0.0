import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getHotels, updateHotel } from '@/services/system/hotel';
import { Button, Divider, Popconfirm, message } from 'antd';
import { useState, useRef } from 'react';
import AddOrUpdate from './AddOrUpdate';
import Constants from '@/constans';

const Hotels = props => {
  const columns = [
    {
      title: '酒店名称',
      dataIndex: 'name',
    },
    {
      title: '酒店编码',
      dataIndex: 'code',
    },
    {
      title: '地址',
      dataIndex: 'address1',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: 'OTA',
      dataIndex: 'ota',
      valueEnum: {
        '0': {
          text: '不对接',
        },
        '1': {
          text: '对接',
        },
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      // fixed: 'right',
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
    updateHotel({ id: record.id, valid: '0', modify_user: currentUser.id }).then(rsp => {
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
    <GridContent>
      <ProTable
        columns={columns}
        rowKey="id"
        request={() => getHotels()}
        search={false}
        actionRef={actionRef}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />

      <AddOrUpdate
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />
    </GridContent>
  );
};
export default Hotels;
