import { Modal, Row, Col, Input, Form, Select, message, InputNumber, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import { getMarket } from '@/services/checkIn';
import moment from 'moment';
import { saveMemberLevel, updateMemberLevel } from '@/services/system/codeConfig';
const { Option } = Select;

const MarketMoal = props => {
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
        const {
          code,
          description,
          description_en,
          // market_id,
          is_private,
          integral_radio,
          date_start,
          date_end,
          memo,
        } = props.formValues;
        props.form.setFieldsValue({
          code,
          description,
          description_en,
          // market_id,
          is_private,
          integral_radio,
          date_start: moment(date_start),
          date_end: moment(date_end),
          memo,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  // useEffect(() => {
  //   getMarket().then(rsp => {
  //     if (rsp && rsp.code == Constants.SUCCESS) {
  //       const data = rsp.data || [];
  //       setMarket(data);
  //     }
  //   });
  // }, []);

  // const [market, setMarket] = useState([]);
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
          saveMemberLevel([
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
          updateMemberLevel([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(
            rsp => {
              setLoading(false);
              if (rsp && rsp.code == Constants.SUCCESS) {
                message.success(rsp.message || '修改成功');
                props.handleCancel(true);
              }
            },
          );
        }
      }
    });
  };

  return (
    <Modal
      title="会员等级"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={() => handleSubmit()}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="编码">
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入编码' }],
              })(<Input placeholder="编码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="名称">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '名称' }],
              })(<Input placeholder="名称" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="英文">
              {getFieldDecorator('description_en', {})(<Input placeholder="英文" />)}
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item label="市场">
              {getFieldDecorator('market_id', {
                rules: [{ required: true, message: '请选择市场' }],
              })(
                <Select>
                  {market.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item label="是否私有">
              {getFieldDecorator('is_private', {
                initialValue: '0',
              })(
                <Select>
                  <Option value={'0'}>不私有</Option>
                  <Option value={'1'}>私有</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="积分比例">
              {getFieldDecorator('integral_radio', {
                rules: [{ required: true, message: '英文' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="起始">
              {getFieldDecorator('date_start', {
                rules: [{ required: true, message: '起始' }],
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="截止">
              {getFieldDecorator('date_end', {
                rules: [{ required: true, message: '截止' }],
              })(<DatePicker format="YYYY-MM-DD" />)}
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

export default Form.create()(MarketMoal);
