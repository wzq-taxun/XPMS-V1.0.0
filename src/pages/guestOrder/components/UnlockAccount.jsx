import Constants from '@/constans';
import { unlockOrderAccount } from '@/services/account';
import { getUsers } from '@/services/system/userManage';
import { Col, DatePicker, Form, Input, message, Modal, Row, Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import moment from 'moment';
const { Option } = Select;

const UnlockAccount = props => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setUsers(list);
      }
    });
  }, []);

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

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        values.end_time = values.end_time && values.end_time.format('YYYY-MM-DD HH:mm:ss');

        setLoading(true);
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          unlockOrderAccount({ ...values, order_info_id: props.orderInfo.id }).then(rsp => {
            setLoading(false);
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '解锁成功');
              props.handleCancel();
            }
          });
        }
      }
    });
  };

  return (
    <Modal
      title="退房"
      visible={props.visible}
      onOk={handleSubmit}
      onCancel={() => props.handleCancel()}
      width={900}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="授权操作人">
              {getFieldDecorator(
                'operate_user',
                {},
              )(
                <Select>
                  <Option value={0} key={0}>
                    所有人
                  </Option>
                  {users &&
                    users.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.username}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="解锁截止">
              {getFieldDecorator('end_time', {
                rules: [
                  {
                    required: true,
                    message: '请选择解锁截止时间',
                  },
                ],
                initialValue: moment()
                  .hour(23)
                  .minute(59)
                  .seconds(59),
              })(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">{getFieldDecorator('memo', {})(<Input />)}</Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(UnlockAccount));
