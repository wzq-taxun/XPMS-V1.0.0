import { Modal, Row, Col, Input, Form, message } from 'antd';
import { useEffect } from 'react';
import { addRoomType, updateRoomType } from '@/services/system/roomConfig';
import Constants from '@/constans';
import { useState } from 'react';

const RoomTypeModal = props => {
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
        const { code, name, description } = props.formValues;
        props.form.setFieldsValue({ code, name, description });
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
          addRoomType([
            { ...fieldsValue, hotel_group_id, hotel_id, create_user, modify_user },
          ]).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          setLoading(true);
          updateRoomType([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        }
      }
    });
  };

  return (
    <Modal
      title="房型"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="代码">
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入代码' }],
              })(<Input placeholder="代码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '名称' }],
              })(<Input placeholder="名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="描述">
              {getFieldDecorator('description', {})(<Input placeholder="描述" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(RoomTypeModal);
