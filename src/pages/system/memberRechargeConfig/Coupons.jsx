import ProTable from '@ant-design/pro-table';
import { getMemberRechargeRightCoupons, updateMemberRechargeRightCoupons } from '@/services/member';
import { useRef, useState } from 'react';
import { Divider, Popconfirm, Button, message } from 'antd';
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
            <a onClick={e => handleUpdate(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否删除该充值优惠卷配置？" onConfirm={() => handleDelete(record)}>
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

  const handleUpdate = record => {
    setFormValues(record);
    setAdd(false);
    setModalVis(true);
  };

  const handleDelete = record => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    updateMemberRechargeRightCoupons({
      id: record.id,
      valid: '0',
      modify_user: currentUser.id,
    }).then(rsp => {
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
        request={() => getMemberRechargeRightCoupons(props.rightsId)}
        rowKey="id"
        search={false}
        actionRef={actionRef}
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
        rightsId={props.rightsId}
      />
    </>
  );
};

export default Coupons;
