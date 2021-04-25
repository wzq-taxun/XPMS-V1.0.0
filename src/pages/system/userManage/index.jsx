import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { useRef, useEffect } from 'react';
import { getUsers, updateUser } from '@/services/system/userManage';
import { useState } from 'react';
import Constants from '@/constans';
import { Divider, Popconfirm, Button, message } from 'antd';
import AddOrUpdate from './AddOrUpdate';
import UserRole from './UserRole';

const UserManage = props => {
  const columns = [
    {
      title: '登陆账号',
      dataIndex: 'loginid',
      key: 'loginid',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    // {
    //   title: '邮箱',
    //   dataIndex: 'email',
    //   key: 'email',
    //   hideInSearch: true,
    // },
    {
      title: '角色组',
      dataIndex: 'role_descs',
      key: 'role_descs',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      valueEnum: {
        '0': {
          text: '禁用',
        },
        '1': {
          text: '正常',
        },
      },
    },
    // {
    //   title: '登陆失败次数',
    //   dataIndex: 'login_fail_count',
    //   key: 'login_fail_count',
    //   hideInSearch: true,
    // },
    {
      title: '最后登陆',
      dataIndex: 'last_login_time',
      key: 'last_login_time',
      hideInSearch: true,
    },
    {
      title: '创建人',
      dataIndex: 'create_loginid',
      key: 'create_loginid',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      hideInSearch: true,
    },
    // {
    //   title: '创建人',
    //   dataIndex: 'status',
    //   key: 'status',
    //   hideInSearch: true,
    // },
    // {
    //   title: '创建时间',
    //   dataIndex: 'status',
    //   key: 'status',
    //   hideInSearch: true,
    // },
    {
      title: '操作',
      key: 'action',
      width: '180px',
      hideInSearch: true,
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => handleUserRole(record)}>角色组</a>
            <Divider type="vertical" />
            <a onClick={() => handleUpdateRow(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要停用此用户？" onConfirm={() => handleDeleteRow(record)}>
              <a>停用</a>
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

  const [urModalVis, setUrModalVis] = useState(false);
  const [userId, setUserId] = useState(null);

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
    updateUser({ id: record.id, valid: '0', modify_user: currentUser.id }).then(function(rsp) {
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

  const handleUserRole = record => {
    setUserId(record.id);
    setUrModalVis(true);
  };

  const handleCancelUserRole = refush => {
    setUrModalVis(false);
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
        // request={param => {
        //   param.startRow = (param.current - 1) * param.pageSize;
        //   return getUsers(param);
        // }}
        request={param => getUsers(param)}
        // postData={data => {
        //   setTotal(data.count);
        //   return data.users;
        // }}
        rowKey="id"
        // pagination={{ total: total }}
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

      <UserRole
        visible={urModalVis}
        handleCancel={refush => handleCancelUserRole(refush)}
        userId={userId}
      />
    </GridContent>
  );
};

export default UserManage;
