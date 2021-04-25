import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getMemberRechargeRights, updateMemberRechargeRights } from '@/services/member';
import { Button, Divider, Popconfirm, message } from 'antd';
import RightsModal from './RightsModal';
import { useState, useRef } from 'react';
import Coupons from './Coupons';
import Constants from '@/constans';

const MemberRechargeConfig = props => {
  const columns = [
    {
      title: '起充金额(含)',
      dataIndex: 'start_recharge',
    },
    {
      title: '截止金额(不含)',
      dataIndex: 'end_recharge',
    },
    {
      title: '权益类型',
      dataIndex: 'type',
      valueEnum: {
        COUPON: {
          text: '优惠卷',
        },
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: {
        '1': {
          text: '正常',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleShowCoupons(record)}>优惠卷</a>
            <Divider type="vertical" />
            <a onClick={e => handleUpdateRights(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否删除该充值配置？" onConfirm={() => handleDeleteRights(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const [rightsVis, setRightsVis] = useState(false);
  const [rightsRecord, setRightsRecord] = useState(null);
  const [rightsAdd, setRightsAdd] = useState(true);
  const actionRef = useRef();

  const [showCoupons, setShowCoupons] = useState(false);
  const [rightsId, setRightsId] = useState(null);

  const handleAddRights = () => {
    setRightsRecord(null);
    setRightsAdd(true);
    setRightsVis(true);
  };

  const handleUpdateRights = record => {
    setRightsRecord(record);
    setRightsAdd(false);
    setRightsVis(true);
  };

  const handleDeleteRights = record => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    updateMemberRechargeRights({ id: record.id, valid: '0', modify_user: currentUser.id }).then(
      rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          message.success(rsp.message || '删除成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      },
    );
  };

  const handleRightsCancel = refush => {
    setRightsVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleShowCoupons = record => {
    setRightsId(record.id);
    setShowCoupons(true);
  };

  return (
    <GridContent>
      {showCoupons ? (
        <Coupons rightsId={rightsId} handleBack={() => setShowCoupons(false)} />
      ) : (
        <ProTable
          columns={columns}
          request={() => getMemberRechargeRights()}
          rowKey="id"
          search={false}
          actionRef={actionRef}
          toolBarRender={(action, { selectedRows }) => [
            <Button icon="plus" type="primary" onClick={() => handleAddRights()}>
              新建
            </Button>,
          ]}
        />
      )}

      <RightsModal
        visible={rightsVis}
        handleCancel={refush => handleRightsCancel(refush)}
        isAdd={rightsAdd}
        formValues={rightsRecord}
      />
    </GridContent>
  );
};

export default MemberRechargeConfig;
