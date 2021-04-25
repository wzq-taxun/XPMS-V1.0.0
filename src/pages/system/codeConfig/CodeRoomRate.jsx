import { getRoomRateCode } from '@/services/checkIn';
import ProTable from '@ant-design/pro-table';
import { queryRoomRate, updateRoomRate } from '@/services/system/codeConfig';
import { Divider, Popconfirm, message, Button } from 'antd';
import { useRef, useState } from 'react';
import Constants from '@/constans';
import RoomRateModal from './RoomRateModal';

const CodeRoomRate = props => {
  const columns = [
    {
      title: '房价码编码',
      dataIndex: 'room_rate_code',
      key: 'room_rate_code',
    },
    {
      title: '房价码名称',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '订单类型',
      dataIndex: 'descr',
      key: 'descr',
    },
    {
      title: '市场',
      dataIndex: 'marketDescr',
      key: 'marketDescr',
    },
    {
      title: '来源',
      dataIndex: 'sourceDescr',
      key: 'sourceDescr',
    },
    {
      title: '包价',
      dataIndex: 'packagesDescr',
      key: 'packagesDescr',
    },
    {
      title: '开始',
      dataIndex: 'date_start',
      key: 'date_start',
    },
    {
      title: '结束',
      dataIndex: 'date_end',
      key: 'date_end',
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
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleUpdateRow(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => handleDeleteRow(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
      hideInSearch: true,
    },
  ];

  const actionRef = useRef();
  const [modalVis, setModalVis] = useState(false);
  const [add, setAdd] = useState(false);
  const [formValues, setFormValues] = useState();

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
    updateRoomRate([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(rsp => {
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
        actionRef={actionRef}
        search={false}
        request={() => queryRoomRate()}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />

      <RoomRateModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />
    </>
  );
};

export default CodeRoomRate;
