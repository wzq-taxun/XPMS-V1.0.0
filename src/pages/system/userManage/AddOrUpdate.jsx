import { Modal, Row, Col, Input, Form, InputNumber, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import { addUser, updateUser, getAllRoles } from '@/services/system/userManage';
const { Option } = Select;

const AddOrUpdate = props => {
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
    getAllRoles().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setRoles(data);
      }
    });
  }, []);

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const { loginid, username, phone, email, memo } = props.formValues;
        props.form.setFieldsValue({ loginid, username, phone, email, memo });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        if (fieldsValue.roleIds) {
          fieldsValue.roleIds = fieldsValue.roleIds.toString();
        }

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        const modify_user = create_user;
        if (props.isAdd) {
          setLoading(true);
          addUser({
            ...fieldsValue,
            hotel_group_id,
            hotel_id,
            create_user,
            modify_user,
            status: '1',
          }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          setLoading(true);
          updateUser({ ...fieldsValue, id: props.formValues.id, modify_user }).then(rsp => {
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
      title="用户"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="登录账号">
              {getFieldDecorator('loginid', {
                rules: [{ required: true, message: '请输入登录账号' }],
              })(<Input placeholder="登录账号" disabled={!props.isAdd} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '用户名' }],
              })(<Input placeholder="用户名" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电话">
              {getFieldDecorator('phone', {})(<Input placeholder="电话" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="邮箱">{getFieldDecorator('email', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {})(<Input placeholder="备注" />)}
            </Form.Item>
          </Col>
          {props.isAdd && (
            <Col span={12}>
              <Form.Item label="角色组">
                {getFieldDecorator(
                  'roleIds',
                  {},
                )(
                  <Select mode="multiple">
                    {roles.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.description}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(AddOrUpdate);
