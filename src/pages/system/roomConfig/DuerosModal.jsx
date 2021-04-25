import { Modal, Row, Col, Input, Form, message, Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import { getRoomDueros, updateRoomDueros, addRoomDueros } from '@/services/device';
const { Option } = Select;

const DuerosModal = props => {
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

  const [duerosId, setDuerosId] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (props.visible) {
      if (props.record && props.record.id) {
        setRoomId(props.record.id);
        getRoomDueros(props.record.id).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            const list = rsp.data || [];
            if (list.length > 0) {
              const { id, cuid, memo, valid } = list[0];
              setDuerosId(id);
              props.form.setFieldsValue({ cuid, memo, valid });
            }
          }
        });
      }
    } else {
      setDuerosId(null);
      props.form.resetFields();
    }
  }, [props.visible]);

  const [loading, setLoading] = useState(false);

  const handleRemove = () => {
    if (duerosId) {
      setLoading(true);
      updateRoomDueros({ id: duerosId, valid: '0' }).then(rsp => {
        setLoading(false);
        if (rsp && rsp.code == Constants.SUCCESS) {
          message.success(rsp.message || '移除成功');
          props.handleCancel(true);
        }
      });
    }
  };

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        if (duerosId) {
          setLoading(true);
          updateRoomDueros({ ...fieldsValue, id: duerosId }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '修改成功');
              props.handleCancel(true);
            }
          });
        } else {
          setLoading(true);
          addRoomDueros({ ...fieldsValue, room_id: roomId }).then(rsp => {
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
      title="小度配置"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
      // footer={[
      //   <Button key="cancel" onClick={props.handleCancel()}>
      //     取消
      //   </Button>,
      //   <Button key="remove" type="danger" loading={loading} onClick={handleRemove}>
      //     移除
      //   </Button>,
      //   <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
      //     确认
      //   </Button>,
      // ]}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="设备id">
              {getFieldDecorator('cuid', {})(<Input placeholder="设备id" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {})(<Input placeholder="备注" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="有效">
              {getFieldDecorator('valid', { initialValue: '1' })(
                <Select>
                  <Option key="1" value="1">
                    有效
                  </Option>
                  <Option key="0" value="0">
                    无效
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(DuerosModal);
