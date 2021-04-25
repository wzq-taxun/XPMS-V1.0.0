import { Modal, Form, Row, Col, Input, InputNumber, Select, message } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { addMemberRechargeRights, updateMemberRechargeRights } from '@/services/member';
import Constants from '@/constans';

const { Option } = Select;

const RightsModal = props => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 14 },
    },
  };

  const {
    form: { getFieldDecorator },
  } = props;

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        console.log(fieldsValue);

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;

        setLoading(true);
        if (props.isAdd) {
          switch (fieldsValue.type) {
            case 'COUPON':
              fieldsValue.name = '优惠卷';
              break;
            default:
              break;
          }

          addMemberRechargeRights({
            ...fieldsValue,
            hotel_group_id,
            create_user,
            modify_user: create_user,
          }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          updateMemberRechargeRights({
            ...fieldsValue,
            id: props.formValues.id,
            modify_user: create_user,
          }).then(rsp => {
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

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const { start_recharge, end_recharge, type, description, memo } = props.formValues;
        props.form.setFieldsValue({ start_recharge, end_recharge, type, description, memo });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  return (
    <Modal
      title="充值权益配置"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={720}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="最低起充(含)">
              {getFieldDecorator('start_recharge', {})(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="截止金额(不含)">
              {getFieldDecorator('end_recharge', {})(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="权益类型">
              {getFieldDecorator('type', { initialValue: 'COUPON' })(
                <Select disabled={!props.isAdd}>
                  <Option value={'COUPON'}>优惠卷</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">{getFieldDecorator('description', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">{getFieldDecorator('memo', {})(<Input />)}</Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(RightsModal);
