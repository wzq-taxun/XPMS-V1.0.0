import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { useRef, useEffect } from 'react';
import { getUsers, updateUser } from '@/services/system/userManage';
import { useState } from 'react';
import Constants from '@/constans';
import { Divider, Popconfirm, Button, message } from 'antd';
import { getRoles, saveRole } from '@/services/system/roleManage';
import AddOrUpdate from './AddOrUpdate';
import RolePermissions from './RolePermissions';

const RoleManage = props => {
  const columns = [
    {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '是否有效',
      dataIndex: 'valid',
      key: 'valid',
      hideInSearch: true,
      valueEnum: {
        '0': {
          text: '无效',
        },
        '1': {
          text: '正常',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      hideInSearch: true,
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => handleRoleRight(record)}>授权</a>
            <Divider type="vertical" />
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

  const [total, setTotal] = useState(0);

  const [modalVis, setModalVis] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [add, setAdd] = useState(true);
  const actionRef = useRef();

  const [rpModalVis, setRpModalVis] = useState(false);
  const [roleId, setRoleId] = useState(null);

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
    saveRole({ id: record.id, valid: '0', modify_user: currentUser.id }).then(function(rsp) {
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

  const handleRoleRight = record => {
    setRoleId(record.id);
    setRpModalVis(true);
  };

  const handleCancelRoleRight = refush => {
    setRpModalVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  return (
    <GridContent>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={param => {
          param.currentPage = param.current;
          return getRoles(param);
        }}
        postData={data => {
          setTotal(data.count);
          return data.roles;
        }}
        rowKey="id"
        pagination={{ total: total }}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            添加
          </Button>,
        ]}
      />

      <AddOrUpdate
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />

      <RolePermissions
        visible={rpModalVis}
        handleCancel={refush => handleCancelRoleRight(refush)}
        roleId={roleId}
      />
    </GridContent>
  );
};

export default RoleManage;
