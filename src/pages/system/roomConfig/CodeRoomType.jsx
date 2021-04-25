import { getRoomType } from '@/services/checkIn';
import ProTable from '@ant-design/pro-table';
import RoomTypeModal from './RoomTypeModal';
import { useState, useRef } from 'react';
import { Button, Divider, Popconfirm, message } from 'antd';
import { updateRoomType } from '@/services/system/roomConfig';
import Constants from '@/constans';
import RoomImgMoal from './RoomImgMoal';

const CodeRoomType = props => {
  const columns = [
    {
      title: '代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '有效',
      dataIndex: 'valid',
      key: 'valid',
      valueEnum: {
        0: {
          text: '无效',
        },
        1: {
          text: '有效',
        },
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleGoRoomTypeImg(record)}>房型图</a>
            <Divider type="vertical" />
            {/* <a onClick={e => handleUpdateRow(record)}>修改</a> */}
            <Divider type="vertical" />
            <Popconfirm title="是否要停用该房型？" onConfirm={() => handleDeleteRow(record)}>
              <a>停用</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const handleCancel = refush => {
    setModalVis(false);
    setImgMdVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

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
    updateRoomType([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const handleGoRoomTypeImg = record => {
    setRoomTypeId(record.id);
    setImgMdVis(true);
  };

  const [modalVis, setModalVis] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [add, setAdd] = useState(true);
  const actionRef = useRef();

  const [roomTypeId, setRoomTypeId] = useState(null);
  const [imgMdVis, setImgMdVis] = useState(false);

  return (
    <>
      <ProTable
        columns={columns}
        search={false}
        actionRef={actionRef}
        request={() => getRoomType()}
        rowKey="id"
        style={{ minHeight: '650px' }}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />

      <RoomTypeModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />

      <RoomImgMoal
        visible={imgMdVis}
        handleCancel={refush => handleCancel(refush)}
        roomTypeId={roomTypeId}
      />
    </>
  );
};

export default CodeRoomType;
