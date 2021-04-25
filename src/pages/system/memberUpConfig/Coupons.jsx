import { Button, Divider, Popconfirm, message } from 'antd';
import { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getMemberUpRightCoupons, updateMemberUpRightCoupons } from '@/services/member';
import CouponModal from './CouponModal';
import Constants from '@/constans';

const Coupons = props => {
  const columns = [
    {
      title: '优惠卷',
      dataIndex: 'coupon_desc',
    },
    {
      title: '数量',
      dataIndex: 'count',
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
            <a onClick={e => handleUpdateRow(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否删除该优惠券配置？" onConfirm={() => handleDeleteRow(record)}>
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
    updateMemberUpRightCoupons({ id: record.id, valid: '0', modify_user: currentUser.id }).then(rsp => {
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
        request={() => getMemberUpRightCoupons(props.upRightId)}
        rowKey="id"
        actionRef={actionRef}
        search={false}
        toolBarRender={(action, { selectedRows }) => [
          <Button
            onClick={() => {
              props.handleBack();
            }}
          >
            返回
          </Button>,
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />

      <CouponModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
        upRightsId={props.upRightId}
      />
    </>
  );
};

export default Coupons;
