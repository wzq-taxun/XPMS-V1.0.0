import { Modal, Row, Col, Input, Form, InputNumber, message } from 'antd';
import { useEffect, useState } from 'react';
import { addFloor, updateFloor } from '@/services/system/roomConfig';
import Constants from '@/constans';

const FloorModal = props => {
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
        const { floor_code, floor_no, floor_no_en, list_no, memo } = props.formValues;
        props.form.setFieldsValue({ floor_code, floor_no, floor_no_en, list_no, memo });
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
          addFloor([{ ...fieldsValue, hotel_group_id, hotel_id, create_user, modify_user }]).then(
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
          updateFloor([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(rsp => {
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
      title="楼层"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="代码">
              {getFieldDecorator('floor_code', {
                rules: [{ required: true, message: '请输入代码' }],
              })(<Input placeholder="代码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="中文">
              {getFieldDecorator('floor_no', {
                rules: [{ required: true, message: '中文' }],
              })(<Input placeholder="中文" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="英文">
              {getFieldDecorator('floor_no_en', {})(<Input placeholder="英文" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="排序">{getFieldDecorator('list_no', {})(<InputNumber />)}</Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
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

export default Form.create()(FloorModal);
