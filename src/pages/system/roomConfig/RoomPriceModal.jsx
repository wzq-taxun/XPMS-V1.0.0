import { Modal, Row, Col, Input, Form, InputNumber, message, Select, DatePicker, Icon } from 'antd';
import { useEffect, useState } from 'react';
import { addRoomPrice, updateRoomPrice } from '@/services/system/roomConfig';
import Constants from '@/constans';
import Dict from '@/dictionary';
import { getRoomType, getMarket, getRoomRateCode } from '@/services/checkIn';
import moment from 'moment';

const { Option } = Select;

const RoomPriceModal = props => {
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
          room_type_id,
          code_room_rate_id,
          date_start,
          date_end,
          rate,
          rate_monday,
          rate_tuesday,
          rate_wednesday,
          rate_thursday,
          rate_friday,
          rate_saturday,
          rate_sunday,
          rate_priority,
          rate_overdue,
          memo,
        } = props.formValues;
        props.form.setFieldsValue({
          room_type_id,
          code_room_rate_id,
          date_start: moment(date_start),
          date_end: moment(date_end),
          rate,
          rate_monday,
          rate_tuesday,
          rate_wednesday,
          rate_thursday,
          rate_friday,
          rate_saturday,
          rate_sunday,
          rate_priority,
          rate_overdue,
          memo,
        });
      } else {
        props.form.resetFields();
      }

      getRoomRateData();
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
          addRoomPrice([
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
          updateRoomPrice([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(rsp => {
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

  const [roomTypes, setRoomTypes] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [roomRates, setRoomRates] = useState([]);

  const [orderTypeId, setOrderTypeId] = useState(0);
  const [marketId, setMarketId] = useState(0);

  useEffect(() => {
    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data;
        setRoomTypes(list);
      }
    });

    getMarket().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data;
        setMarkets(list);
      }
    });
  }, []);

  const getRoomRateData = (market_id, order_type_id) => {
    market_id = market_id || marketId;
    order_type_id = order_type_id || orderTypeId;
    getRoomRateCode({ market_id, order_type_id }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data;
        setRoomRates(list);
      }
    });
  };

  const handleOrderTypeChange = value => {
    setOrderTypeId(value);
    getRoomRateData(null, value);
  };

  const handleMarketChange = value => {
    setMarketId(value);
    getRoomRateData(value);
  };

  const copyPrice = () => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = props;
    const rate = getFieldValue('rate');
    // if (rate) {
    setFieldsValue({
      rate_monday: rate,
      rate_tuesday: rate,
      rate_wednesday: rate,
      rate_thursday: rate,
      rate_friday: rate,
      rate_saturday: rate,
      rate_sunday: rate,
    });
    // }
  };

  return (
    <Modal
      title="房价"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="房型">
              {getFieldDecorator('room_type_id', {
                rules: [{ required: true, message: '房型' }],
              })(
                <Select disabled={!props.isAdd}>
                  {roomTypes.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>

          {props.isAdd && (
            <>
              <Col span={12}>
                <Form.Item label="订单类型">
                  {getFieldDecorator(
                    'order_type_id',
                    {},
                  )(
                    <Select onChange={value => handleOrderTypeChange(value)}>
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
                  {getFieldDecorator(
                    'market_id',
                    {},
                  )(
                    <Select onChange={value => handleMarketChange(value)}>
                      {markets.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.description}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={12}>
            <Form.Item label="房价码">
              {getFieldDecorator('code_room_rate_id', {
                rules: [{ required: true, message: '房价码' }],
              })(
                <Select disabled={!props.isAdd}>
                  {roomRates.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始时间">
              {getFieldDecorator('date_start', {
                rules: [{ required: true, message: '开始时间' }],
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="结束时间">
              {getFieldDecorator('date_end', { rules: [{ required: true, message: '结束时间' }] })(
                <DatePicker format="YYYY-MM-DD" />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="标准房价">
              {getFieldDecorator('rate', { rules: [{ required: true, message: '标准房价' }] })(
                <InputNumber style={{ width: '80%' }} placeholder="标准房价" />,
              )}
              <span style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => copyPrice()}>
                <Icon type="arrow-down" />
              </span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="周一房价">
              {getFieldDecorator('rate_monday', {
                rules: [{ required: true, message: '周一房价' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="周一房价" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="周二房价">
              {getFieldDecorator('rate_tuesday', {
                rules: [{ required: true, message: '周二房价' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="周二房价" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="周三房价">
              {getFieldDecorator('rate_wednesday', {
                rules: [{ required: true, message: '周三房价' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="周三房价" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="周四房价">
              {getFieldDecorator('rate_thursday', {
                rules: [{ required: true, message: '周四房价' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="周四房价" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="周五房价">
              {getFieldDecorator('rate_friday', {
                rules: [{ required: true, message: '周五房价' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="周五房价" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="周六房价">
              {getFieldDecorator('rate_saturday', {
                rules: [{ required: true, message: '周六房价' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="周六房价" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="周日房价">
              {getFieldDecorator('rate_sunday', {
                rules: [{ required: true, message: '周日房价' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="周日房价" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="优先级">
              {getFieldDecorator('rate_priority', {
                rules: [{ required: true, message: '优先级' }],
                initialValue: '1',
              })(
                <Select>
                  <Option value="1">标准房价</Option>
                  <Option value="2">每周房价</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="逾期房费">
              {getFieldDecorator('rate_overdue', {
                rules: [{ required: true, message: '逾期房费' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="逾期房费" />)}
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

export default Form.create()(RoomPriceModal);
