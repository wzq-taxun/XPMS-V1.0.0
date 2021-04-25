import { useEffect, useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getWechatAds, updateWechatAds } from '@/services/global';
import { Divider, Popconfirm, Button, message } from 'antd';
import AddOrUpdate from './AddOrUpdate';
import Constants from '@/constans';

const WechatAds = props => {
  const columns = [
    {
      title: '图片',
      dataIndex: 'img',
      key: 'img',
      render: (text, record) => {
        if (record.url) {
          return <img height={40} src={record.url} />;
        }
      },
    },
    {
      title: '图片地址',
      dataIndex: 'url',
      key: 'url',
      width: 240,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '链接',
      dataIndex: 'href',
      key: 'href',
      width: 240,
      ellipsis: true,
    },
    {
      title: '起始日期',
      dataIndex: 'validity_start',
      key: 'validity_start',
      width: 160,
    },
    {
      title: '截止日期',
      dataIndex: 'validity_end',
      key: 'validity_end',
      width: 160,
    },
    {
      title: '排序',
      dataIndex: 'sort_no',
      key: 'sort_no',
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
    updateWechatAds({ id: record.id, valid: '0', modify_user: currentUser.id }).then(function(rsp) {
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
        request={() => getWechatAds()}
        rowKey="id"
        actionRef={actionRef}
        search={false}
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

export default WechatAds;
