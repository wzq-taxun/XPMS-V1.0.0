import { Modal, Row, Col, Input, Form, message, InputNumber, Select, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { saveRoomRate, updateRoomRate } from '@/services/system/codeConfig';
import Constants from '@/constans';
import Dict from '@/dictionary';
import { getMarket, getSource, getPackages } from '@/services/checkIn';
import moment from 'moment';
const { Option } = Select;

const RoomRateMoal = props => {
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
          order_type_id,
          market_id,
          source_id,
          packages_id,
          list_order,
          room_rate_code,
          description,
          description_en,
          date_start,
          date_end,
          memo,
          is_private,
        } = props.formValues;
        props.form.setFieldsValue({
          order_type_id,
          market_id,
          source_id,
          packages_id,
          list_order,
          room_rate_code,
          description,
          description_en,
          date_start: moment(date_start),
          date_end: moment(date_end),
          memo,
          is_private,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  useEffect(() => {
    getMarket().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setMarket(data);
      }
    });

    getSource().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setSource(data);
      }
    });

    getPackages().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setPackages(data);
      }
    });
  }, []);

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
          saveRoomRate([
            {
              ...fieldsValue,
              hotel_group_id,
              hotel_id,
              create_user,
              modify_user,
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
          updateRoomRate([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(rsp => {
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
  const [market, setMarket] = useState([]);
  const [source, setSource] = useState([]);
  const [packages, setPackages] = useState([]);

  return (
    <Modal
      title="房价码"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="订单类型">
              {getFieldDecorator('order_type_id', {
                rules: [{ required: true, message: '订单类型' }],
              })(
                <Select>
                  {Dict.orderType.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="市场">
              {getFieldDecorator('market_id', {
                rules: [{ required: true, message: '市场' }],
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
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="来源">
              {getFieldDecorator('source_id', { rules: [{ required: true, message: '来源' }] })(
                <Select>
                  {source.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="包价">
              {getFieldDecorator('packages_id', {
                // rules: [{ required: true, message: '包价' }],
              })(
                <Select>
                  <Option key={0} value={0}>无</Option>
                  {packages.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="房价码">
              {getFieldDecorator('room_rate_code', {
                rules: [{ required: true, message: '房价码' }],
              })(<Input placeholder="房价码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="房价码名">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '房价码名' }],
              })(<Input placeholder="房价码名" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="英文名">
              {getFieldDecorator('description_en', {})(<Input placeholder="英文名" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="是否私有">
              {getFieldDecorator('is_private', { initialValue: '0' })(
                <Select>
                  <Option value="0">不私有</Option>
                  <Option value="1">私有</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
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
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {})(<Input placeholder="备注" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="排序">
              {getFieldDecorator('list_order', {})(<InputNumber placeholder="排序" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(RoomRateMoal);
