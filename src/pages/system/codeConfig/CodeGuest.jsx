import { getGuestType } from '@/services/checkIn';
import ProTable from '@ant-design/pro-table';

const CodeGuest = props => {
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
  ];

  return (
    <ProTable
      columns={columns}
      //   actionRef={actionRef}
      search={false}
      request={() => getGuestType()}
      rowKey="id"
    />
  );
};

export default CodeGuest;
