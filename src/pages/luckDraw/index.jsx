import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getPrizeRecord, usePrize } from '@/services/luckDraw';
import Constants from '@/constans';
import { message, Popconfirm } from 'antd';
import { useRef } from 'react';

const LuckDraw = props => {
  const columns = [
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '奖品等级',
      dataIndex: 'prize_level',
      key: 'prize_level',
    },
    {
      title: '奖项名称',
      dataIndex: 'prize_name',
      key: 'prize_name',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      valueEnum: {
        '1': {
          text: '正常',
        },
        '2': {
          text: '已核销',
        },
      },
    },
    {
      title: '抽奖日期',
      dataIndex: 'create_time',
      key: 'create_time',
      hideInSearch: true,
    },
    {
      title: '修改日期',
      dataIndex: 'modify_time',
      key: 'modify_time',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      hideInSearch: true,
      render: (text, record) => {
        if (record.state == '1') {
          return (
            <span>
              <Popconfirm title="是否要核销此记录？" onConfirm={() => handleUse(record)}>
                <a>核销</a>
              </Popconfirm>
            </span>
          );
        }
      },
    },
  ];

  const actionRef = useRef();

  const handleUse = record => {
    if (record.id) {
      usePrize(record.id).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          message.success(rsp.message || '核销成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      });
    }
  };

  return (
    <GridContent>
      <ProTable
        columns={columns}
        request={param => getPrizeRecord(param)}
        rowKey="id"
        actionRef={actionRef}
      />
    </GridContent>
  );
};

export default LuckDraw;
