import { Modal, Row, Col, Input, Form, InputNumber, message } from 'antd';
import { useEffect, useState } from 'react';
import { saveSource, updateSource } from '@/services/system/codeConfig';
import Constants from '@/constans';

const SourceMoal = props => {
  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const { source_code, description, memo, line_up } = props.formValues;
        props.form.setFieldsValue({ source_code, description, memo, line_up });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

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

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        const modify_user = create_user;
        if (props.isAdd) {
          setLoading(true);
          saveSource([
            {
              ...fieldsValue,
              hotel_group_id,
              hotel_id,
              create_user,
              modify_user,
              sys_dict_id: 4,
            },
          ]).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          setLoading(true);
          updateSource([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(rsp => {
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

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      title="来源"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="代码">
              {getFieldDecorator('source_code', {
                rules: [{ required: true, message: '请输入代码' }],
              })(<Input placeholder="代码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="名称">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '名称' }],
              })(<Input placeholder="名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="描述">
              {getFieldDecorator('memo', {})(<Input placeholder="描述" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="排序">
              {getFieldDecorator('line_up', {})(<InputNumber placeholder="排序" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(SourceMoal);
