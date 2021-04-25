import { Modal, Row, Col, Input, Form, Select, message, Divider, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Constants from '@/constans';
import { getTuyaLockDetailByRoom, addTuyaLock, updateTuyaLock } from '@/services/doorlock';

const { Option } = Select;

const LockTuyaModal = props => {
  const [id, setId] = useState(null);

  useEffect(() => {
    if (props.visible) {
      if (props.record && props.record.lock_id) {
        getTuyaLockDetailByRoom(props.record.lock_id).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            const data = rsp.data || [];
            if (data.length > 0) {
              const {
                hotel_group_id,
                hotel_id,
                id,
                room_no_id,
                valid,
                create_user,
                create_time,
                modify_user,
                modify_time,
                ...formValue
              } = data[0];
              formValue.room_no = props.record.room_no;
              formValue.active_time = formValue.active_time && moment(formValue.active_time);
              formValue.update_time = formValue.update_time && moment(formValue.update_time);
              setId(id);
              props.form.setFieldsValue(formValue);
            }
          }
        });
      }
    } else {
      props.form.resetFields();
      setId(null);
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
        console.log(fieldsValue);
        fieldsValue.active_time =
          fieldsValue.active_time && fieldsValue.active_time.format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.update_time =
          fieldsValue.update_time && fieldsValue.update_time.format('YYYY-MM-DD HH:mm:ss');
        if (!props.record.lock_id) {
          setLoading(true);
          addTuyaLock({ ...fieldsValue, room_no_id: props.record.id }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          const { room_no, ...data } = fieldsValue;
          setLoading(true);
          updateTuyaLock({ ...data, id }).then(rsp => {
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
      title="涂鸦门锁"
      visible={props.visible}
      width={720}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="房号">
              {getFieldDecorator('room_no', { initialValue: props.record && props.record.room_no })(
                <Input disabled />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="硬件ID">{getFieldDecorator('device_id', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="是否子设备">
              {getFieldDecorator(
                'is_sub',
                {},
              )(
                <Select>
                  <Option key="1" value="1">
                    是
                  </Option>
                  <Option key="0" value="0">
                    否
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="本地key">{getFieldDecorator('local_key', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="所有者id">{getFieldDecorator('owner_id', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备IP">{getFieldDecorator('ip', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="biz类型">{getFieldDecorator('biz_type', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备图标">{getFieldDecorator('icon', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="uuid">{getFieldDecorator('uuid', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="产品名称">
              {getFieldDecorator('product_name', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="活跃时间">
              {getFieldDecorator(
                'active_time',
                {},
              )(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="用户id">{getFieldDecorator('uid', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="更新时间">
              {getFieldDecorator(
                'update_time',
                {},
              )(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="产品id">{getFieldDecorator('product_id', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备名称">{getFieldDecorator('name', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备类别">{getFieldDecorator('category', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">{getFieldDecorator('memo', {})(<Input />)}</Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(LockTuyaModal);
