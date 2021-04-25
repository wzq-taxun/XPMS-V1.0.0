import { Modal, Form, Row, Col, Input, InputNumber, Select, message } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  getCoupons,
  addMemberRechargeRightCoupons,
  updateMemberRechargeRightCoupons,
} from '@/services/member';
import Constants from '@/constans';

const { Option } = Select;

const CouponModal = props => {
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
          addMemberRechargeRightCoupons({
            ...fieldsValue,
            recharge_rights_id: props.rightsId,
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
          updateMemberRechargeRightCoupons({
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
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const { coupon_id, coupon_desc, count, memo } = props.formValues;
        props.form.setFieldsValue({ coupon_id, coupon_desc, count, memo });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  useEffect(() => {
    getCoupons().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setCoupons(list);
      }
    });
  }, []);

  return (
    <Modal
      title="充值优惠卷配置"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={720}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="优惠卷">
              {getFieldDecorator(
                'coupon_id',
                {},
              )(
                <Select disabled={!props.isAdd}>
                  {coupons.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.title}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">{getFieldDecorator('coupon_desc', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="数量">
              {getFieldDecorator('count', {})(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">{getFieldDecorator('memo', {})(<Input />)}</Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(CouponModal);
