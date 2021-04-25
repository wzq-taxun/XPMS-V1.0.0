import styles from '../style.less';
import { Table, Modal, Input, Button, message } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { getRoomNo, getVacantRoomNo, getVCRoomNo } from '@/services/checkIn';
import Constants from '@/constans';
import moment from 'moment';
import { arrange } from '@/services/order';
import { connect } from 'dva';
const Arrange = props => {
  const resRoomColumns = [
    {
      title: '房号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '房型',
      dataIndex: 'room_type',
      key: 'room_type',
    },
    {
      title: '到达/离开',
      dataIndex: 'ddlk',
      key: 'ddlk',
    },
  ];

  const roomColumns = [
    {
      title: '房号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '房态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '楼层',
      dataIndex: 'room_floor',
      key: 'room_floor',
    },
    {
      title: '房间大小',
      dataIndex: 'room_area',
      key: 'room_area',
    },
    {
      title: '是否有窗',
      dataIndex: 'has_window',
      key: 'has_window',
      render: text => {
        if (text == '1') {
          return '有';
        } else {
          return '无';
        }
      },
    },
    {
      title: '床数',
      dataIndex: 'bed_num',
      key: 'bed_num',
    },
    {
      title: '描述',
      dataIndex: 'memo',
      key: 'memo',
    },
  ];

  const [pfModal, setPfModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState();
  const [roomData, setRoomData] = useState([
    {
      id: 1,
      room_no: null,
      room_type: props.room_type,
      ddlk:
        moment(props.checkin_time).format('MM-DD') +
        '/' +
        moment(props.checkout_time).format('MM-DD'),
    },
  ]);

  useEffect(() => {
    const { room_type_id, checkin_time, checkout_time } = props;
    // getRoomNo({ room_type_id, checkin_time, checkout_time }).then(rsp => {
    // getVCRoomNo(room_type_id).then(rsp => {
    getVacantRoomNo(room_type_id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setRooms(rsp.data || []);
      }
    });
  }, []);

  const handleRowClick = (record, index) => {
    console.log(record);
    const room = { ...rooms[0] };
    room.room_no = record.room_no;
    room.room_type = props.room_type;
    room.ddlk =
      moment(props.checkin_time).format('MM-DD') +
      '/' +
      moment(props.checkout_time).format('MM-DD');
    setRoomData([room]);
    setRoomId(record.id);
  };

  const handleSubmit = () => {
    const param = {
      order_info_room_id: props.order_info_room_id,
      room_no_id: roomId,
    };

    console.log(param);

    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLoading',
        payload: true,
      });

      arrange(param).then(rsp => {
        dispatch({
          type: 'global/changeLoading',
          payload: false,
        });
        if (rsp && rsp.code == Constants.SUCCESS) {
          console.log(rsp);
          props.handleCancle();
          message.info(rsp.message || '更新成功');
        }
      });
    }
  };

  return (
    <>
      <Table
        columns={resRoomColumns}
        dataSource={roomData}
        size="small"
        rowKey="id"
        pagination={false}
        // rowClassName={styles.panelTable}
        style={{ minHeight: '200px' }}
      />
      <div style={{ textAlign: 'center' }}>
        <Button onClick={props.handleCancle}>取消</Button>
        <Button style={{ marginLeft: '10px' }} type="primary" onClick={() => setPfModal(true)}>
          手动排房
        </Button>
        <Button style={{ marginLeft: '10px' }} type="primary" onClick={() => handleSubmit()}>
          确认排房
        </Button>
      </div>

      <Modal
        title="排房"
        className={styles.pfModal}
        visible={pfModal}
        footer={[
          <Button key="back" onClick={() => setPfModal(false)}>
            返回
          </Button>,
        ]}
      >
        <Table
          rowKey="id"
          columns={roomColumns}
          dataSource={rooms}
          size="small"
          onRow={(record, index) => {
            return {
              onClick: e => handleRowClick(record, index),
            };
          }}
        />
      </Modal>
    </>
  );
};
export default connect(({ global }) => ({ loading: global.loading }))(Arrange);
