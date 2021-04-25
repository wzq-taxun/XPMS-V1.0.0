import { Modal, Form, Input, DatePicker, Select, Button, message, InputNumber } from 'antd';
import { Component } from 'react';
import styles from './style.less';
import moment from 'moment';
import Constants from '@/constans';
import {
  getPreferReason,
  getRoomNo,
  getRoomRate,
  getRoomRateCode,
  getRoomType,
} from '@/services/checkIn';
import { changeRoom } from '@/services/order';
const { Option } = Select;

class ChangeRoom extends Component {
  state = {
    roomTypes: [],
    roomNos: [],
    roomRateCode: [],
    preferReason: [],
    loading: false,
  };

  componentDidMount() {
    const {
      form: { setFieldsValue },
      order_type_id,
      guest_type_id,
      market_id,
      type_id: room_type_id,
      checkin_time,
      checkout_time,
    } = this.props;

    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ roomTypes: data });
      }
    });

    this.queryRoomNo({ room_type_id, checkin_time, checkout_time, room_type_same: 1 });

    this.getRoomPrice(room_type_id);

    getRoomRateCode({
      market_id,
      order_type_id,
      guest_type_id,
    }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ roomRateCode: data });
      }
    });

    getPreferReason().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ preferReason: data });
        setFieldsValue({
          prefer_reason_id: data[0] && data[0].id,
        });
      }
    });
  }

  handleChangeRoomType = value => {
    const param = {
      room_type_id: value,
      checkin_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      checkout_time: this.props.checkout_time,
    };
    if (this.props.type_id == value) {
      param.room_type_same = 1;
    }

    this.queryRoomNo(param);
    this.getRoomPrice(value);
  };

  queryRoomNo = param => {
    getRoomNo(param).then(rsp => {
      const {
        form: { setFieldsValue },
      } = this.props;
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ roomNos: data });

        setFieldsValue({
          room_no_id: data[0] && data[0].id,
        });
      } else {
        this.setState({ roomNos: [] });
        setFieldsValue({ room_no_id: null });
      }
    });
  };

  getRoomPrice = (room_type_id, code_room_rate_id) => {
    const {
      form: { getFieldValue, setFieldsValue },
      checkin_time,
      checkout_time,
    } = this.props;
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

  handleChangeRoomRateCode = value => {
    this.getRoomPrice(null, value);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        const { order_info_room_id, room_no_id, order_info_id } = this.props || {};

        const param = {
          old_order_info_room_id: order_info_room_id,
          old_room_no_id: room_no_id,
          order_info_id,
          prefer_reason_id: values.prefer_reason_id,
          room_no_id: values.room_no_id,
          room_rate: values.room_rate,
          room_rate_id: values.room_rate_id,
          room_reality_rate: values.room_reality_rate,
          room_type_id: values.room_type_id,
        };

        console.log(param);

        this.setState({ loading: true });
        changeRoom(param).then(rsp => {
          this.setState({ loading: false });
          if (rsp && rsp.code == Constants.SUCCESS) {
            this.props.handleCancle();
            if (this.props.refresh) {
              this.props.refresh();
            }
          }
        });
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16, offset: -2 },
      },
    };

    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Modal
        title="换房"
        visible={this.props.visible}
        onCancel={this.props.handleCancle}
        onOk={this.handleSubmit}
        confirmLoading={this.state.loading}
      >
        <Form {...formItemLayout} className={styles.modalForm}>
          <Form.Item label="房型">
            {getFieldDecorator('room_type_id', {
              rules: [
                {
                  required: true,
                  message: '请选择房型！',
                },
              ],
              initialValue: this.props.type_id,
            })(
              <Select onChange={value => this.handleChangeRoomType(value)}>
                {this.state.roomTypes.map(item => (
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
                {this.state.roomNos.map(item => (
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
              initialValue: this.props.room_rate_id,
            })(
              <Select onChange={value => this.handleChangeRoomRateCode(value)}>
                {this.state.roomRateCode.map(item => (
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
                {this.state.preferReason.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.description}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ChangeRoom);
