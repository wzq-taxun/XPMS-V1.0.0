import { GridContent } from '@ant-design/pro-layout';
import { Tabs, Popconfirm, Divider } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getToDealList, deal } from '@/services/toDeal';
import styles from './style.less';
import Constants from '@/constans';
import { useRef } from 'react';
import { router } from 'umi';

const { TabPane } = Tabs;

const ToDo = props => {
  const columns1 = [
    {
      title: '待办类型',
      dataIndex: 'type_name',
      key: 'type_name',
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
    },
    {
      title: '房间号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '发起时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '描述',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (record.order_info_id) {
          return (
            <span>
              <a onClick={e => handleGoDeal(record)}>去处理</a>
              <Divider type="vertical" />
              <Popconfirm title="确定已处理？" onConfirm={() => handleDone(record)}>
                <a>完成</a>
              </Popconfirm>
            </span>
          );
        } else {
          return (
            <span>
              <Popconfirm title="确定已处理？" onConfirm={() => handleDone(record)}>
                <a>完成</a>
              </Popconfirm>
            </span>
          );
        }
      },
    },
  ];

  const columns2 = [
    {
      title: '待办类型',
      dataIndex: 'type_name',
      key: 'type_name',
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
    },
    {
      title: '房间号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '发起时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '完成时间',
      dataIndex: 'modify_time',
      key: 'modify_time',
    },
    {
      title: '描述',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (record.order_info_id) {
          return (
            <span>
              <a onClick={e => handleGoDeal(record)}>前往订单</a>
            </span>
          );
        }
      },
    },
  ];

  const handleTabsChange = activekey => {};

  const actionRef = useRef();

  const handleGoDeal = record => {
    const { order_info_id } = record;
    if (order_info_id) {
      router.push({ pathname: 'orderDetail', query: { orderId: order_info_id } });
    }
  };

  const handleDone = record => {
    deal(record.type, record.own_id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  return (
    <GridContent>
      <div className={styles.header}>待办事项</div>
      <Tabs
        style={{ background: '#fff', padding: '5px 15px' }}
        onChange={activekey => handleTabsChange({ activekey })}
        tabBarGutter={8}
      >
        <TabPane tab="待办" key="1">
          <ProTable
            actionRef={actionRef}
            columns={columns1}
            request={() => getToDealList(1)}
            search={false}
          />
        </TabPane>
        <TabPane tab="已完成" key="2">
          <ProTable columns={columns2} request={() => getToDealList(2)} search={false} />
        </TabPane>
      </Tabs>
    </GridContent>
  );
};

export default ToDo;
