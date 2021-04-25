import { Modal, Row, Col, Input, Form, message, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import { addMaintain, updateMaintain } from '@/services/rooms';
import moment from 'moment';

const MaintainModal = props => {
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
        const { code, description, description_en, date_start, date_end, memo } = props.formValues;
        props.form.setFieldsValue({
          code,
          description,
          description_en,
          date_start: moment(date_start),
          date_end: moment(date_end),
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
        fieldsValue.date_start =
          fieldsValue.date_start && fieldsValue.date_start.format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.date_end =
          fieldsValue.date_end && fieldsValue.date_end.format('YYYY-MM-DD HH:mm:ss');

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        const modify_user = create_user;

        if (props.isAdd) {
          setLoading(true);
          addMaintain([
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
          updateMaintain([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(rsp => {
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
      title="维修房"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="代码">
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入代码' }],
              })(<Input placeholder="代码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="中文">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '中文' }],
              })(<Input placeholder="中文" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="英文">
              {getFieldDecorator('description_en', {})(<Input placeholder="英文" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始">
              {getFieldDecorator('date_start', {
                rules: [{ required: true, message: '开始' }],
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="截止">
              {getFieldDecorator('date_end', { rules: [{ required: true, message: '截止' }] })(
                <DatePicker format="YYYY-MM-DD" />,
              )}
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

export default Form.create()(MaintainModal);
