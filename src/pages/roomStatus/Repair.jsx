import { Modal, Form, Input, DatePicker, Select, Button, message } from 'antd';
import { Component } from 'react';
import styles from './style.less';
import moment from 'moment';
import { repairRoom, getRepairReason } from '@/services/rooms';
import Constants from '@/constans';
const { Option } = Select;

class Repair extends Component {
  state = {
    reason: [],
    reasonObj: {},
  };

  componentDidMount() {
    getRepairReason().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        let reasonObj = {};
        list.map(item => {
          reasonObj[item.id] = item;
        });
        this.setState({ reason: list, reasonObj });
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        const { room_no, room_no_id } = this.props;
        const reasonObj = this.state.reasonObj || {};
        const param = [
          {
            maintain_code_id: values.maintain_code_id,
            maintain_code: reasonObj[values.maintain_code_id].code,
            description: reasonObj[values.maintain_code_id].description,
            date_start: values.date_start.format('YYYY-MM-DD HH:mm:ss'),
            date_end: values.date_end.format('YYYY-MM-DD HH:mm:ss'),
            create_user,
            modify_user: create_user,
            maintain_user: create_user,
            hotel_group_id,
            hotel_id,
            room_no,
            room_no_id,
            memo: values.memo,
          },
        ];

        console.log(param);
        repairRoom(param).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '更新成功');
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
        title="维修房"
        visible={this.props.visible}
        onCancel={this.props.handleCancle}
        onOk={this.handleSubmit}
      >
        <Form {...formItemLayout} className={styles.modalForm}>
          <Form.Item label="房间号">
            {getFieldDecorator('room_no', { initialValue: this.props.room_no })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="开始时间">
            {getFieldDecorator('date_start', {
              rules: [{ required: true, message: '请选择开始时间' }],
              initialValue: moment(),
            })(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
          <Form.Item label="结束时间">
            {getFieldDecorator('date_end', {
              rules: [{ required: true, message: '请选择结束时间' }],
            })(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
          <Form.Item label="原因">
            {getFieldDecorator('maintain_code_id', {
              rules: [{ required: true, message: '请选择原因' }],
            })(
              <Select>
                {this.state.reason.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.description}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="备注">{getFieldDecorator('memo', {})(<Input />)}</Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Repair);
