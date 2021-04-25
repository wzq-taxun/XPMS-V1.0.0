import { Modal, Row, Col, Form, message, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { saveCodeAccount, updateCodeAccount } from '@/services/system/codeConfig';
import Constants from '@/constans';
import Dict from '@/dictionary';
import { clearOverdueUpload } from '@/services/order';

const ClearModal = props => {
  useEffect(() => {
    if (props.visible) {
      props.form.resetFields();
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
        setLoading(true);
        clearOverdueUpload(fieldsValue.day).then(rsp => {
          setLoading(false);
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '操作成功');
            props.handleCancel(true);
          }
        });
      }
    });
  };

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      title="清除失败上传"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="几天前">
              {getFieldDecorator('day', {
                rules: [{ required: true, message: '天数' }],
              })(<InputNumber min={1} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(ClearModal);
