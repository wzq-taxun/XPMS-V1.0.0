import { Modal, Row, Col, Input, Form, InputNumber, message, Select, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import moment from 'moment';
import { saveSalesMan, updateSalesMan } from '@/services/system/codeConfig';

const { Option } = Select;

const SalesManModal = props => {
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

  const {
    form: { getFieldDecorator },
  } = props;

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const {
          code,
          name,
          is_fulltime,
          sex,
          age,
          birthday,
          telephone,
          fax,
          email,
          join_date,
          country,
          city,
          address1,
          address2,
          memo,
        } = props.formValues;
        props.form.setFieldsValue({
          code,
          name,
          is_fulltime,
          sex,
          age,
          birthday: birthday && moment(birthday),
          telephone,
          fax,
          email,
          join_date: join_date && moment(join_date),
          country,
          city,
          address1,
          address2,
          memo,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        fieldsValue.birthday =
          fieldsValue.birthday && fieldsValue.birthday.format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.join_date =
          fieldsValue.join_date && fieldsValue.join_date.format('YYYY-MM-DD HH:mm:ss');

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        const modify_user = create_user;
        if (props.isAdd) {
          setLoading(true);
          saveSalesMan({ ...fieldsValue, hotel_group_id, hotel_id, create_user, modify_user }).then(
            rsp => {
              setLoading(false);
              if (rsp && rsp.code == Constants.SUCCESS) {
                message.success(rsp.message || '添加成功');
                props.handleCancel(true);
              }
            },
          );
        } else {
          setLoading(true);
          updateSalesMan({ ...fieldsValue, id: props.formValues.id, modify_user }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '修改成功');
              props.handleCancel(true);
            }
          });
        }
      }
    });
  };

  return (
    <Modal
      title="销售员"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="编码">
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入编码' }],
              })(<Input placeholder="编码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '姓名' }],
              })(<Input placeholder="姓名" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="全职">
              {getFieldDecorator(
                'is_fulltime',
                {},
              )(
                <Select>
                  <Option value="1" key="1">
                    是
                  </Option>
                  <Option value="0" key="0">
                    否
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="性别">
              {getFieldDecorator(
                'sex',
                {},
              )(
                <Select>
                  <Option value="1" key="1">
                    男
                  </Option>
                  <Option value="2" key="2">
                    女
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="年龄">
              {getFieldDecorator(
                'age',
                {},
              )(<InputNumber placeholder="年龄" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="出生日期">
              {getFieldDecorator(
                'birthday',
                {},
              )(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电话">
              {getFieldDecorator('telephone', {})(<Input placeholder="电话" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="传真">
              {getFieldDecorator('fax', {})(<Input placeholder="传真" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {})(<Input placeholder="邮箱" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="国家">
              {getFieldDecorator('country', {})(<Input placeholder="国家" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="城市">
              {getFieldDecorator('city', {})(<Input placeholder="城市" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="地址1">
              {getFieldDecorator('address1', {})(<Input placeholder="地址1" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="地址2">
              {getFieldDecorator('address2', {})(<Input placeholder="地址2" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="加入日期">
              {getFieldDecorator(
                'join_date',
                {},
              )(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {})(<Input placeholder="备注" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(SalesManModal);
