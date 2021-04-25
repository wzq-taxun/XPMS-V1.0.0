import styles from '../style.less';
import { Select, Button, Form, InputNumber, message } from 'antd';
import { useState, useEffect } from 'react';
import {
  getRoomRateCode,
  getRoomType,
  getRoomNo,
  getPreferReason,
  getRoomRate,
} from '@/services/checkIn';
import Constants from '@/constans';
import { connect } from 'dva';
import { changeRoom } from '@/services/order';
import moment from 'moment';
const { Option } = Select;

const ChangeRoom = props => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomNos, setRoomNos] = useState([]);
  const [roomRateCode, setRoomRateCode] = useState([]);
  const [preferReason, setPreferReason] = useState([]);

  useEffect(() => {
    const {
      form: { setFieldsValue },
      orderInfo: {
        guest_type_id,
        market_id,
        order_type_id,
        room_type_id,
        checkin_time,
        checkout_time,
        room_rate_id,
      },
    } = props;

    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setRoomTypes(data);
      }
    });

    queryRoomNo({ room_type_id, checkin_time, checkout_time, room_type_same: 1 });

    getRoomPrice(room_type_id);

    getRoomRateCode({
      market_id,
      order_type_id,
      guest_type_id,
    }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setRoomRateCode(data);
        getRoomPrice(null, room_rate_id);
      }
    });

    getPreferReason().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setPreferReason(data);
        setFieldsValue({
          prefer_reason_id: data[0] && data[0].id,
        });
      }
    });
  }, []);

  const handleChangeRoomType = value => {
    const param = {
      room_type_id: value,
      checkin_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      checkout_time: props.orderInfo && props.orderInfo.checkout_time,
    };
    const room_type_id = props.orderInfo && props.orderInfo.room_type_id;
    if (room_type_id == value) {
      param.room_type_same = 1;
    }

    queryRoomNo(param);
    getRoomPrice(value);
  };

  const queryRoomNo = param => {
    getRoomNo(param).then(rsp => {
      const {
        form: { setFieldsValue },
      } = props;
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setRoomNos(data);

        setFieldsValue({
          room_no_id: data[0] && data[0].id,
        });
      } else {
        setRoomNos([]);
        setFieldsValue({ room_no_id: null });
      }
    });
  };

  const handleChangeRoomRateCode = value => {
    getRoomPrice(null, value);
  };

  const getRoomPrice = (room_type_id, code_room_rate_id) => {
    const {
      form: { getFieldValue, setFieldsValue },
      orderInfo: { checkin_time, checkout_time },
    } = props;
    room_type_id = room_type_id || getFieldValue('room_type_id');
    code_room_rate_id = code_room_rate_id || getFieldValue('room_rate_id');
    if (!room_type_id || !code_room_rate_id) return;
    const param = {
      room_type_id,
      code_room_rate_id,
      date_start_end: checkin_time,
      date_end_sta: checkout_time,
    };
    getRoomRate(param).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setFieldsValue({
          room_rate: rsp.data,
          room_reality_rate: rsp.data,
        });
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        const { order_info_room_id, room_no_id, id } = props.orderInfo || {};

        const param = {
          old_order_info_room_id: parseInt(order_info_room_id),
          old_room_no_id: room_no_id,
          order_info_id: id,
          prefer_reason_id: values.prefer_reason_id,
          room_no_id: values.room_no_id,
          room_rate: values.room_rate,
          room_rate_id: values.room_rate_id,
          room_reality_rate: values.room_reality_rate,
          room_type_id: values.room_type_id,
        };

        console.log(param);

        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          changeRoom(param).then(rsp => {
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
      }
    });
  };

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

  return (
    <Form {...formItemLayout} className={styles.panelForm} onSubmit={handleSubmit}>
      <Form.Item label="房型">
        {getFieldDecorator('room_type_id', {
          rules: [
            {
              required: true,
              message: '请选择房型！',
            },
          ],
          initialValue: props.orderInfo && props.orderInfo.room_type_id,
        })(
          <Select onChange={value => handleChangeRoomType(value)}>
            {roomTypes.map(item => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="房号">
        {getFieldDecorator('room_no_id', {
          rules: [
            {
              required: true,
              message: '请选择房号！',
            },
          ],
        })(
          <Select>
            {roomNos.map(item => (
              <Option key={item.id} value={item.id}>
                {item.room_no}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="房价码">
        {getFieldDecorator('room_rate_id', {
          rules: [
            {
              required: true,
              message: '请选择房价码！',
            },
          ],
          initialValue: props.orderInfo && props.orderInfo.room_rate_id,
        })(
          <Select onChange={value => handleChangeRoomRateCode(value)}>
            {roomRateCode.map(item => (
              <Option key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="房价">
        {getFieldDecorator('room_rate', {
          rules: [
            {
              required: true,
              message: '房价不能为空!',
            },
          ],
        })(<InputNumber disabled />)}
      </Form.Item>
      <Form.Item label="实际房价">
        {getFieldDecorator('room_reality_rate', {
          rules: [
            {
              required: true,
              message: '房价不能为空!',
            },
          ],
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="优惠理由">
        {getFieldDecorator(
          'prefer_reason_id',
          {},
        )(
          <Select>
            {preferReason.map(item => (
              <Option key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8 }}>
        <Button onClick={props.handleCancle}>取消</Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
          确认
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(ChangeRoom));
