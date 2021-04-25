import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {
  getMemberUpConfigs,
  getMemberUpRights,
  updateMemberUpRights,
  updateMemberUpConfigs,
} from '@/services/member';
import { Modal, Button, Divider, Popconfirm, message } from 'antd';
import Coupons from './Coupons';
import { useState, useRef } from 'react';
import ConfigModal from './ConfigModal';
import RightsModal from './RightsModal';
import Constants from '@/constans';

const MemberUpConfig = props => {
  const columns = [
    {
      title: '升级前',
      dataIndex: 'old_level_description',
      width: 80,
    },
    {
      title: '升级后',
      dataIndex: 'new_level_description',
      width: 80,
    },
    {
      title: '方式',
      dataIndex: 'type',
      width: 100,
      valueEnum: {
        RECHARGE: {
          text: '储值',
        },
        BUY: {
          text: '购买',
        },
        SCORE: {
          text: '积分兑换',
        },
        ORDER: {
          text: '首单',
        },
        SYS: {
          text: '平台设置',
        },
      },
    },
    {
      title: '说明',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '升级消耗',
      dataIndex: 'consume',
      width: 90,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 80,
      valueEnum: {
        1: {
          text: '正常',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'memo',
      width: 260,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleUpdateConfig(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否删除该升级配置？" onConfirm={() => handleDeleteConfig(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const expandedRowRender = record => {
    return (
      <ProTable
        columns={[
          {
            title: '权益类型',
            dataIndex: 'type',
            key: 'type',
            valueEnum: {
              COUPON: {
                text: '优惠卷',
              },
              SCORE: {
                text: '积分',
              },
            },
          },
          { title: '名称', dataIndex: 'name', key: 'name' },
          { title: '描述', dataIndex: 'description', key: 'description' },
          { title: '赠送积分', dataIndex: 'score', key: 'score' },
          { title: '备注', dataIndex: 'memo' },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
              if (record.type == 'COUPON')
                return (
                  <span>
                    <a onClick={e => handleShowCoupons(record)}>优惠卷列表</a>
                    <Divider type="vertical" />
                    <a onClick={e => handleUpdateRights(record)}>修改</a>
                    <Divider type="vertical" />
                    <Popconfirm
                      title="是否删除该升级权益配置？"
                      onConfirm={() => handleDeleteRights(record)}
                    >
                      <a>删除</a>
                    </Popconfirm>
                  </span>
                );
            },
          },
        ]}
        actionRef={rightsRef}
        search={false}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAddRights(record.id)}>
            新建
          </Button>,
        ]}
        rowKey="id"
        request={() => getMemberUpRights(record.id)}
        pagination={false}
      />
    );
  };

  const handleShowCoupons = record => {
    setUpRightId(record.id);
    setCouponsShow(true);
  };

  const handleAddConfig = () => {
    setConfigRecord(null);
    setConfigAdd(true);
    setConfigVis(true);
  };

  const handleUpdateConfig = record => {
    setConfigRecord(record);
    setConfigAdd(false);
    setConfigVis(true);
  };

  const handleConfigCancel = refush => {
    setConfigVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleDeleteConfig = record => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    updateMemberUpConfigs({ id: record.id, valid: '0', modify_user: currentUser.id }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const handleAddRights = up_config_id => {
    setUpConfigId(up_config_id);
    setRightsRecord(null);
    setRightsAdd(true);
    setRightsVis(true);
  };

  const handleUpdateRights = record => {
    setRightsRecord(record);
    setRightsAdd(false);
    setRightsVis(true);
  };

  const handleRightsCancel = refush => {
    setUpConfigId(null);
    setRightsVis(false);
    if (refush) {
      if (rightsRef.current) {
        rightsRef.current.reload();
      }
    }
  };

  const handleDeleteRights = record => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    updateMemberUpRights({ id: record.id, valid: '0', modify_user: currentUser.id }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        if (rightsRef.current) {
          rightsRef.current.reload();
        }
      }
    });
  };

  const actionRef = useRef();
  const rightsRef = useRef();

  const [couponsShow, setCouponsShow] = useState(false);
  const [upRightId, setUpRightId] = useState(null);

  const [configVis, setConfigVis] = useState(false);
  const [configRecord, setConfigRecord] = useState(null);
  const [configAdd, setConfigAdd] = useState(true);

  const [rightsVis, setRightsVis] = useState(false);
  const [rightsRecord, setRightsRecord] = useState(null);
  const [rightsAdd, setRightsAdd] = useState(true);

  const [upConfigId, setUpConfigId] = useState(null);

  return (
    <GridContent>
      {couponsShow ? (
        <Coupons upRightId={upRightId} handleBack={() => setCouponsShow(false)} />
      ) : (
        <ProTable
          columns={columns}
          request={() => getMemberUpConfigs()}
          rowKey="id"
          search={false}
          actionRef={actionRef}
          expandedRowRender={expandedRowRender}
          toolBarRender={(action, { selectedRows }) => [
            <Button icon="plus" type="primary" onClick={() => handleAddConfig()}>
              新建
            </Button>,
          ]}
        />
      )}

      <ConfigModal
        visible={configVis}
        handleCancel={refush => handleConfigCancel(refush)}
        isAdd={configAdd}
        formValues={configRecord}
      />

      <RightsModal
        visible={rightsVis}
        handleCancel={refush => handleRightsCancel(refush)}
        isAdd={rightsAdd}
        formValues={rightsRecord}
        upConfigId={upConfigId}
      />
    </GridContent>
  );
};

export default MemberUpConfig;
