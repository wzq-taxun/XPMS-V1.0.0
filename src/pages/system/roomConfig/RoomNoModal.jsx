import { Modal, Row, Col, Input, Form, InputNumber, Select, message, Divider } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import { getFloors } from '@/services/rooms';
import { getRoomType } from '@/services/checkIn';
import { getBedType, addRoom, updateRoom } from '@/services/system/roomConfig';

const { Option } = Select;

const RoomNoModal = props => {
  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const {
          room_floor_id,
          room_no,
          room_type_id,
          room_bed_type_id,
          bed_num,
          room_area,
          has_window,
        } = props.formValues;
        props.form.setFieldsValue({
          room_floor_id: { key: room_floor_id },
          room_no,
          room_type_id,
          room_bed_type_id,
          bed_num,
          room_area,
          has_window,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  useEffect(() => {
    getFloors().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setFloors(data);
      }
    });

    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setRoomTypes(data);
      }
    });

    getBedType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setBedTypes(data);
      }
    });
  }, []);

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
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (props.isAdd) {
          console.log(fieldsValue);

          let roomNos = [];
          const { room_no_start, room_no_end } = fieldsValue;
          if (null == room_no_end) {
            roomNos.push(room_no_start);
          } else {
            const start = parseInt(room_no_start);
            const end = parseInt(room_no_end);
            if (start > end) {
              message.error('结束房号小于起始房号');
              return;
            }
            for (let i = start; i <= end; i++) {
              roomNos.push(i + '');
            }
          }

          let data = [];
          roomNos.map(item => {
            data.push({
              bed_num: fieldsValue.bed_num,
              create_user: currentUser.id,
              has_window: fieldsValue.has_window,
              hotel_group_id: currentUser.hotel_group_id,
              hotel_id: currentUser.hotel_id,
              modify_user: currentUser.id,
              room_area: fieldsValue.room_area,
              room_bed_type_id: fieldsValue.room_bed_type_id,
              room_floor: fieldsValue.room_floor_id.label,
              room_floor_id: fieldsValue.room_floor_id.key,
              room_no: item,
              room_type_id: fieldsValue.room_type_id,
            });
          });

          // const data = [
          //   {
          //     bed_num: fieldsValue.bed_num,
          //     create_user: currentUser.id,
          //     has_window: fieldsValue.has_window,
          //     hotel_group_id: currentUser.hotel_group_id,
          //     hotel_id: currentUser.hotel_id,
          //     modify_user: currentUser.id,
          //     room_area: fieldsValue.room_area,
          //     room_bed_type_id: fieldsValue.room_bed_type_id,
          //     room_floor: fieldsValue.room_floor_id.label,
          //     room_floor_id: fieldsValue.room_floor_id.key,
          //     room_no: fieldsValue.room_no,
          //     room_type_id: fieldsValue.room_type_id,
          //   },
          // ];
          console.log(data);

          setLoading(true);
          addRoom(data).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          const data = [
            {
              id: props.formValues.id,
              bed_num: fieldsValue.bed_num,
              has_window: fieldsValue.has_window,
              modify_user: currentUser.id,
              room_area: fieldsValue.room_area,
              room_bed_type_id: fieldsValue.room_bed_type_id,
              room_floor: fieldsValue.room_floor_id.label,
              room_floor_id: fieldsValue.room_floor_id.key,
              room_no: fieldsValue.room_no,
              room_type_id: fieldsValue.room_type_id,
            },
          ];
          console.log(data);

          setLoading(true);
          updateRoom(data).then(rsp => {
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

  const [loading, setLoading] = useState(false);
  const [floors, setFloors] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [bedTypes, setBedTypes] = useState([]);

  return (
    <Modal
      title="房号"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          {props.isAdd ? (
            <>
              <Col span={12}>
                <Form.Item label="开始房号">
                  {getFieldDecorator('room_no_start', {
                    rules: [{ required: true, message: '开始(包含)' }],
                  })(<Input placeholder="始(含)" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="结束房号">
                  {getFieldDecorator(
                    'room_no_end',
                    {},
                  )(<Input placeholder="结束(包含)(单个可空)" />)}
                </Form.Item>
              </Col>
            </>
          ) : (
            <Col span={12}>
              <Form.Item label="房号">
                {getFieldDecorator('room_no', { rules: [{ required: true, message: '房号' }] })(
                  <Input placeholder="房号" />,
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item label="楼层">
              {getFieldDecorator('room_floor_id', {
                rules: [{ required: true, message: '楼层' }],
              })(
                <Select labelInValue>
                  {floors.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.floor_no}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          {/* </Row>
        <Row gutter={8}> */}
          <Col span={12}>
            <Form.Item label="房型">
              {getFieldDecorator('room_type_id', {
                rules: [{ required: true, message: '房型' }],
              })(
                <Select>
                  {roomTypes.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="床型">
              {getFieldDecorator(
                'room_bed_type_id',
                {},
              )(
                <Select>
                  {bedTypes.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          {/* </Row>
        <Row gutter={8}> */}
          <Col span={12}>
            <Form.Item label="床数">
              {getFieldDecorator(
                'bed_num',
                {},
              )(<InputNumber style={{ width: '100%' }} placeholder="床数" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="面积">
              {getFieldDecorator(
                'room_area',
                {},
              )(<InputNumber style={{ width: '100%' }} placeholder="面积" />)}
            </Form.Item>
          </Col>
          {/* </Row>
        <Row gutter={8}> */}
          <Col span={12}>
            <Form.Item label="是否有窗">
              {getFieldDecorator(
                'has_window',
                {},
              )(
                <Select>
                  <Option value="1">有</Option>
                  <Option value="0">无</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(RoomNoModal);
