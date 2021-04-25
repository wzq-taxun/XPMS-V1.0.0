import ProTable from '@ant-design/pro-table';
import { Button, Modal, Tabs } from 'antd';
import { getMemberAvailableCoupons, getMemberCouponsStatistics } from '@/services/member';
import { useEffect, useRef, useState } from 'react';
import AddCoupon from './AddCoupon';
const { TabPane } = Tabs;

const Coupons = props => {
  const columns = [
    {
      title: '实名姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        1: { text: '男' },
        2: { text: '女' },
      },
    },
    {
      title: '微信昵称',
      dataIndex: 'nickname',
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: {
        UP: { text: '升级赠送' },
        RECHARGE: { text: '充值赠送' },
        SCORE: { text: '积分兑换赠送' },
        FIRST_LOGIN: { text: '首次登陆赠送' },
        XPMS: { text: 'XPMS赠送' },
      },
    },
    {
      title: '优惠卷',
      dataIndex: 'title',
    },
    {
      title: '总数量',
      dataIndex: 'total',
    },
    {
      title: '可领取数量',
      dataIndex: 'count',
    },
    // {
    //   title: '已领取未使用',
    //   dataIndex: 'received_normal',
    // },
    // {
    //   title: '已使用',
    //   dataIndex: 'received_used',
    // },
  ];

  const statisticsColumns = [
    {
      title: '优惠卷',
      dataIndex: 'title',
    },
    {
      title: '总数量',
      dataIndex: 'total',
    },
    {
      title: '可领取数量',
      dataIndex: 'count',
    },
    {
      title: '已领取未使用',
      dataIndex: 'received_normal',
    },
    {
      title: '已使用',
      dataIndex: 'received_used',
    },
  ];

  const [addVis, setAddVis] = useState(false);
  const actionRef = useRef();
  const actionRef2 = useRef();

  const [activeKey, setActiveKey] = useState('1');

  const handleCancel = refush => {
    setAddVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleTabsChange = key => {
    setActiveKey(key);
    if (key == '1') {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      if (actionRef2.current) {
        actionRef2.current.reload();
      }
    }
  };

  useEffect(() => {
    if (props.visible) {
      setActiveKey('1');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }, [props.visible]);

  return (
    <>
      <Modal
        title="会员卡"
        visible={props.visible}
        onCancel={() => props.handleCancel()}
        onOk={() => props.handleCancel()}
        width={1000}
      >
        <Tabs activeKey={activeKey} onChange={key => handleTabsChange(key)}>
          <TabPane tab="赠送" key="1">
            <ProTable
              search={false}
              actionRef={actionRef}
              columns={columns}
              rowKey="id"
              request={() => getMemberAvailableCoupons(props.member && props.member.member_info_id)}
              toolBarRender={(action, { selectedRows }) => [
                <Button icon="plus" type="primary" onClick={() => setAddVis(true)}>
                  添加
                </Button>,
              ]}
            />
          </TabPane>
          <TabPane tab="统计" key="2">
            <ProTable
              search={false}
              actionRef={actionRef2}
              columns={statisticsColumns}
              rowKey="wechat_card_base_id"
              request={() =>
                getMemberCouponsStatistics(props.member && props.member.member_info_id)
              }
            />
          </TabPane>
        </Tabs>
      </Modal>

      <AddCoupon
        visible={addVis}
        member={props.member}
        handleCancel={refush => handleCancel(refush)}
      />
    </>
  );
};

export default Coupons;
