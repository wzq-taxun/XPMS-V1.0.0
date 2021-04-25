import { Form, Button, Input, Modal, Table, message } from 'antd';
import styles from '../style.less';
import { useState, useEffect } from 'react';
import { getAvailableChangeRoom, transferAccount } from '@/services/order';
import Constants from '@/constans';
import { connect } from 'dva';

const Transfer = props => {
  const {
    form: { getFieldDecorator },
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };

  const [modalVis, setModalVis] = useState(false);

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
  const [room, setRoom] = useState();
  useEffect(() => {
    // 账务状态 1-正常，2-结账，3-挂账，4-冲账，5-锁定，6-挂S账'
    const selectAccounts = props.selectAccounts || [];
    const hasDis = selectAccounts.some(item => item.status != '1' && item.status != '3');
    if (hasDis) {
      message.error('包含不可转账账务');
      return;
    }

    getTransferRoom();
  }, [props.selectAccounts]);

  const getTransferRoom = () => {
    getAvailableChangeRoom(props.orderInfo && props.orderInfo.id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setRooms(rsp.data || []);
      }
    });
  };

  const handleRowClick = record => {
    console.log(record);
    const {
      form: { setFieldsValue },
    } = props;
    setFieldsValue({ room_no: record.room_no });
    setRoom(record);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        // 账务状态 1-正常，2-结账，3-挂账，4-冲账，5-锁定，6-挂S账'
        const selectAccounts = props.selectAccounts || [];
        const hasDis = selectAccounts.some(item => item.status != '1' && item.status != '3');
        if (hasDis) {
          message.error('包含不可转账账务');
          return;
        }

        let accountIds = [];
        const selectAccountIds = props.selectAccountIds || [];
        if (selectAccountIds.length < 1) {
          message.error('请选择待转入的账务');
          return;
        }
        selectAccountIds.map(item => {
          accountIds.push({ id: item });
        });

        const param = {
          accountIds,
          orderInfoRoom: {
            id: parseInt(room.order_info_room_id),
            order_info_id: room.id,
            room_no_id: room.room_no_id,
          },
        };

        console.log(param);

        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          transferAccount(param).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              console.log(rsp);
              props.form.resetFields();
              message.info('更新成功');
              props.handleCancle();
            }
          });
        }
      }
    });
  };

  return (
    <>
      <Form {...formItemLayout} className={styles.panelForm} onSubmit={handleSubmit}>
        <Form.Item label="转入房间">
          {getFieldDecorator('room_no', {})(<Input disabled />)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
          <Button onClick={props.handleCancle}>取消</Button>
          <Button type="primary" onClick={() => setModalVis(true)} style={{ marginLeft: '10px' }}>
            房间
          </Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
            确认
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="选择"
        className={styles.pfModal}
        visible={modalVis}
        footer={[
          <Button key="back" onClick={() => setModalVis(false)}>
            返回
          </Button>,
        ]}
      >
        <Table
          rowKey="id"
          columns={columns}
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

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(Transfer));
