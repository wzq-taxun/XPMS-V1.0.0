import { Modal, Row, Col, Input, Form, InputNumber, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import { saveRole } from '@/services/system/roleManage';
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
    if (props.visible) {
      if (props.formValues) {
        const { name, description, memo } = props.formValues;
        props.form.setFieldsValue({ name, description, memo });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        const modify_user = create_user;
        if (props.isAdd) {
          setLoading(true);
          saveRole({
            ...fieldsValue,
            // hotel_group_id,
            // hotel_id,
            create_user,
            modify_user,
          }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          setLoading(true);
          saveRole({ ...fieldsValue, id: props.formValues.id, modify_user }).then(rsp => {
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
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称' }],
              })(<Input placeholder="名称" disabled={!props.isAdd} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '描述' }],
              })(<Input placeholder="描述" />)}
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

export default Form.create()(AddOrUpdate);
