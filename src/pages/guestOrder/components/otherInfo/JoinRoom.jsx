import { Button, Table, message, Row } from 'antd';
import styles from '../style.less';
import { useState, useEffect } from 'react';
import { getAvailableJoinRoom, joinRoom } from '@/services/order';
import Constants from '@/constans';
import { connect } from 'dva';

const JoinRoom = props => {
  const columns = [
    {
      title: '房号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
    },
  ];

  const [rooms, setRooms] = useState([]);
  const [joinRooms, setJoinRooms] = useState([]);
  useEffect(() => {
    getAvailableJoinRoom(props.orderInfo && props.orderInfo.id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setRooms(rsp.data || []);
      }
    });
  }, []);

  const handleSubmit = e => {
    const joins = [...joinRooms];
    if (joins.length < 1) {
      message.info('请选需要联房的房间');
      return;
    }

    const orderInfo = props.orderInfo;

    let orderJoins = [
      {
        is_mianroom: '1',
        order_info_id: orderInfo.id,
        order_info_room_id: parseInt(orderInfo.order_info_room_id),
        order_no: orderInfo.order_no,
        room_no: orderInfo.room_no,
        room_no_id: orderInfo.room_no_id,
      },
    ];
    joins.map(item => {
      orderJoins.push({
        // is_mianroom: '1',
        // join_no: '1',
        // memo: '1',
        order_info_id: item.id,
        order_info_room_id: parseInt(item.order_info_room_id),
        order_no: item.order_no,
        room_no: item.room_no,
        room_no_id: item.room_no_id,
        // status: '1',
      });
    });
    const param = {
      orderJoins,
    };

    console.log(param);

    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLoading',
        payload: true,
      });
      joinRoom(param).then(rsp => {
        dispatch({
          type: 'global/changeLoading',
          payload: false,
        });
        if (rsp && rsp.code == Constants.SUCCESS) {
          console.log(rsp);
          message.info('更新成功');
          props.handleCancle();
        }
      });
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setJoinRooms(selectedRows);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={rooms}
        size="small"
        rowSelection={rowSelection}
      />
      <Row style={{ textAlign: 'center' }}>
        <Button onClick={props.handleCancle}>取消</Button>
        <Button type="primary" onClick={() => handleSubmit()} style={{ marginLeft: '10px' }}>
          确认
        </Button>
      </Row>
    </>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(JoinRoom);
