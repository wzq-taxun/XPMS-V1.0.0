import { getOrderType } from '@/services/checkIn';
import ProTable from '@ant-design/pro-table';

const CodeOrder = props => {
  const columns = [
    {
      title: '代码',
      dataIndex: 'dictcode',
      key: 'dictcode',
    },
    {
      title: '中文描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '有效',
      dataIndex: 'valid',
      key: 'valid',
      valueEnum: {
        '0': {
          text: '无效',
        },
        '1': {
          text: '有效',
        },
      },
    },
    // {
    //   title: '有效性',
    //   dataIndex: 'valid',
    //   key: 'valid',
    //   valueEnum: {
    //     0: {
    //       text: '无效',
    //     },
    //     1: {
    //       text: '有效',
    //     },
    //   },
    // },
    // {
    //   title: '操作',
    //   key: 'action',
    //   width: 160,
    //   render: (text, record) => {
    //     return (
    //       <span>
    //         <a onClick={e => handleUpdateBaseRow(record)}>修改</a>
    //         <Divider type="vertical" />
    //         <Popconfirm title="是否要删除此行？" onConfirm={() => handleDeleteBaseRow(record)}>
    //           <a>删除</a>
    //         </Popconfirm>
    //       </span>
    //     );
    //   },
    //   hideInSearch: true,
    // },
  ];

  return (
    <ProTable
      columns={columns}
      //   actionRef={actionRef}
      search={false}
      request={() => getOrderType()}
      rowKey="id"
    />
  );
};

export default CodeOrder;
