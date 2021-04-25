import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Popconfirm, message } from 'antd';
import styles from './style.less';
import { useState, useRef } from 'react';
import AddOrUpdate from './AddOrUpdate';
import { getMembers, updateMember, getMemberLevel } from '@/services/member';
import Constants from '@/constans';
import Recharge from './Recharge';
import Account from './Account';
import { useEffect } from 'react';
import Coupons from './Coupons';

const Member = props => {
  useEffect(() => {
    getMemberLevel().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        let levelEnum = {};
        data.map(item => {
          levelEnum[item.id] = { text: item.description };
        });
        setLevelEnum(levelEnum);
      }
    });
  }, []);

  const [levelEnum, setLevelEnum] = useState({});

  const [columnsStateMap, setColumnsStateMap] = useState({
    card_no: { show: false },
    join_date: { show: false },
    renewal_date: { show: false },
    end_date: { show: false },
    last_visit_date: { show: false },
    company: { show: false },
    status: { show: false },
    card_type: { show: false },
    email: { show: false },
  });

  const columns = [
    {
      title: '会员编号',
      dataIndex: 'member_no',
    },
    {
      title: '会员类型',
      dataIndex: 'card_type',
      hideInSearch: true,
    },
    {
      title: '会员等级',
      dataIndex: 'member_level_id',
      valueEnum: levelEnum,
    },
    {
      title: '会员卡号',
      dataIndex: 'card_no',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '证件类型',
      dataIndex: 'credential_type',
      hideInSearch: true,
      valueEnum: {
        '1': {
          text: '身份证',
        },
      },
    },
    {
      title: '证件号',
      dataIndex: 'credential_no',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        '1': {
          text: '正常',
        },
      },
    },
    {
      title: '余额',
      dataIndex: 'balance',
      hideInSearch: true,
      render: text => -text,
    },
    {
      title: '押金',
      dataIndex: 'deposit',
      hideInSearch: true,
    },
    {
      title: '加入日期',
      dataIndex: 'join_date',
      hideInSearch: true,
    },
    {
      title: '续签日期',
      dataIndex: 'renewal_date',
      hideInSearch: true,
    },
    {
      title: '到期日期',
      dataIndex: 'end_date',
      hideInSearch: true,
    },
    {
      title: '最后到访日期',
      dataIndex: 'last_visit_date',
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      hideInSearch: true,
    },
    {
      title: '工作单位',
      dataIndex: 'company',
      hideInSearch: true,
    },
    {
      title: '经办人',
      dataIndex: 'username',
      hideInSearch: true,
    },
    {
      title: '有效',
      dataIndex: 'valid',
      key: 'valid',
      hideInSearch: true,
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
      hideInSearch: true,
      width: 260,
      fixed: 'right',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleCoupons(record)}>优惠卷</a>
            <Divider type="vertical" />
            <a onClick={e => handleRecharge(record)}>充值</a>
            <Divider type="vertical" />
            <a onClick={e => handleUpdateRow(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要停用此会员？" onConfirm={() => handleDeleteRow(record)}>
              <a>停用</a>
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
    updateMember({ id: record.member_info_id, valid: '0', modify_user: currentUser.id }).then(
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

  const handleCancel = refush => {
    setModalVis(false);
    setRechargeModalVis(false);
    setCouponsVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleRecharge = record => {
    setRechargeModalVis(true);
    setMember(record);
  };

  const handleCoupons = record => {
    setCouponsVis(true);
    setMember(record);
  };

  const handleBack = () => {
    setShowMember(true);
  };

  const [modalVis, setModalVis] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [add, setAdd] = useState(true);
  const [rechargeModalVis, setRechargeModalVis] = useState(false);
  const [member, setMember] = useState({});
  const [showMember, setShowMember] = useState(true);
  const actionRef = useRef();
  const [couponsVis, setCouponsVis] = useState(false);

  return (
    <GridContent>
      {showMember ? (
        <>
          <ProTable
            actionRef={actionRef}
            className={styles.mytable}
            columns={columns}
            rowKey="member_info_id"
            request={params => getMembers(params)}
            scroll={{ x: 'max-content' }}
            toolBarRender={(action, { selectedRows }) => [
              <Button icon="plus" type="primary" onClick={() => handleAdd()}>
                新建
              </Button>,
            ]}
            onRow={record => {
              return {
                onDoubleClick: e => {
                  setMember(record);
                  setShowMember(false);
                },
              };
            }}
            columnsStateMap={columnsStateMap}
            onColumnsStateChange={map => {
              setColumnsStateMap(map);
            }}
          />

          <AddOrUpdate
            visible={modalVis}
            handleCancel={refush => handleCancel(refush)}
            isAdd={add}
            formValues={formValues}
          />

          <Recharge
            visible={rechargeModalVis}
            member={member}
            handleCancel={refush => handleCancel(refush)}
          />

          <Coupons
            visible={couponsVis}
            member={member}
            handleCancel={refush => handleCancel(refush)}
          />
        </>
      ) : (
        <Account member={member} handleBack={() => handleBack()} />
      )}
    </GridContent>
  );
};

export default Member;
