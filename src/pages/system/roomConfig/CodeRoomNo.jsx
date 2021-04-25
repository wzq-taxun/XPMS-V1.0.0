import ProTable from '@ant-design/pro-table';
import { Button, Divider, Popconfirm, message, Upload, Icon } from 'antd';
import { queryRoomNos, updateRoom } from '@/services/system/roomConfig';
import { getdoorlockalllist, synchronizationLock } from '@/services/doorlock';
import RoomNoModal from './RoomNoModal';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import Constants from '@/constans';
import LockTuyaModal from './LockTuyaModal';
import LockHuoheModal from './LockHuoheModal';
import DuerosModal from './DuerosModal';

const CodeRoomNo = props => {
  const columns = [
    {
      title: '楼层',
      dataIndex: 'room_floor',
      key: 'room_floor',
    },
    {
      title: '房号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '房型',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: '床型',
      dataIndex: 'bedDescr',
      key: 'bedDescr',
    },
    {
      title: '房间床数',
      dataIndex: 'bed_num',
      key: 'bed_num',
    },
    {
      title: '是否有窗',
      dataIndex: 'has_window',
      key: 'has_window',
      valueEnum: {
        0: {
          text: '无',
        },
        1: {
          text: '有',
        },
      },
    },
    {
      title: '房间大小',
      dataIndex: 'room_area',
      key: 'room_area',
    },
    {
      title: '智能门锁',
      dataIndex: 'lock_id',
      key: 'lock_id',
      render: (text, record) => (record.lock_id ? '有' : '无'),
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    // {
    //   title: '有效',
    //   dataIndex: 'valid',
    //   key: 'valid',
    //   valueEnum: {
    //     0: {
    //       text: '已停用',
    //     },
    //     1: {
    //       text: '有效',
    //     },
    //   },
    // },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (text, record) => {
        if (record.lock_type == 'TUYA' || record.lock_type == 'HUOHE') {
          return (
            <span>
              <a onClick={e => handleDuerosConfig(record)}>小度</a>
              <Divider type="vertical" />
              <a onClick={e => handleLockConfig(record)}>门锁</a>
              <Divider type="vertical" />
              {/* <a onClick={e => handleUpdateRow(record)}>修改</a>
              <Divider type="vertical" /> */}
              <Popconfirm title="是否要停用此房号？" onConfirm={() => handleDeleteRow(record)}>
                <a>停用</a>
              </Popconfirm>
            </span>
          );
        } else {
          return (
            <span>
              <a onClick={e => handleDuerosConfig(record)}>小度</a>
              {/* <Divider type="vertical" />
              <a onClick={e => handleUpdateRow(record)}>修改</a> */}
              <Divider type="vertical" />
              <Popconfirm title="是否要停用此房号？" onConfirm={() => handleDeleteRow(record)}>
                <a>停用</a>
              </Popconfirm>
            </span>
          );
        }
      },

      // },
    },
  ];
  // wei 导入数据上传给后端
  const onChange = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.response.message}` || `${info.file.name}文件导入成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}文件导入失败`);
    }
  };
  const beforeUpload = file => {
    const isJpgOrPng =
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isJpgOrPng) {
      message.error('只能上传Excle文件格式');
    }
    return isJpgOrPng;
  };
  const [prop] = useState({
    name: 'file',
    showUploadList: false,
    beforeUpload: beforeUpload,
    onChange: onChange,
    action: `/api/hotel/lock/room_code/import?hotel_group_id=${
      JSON.parse(sessionStorage.getItem('currentUser')).hotel_group_id
    }&hotel_id=${JSON.parse(sessionStorage.getItem('currentUser')).hotel_id}&modify_user=${
      JSON.parse(sessionStorage.getItem('currentUser')).id
    }`,
    headers: {
      authorization: 'authorization-text',
    },
    accept:
      'application/vnd.ms-excel' ||
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const handleSynchronization = () => {
    synchronizationLock().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.info(rsp.message || '同步成功');
      }
    });
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
    updateRoom([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const handleRoomNoCancel = refush => {
    setModalVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleTuyaCancel = refush => {
    setTuyaVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleHuoheCancel = refush => {
    setHuoheVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleDuerosCancel = refush => {
    setDuerosVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleLockConfig = record => {
    if (record.lock_type == 'TUYA') {
      setRecord(record);
      setTuyaVis(true);
    } else if (record.lock_type == 'HUOHE') {
      setRecord(record);
      setHuoheVis(true);
    }
  };

  const handleDuerosConfig = record => {
    setRecord(record);
    setDuerosVis(true);
  };

  const [modalVis, setModalVis] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [add, setAdd] = useState(true);
  const actionRef = useRef();

  const [tuyaVis, setTuyaVis] = useState(false);
  const [huoheVis, setHuoheVis] = useState(false);
  const [record, setRecord] = useState({});

  const [duerosVis, setDuerosVis] = useState(false);
  const [physical, setPhysical] = useState(false); // 是否传统实体卡门锁

  useEffect(() => {
    getdoorlockalllist().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || {};
        if (data.type != 'TUYA' && data.type != 'HUOHE' && data.type != 'NOLOCK') {
          setPhysical(true);
        }
      }
    });
  }, []);

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        search={false}
        request={param => queryRoomNos(param)}
        rowKey="id"
        style={{ minHeight: '650px' }}
        toolBarRender={(action, { selectedRows }) => {
          const toolbar = [
            <Button key="synch" type="danger" onClick={() => handleSynchronization()}>
              同步门锁
            </Button>,
            <Button icon="plus" key="add" type="primary" onClick={() => handleAdd()}>
              新建
            </Button>,
          ];
          if (physical) {
            return [
              <Upload {...prop}>
                <Button>
                  <Icon type="upload" /> 导入Excle
                </Button>
              </Upload>,
              ...toolbar,
            ];
          } else {
            return toolbar;
          }
        }}
      />

      <RoomNoModal
        key="room_no"
        visible={modalVis}
        handleCancel={refush => handleRoomNoCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />

      <LockTuyaModal
        key="tuya"
        visible={tuyaVis}
        handleCancel={refush => handleTuyaCancel(refush)}
        record={record}
      />

      <LockHuoheModal
        key="huohe"
        visible={huoheVis}
        handleCancel={refush => handleHuoheCancel(refush)}
        record={record}
      />

      <DuerosModal
        key="dueros"
        visible={duerosVis}
        handleCancel={refush => handleDuerosCancel(refush)}
        record={record}
      />
    </>
  );
};

export default CodeRoomNo;
