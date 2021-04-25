import Constants from '@/constans';
import { addMemberAvailableCoupons, getCoupons } from '@/services/member';
import { Col, Form, Input, InputNumber, message, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
const { Option } = Select;

const AddCoupon = props => {
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

  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    getCoupons().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setCoupons(list);
      }
    });
  }, []);

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        console.log(fieldsValue);

        const { wechat_card_base_id, count, memo } = fieldsValue;
        const { guest_base_id } = props.member;
        const coupon = {
          guest_base_id,
          wechat_card_base_id,
          total: count,
          count,
          memo,
        };
        addMemberAvailableCoupons(coupon).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.info(rsp.message || '添加成功');
            props.handleCancel(true);
          }
        });
      }
    });
  };

  return (
    <Modal
      title="添加优惠卷"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="优惠卷">
              {getFieldDecorator(
                'wechat_card_base_id',
                {},
              )(
                <Select>
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

export default Form.create()(AddCoupon);
