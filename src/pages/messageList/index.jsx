import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';
import { Table } from 'antd';
import { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { getMessage } from '@/services/system/hotel';

const MessageList = props => {
  const columns = [
    {
      title: '类别',
      dataIndex: 'message_type',
      key: 'message_type',
      valueEnum: {
        '1': {
          text: '通知',
        },
        '2': {
          text: '消息',
        },
        '3': {
          text: '待办',
        },
      },
    },
    // {
    //   title: '标题',
    //   dataIndex: 'title',
    //   key: 'title',
    //   hideInSearch: true,
    // },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      hideInSearch: true,
    },
    // {
    //   title: '接收人',
    //   dataIndex: 'username',
    //   key: 'username',
    //   hideInSearch: true,
    // },
    {
      title: '是否发送',
      dataIndex: 'is_send',
      key: 'is_send',
      valueEnum: {
        '0': {
          text: '未发送',
        },
        '1': {
          text: '已发送',
        },
      },
    },
    {
      title: '发送时间',
      dataIndex: 'send_time',
      key: 'send_time',
      hideInSearch: true,
    },
    {
      title: '是否阅读',
      dataIndex: 'is_read',
      key: 'is_read',
      valueEnum: {
        '0': {
          text: '未读',
        },
        '1': {
          text: '已读',
        },
      },
    },
    {
      title: '阅读时间',
      dataIndex: 'read_time',
      key: 'read_time',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      hideInSearch: true,
    },
  ];

  const [total, setTotal] = useState(0);

  return (
    <GridContent>
      <div className={styles.header}>推送消息</div>
      <div className={styles.messageTable}>
        <ProTable
          columns={columns}
          rowKey="id"
          request={param =>
            getMessage({ ...param, startRow: (param.current - 1) * param.pageSize })
          }
          postData={data => {
            setTotal(data.count);
            return data.list;
          }}
          pagination={{ total: total }}
        />
      </div>
    </GridContent>
  );
};

export default MessageList;
