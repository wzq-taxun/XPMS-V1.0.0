import {
  Modal,
  Row,
  Col,
  Input,
  Form,
  Select,
  message,
  Divider,
  DatePicker,
  InputNumber,
} from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Constants from '@/constans';
import { getHuoheLockDetailByRoom, addHuoheLock, updateHuoheLock } from '@/services/doorlock';

const { Option } = Select;

const LockHuoheModal = props => {
  const [id, setId] = useState(null);

  useEffect(() => {
    if (props.visible) {
      if (props.record && props.record.lock_id) {
        getHuoheLockDetailByRoom(props.record.lock_id).then(rsp => {
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
              formValue.power_update_time =
                formValue.power_update_time && moment(formValue.power_update_time);
              formValue.comu_status_update_time =
                formValue.comu_status_update_time && moment(formValue.comu_status_update_time);
              formValue.install_time = formValue.install_time && moment(formValue.install_time);
              formValue.guarantee_time_start =
                formValue.guarantee_time_start && moment(formValue.guarantee_time_start);
              formValue.guarantee_time_end =
                formValue.guarantee_time_end && moment(formValue.guarantee_time_end);
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
        fieldsValue.power_update_time =
          fieldsValue.power_update_time &&
          fieldsValue.power_update_time.format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.comu_status_update_time =
          fieldsValue.comu_status_update_time &&
          fieldsValue.comu_status_update_time.format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.install_time =
          fieldsValue.install_time && fieldsValue.install_time.format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.guarantee_time_start =
          fieldsValue.guarantee_time_start &&
          fieldsValue.guarantee_time_start.format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.guarantee_time_end =
          fieldsValue.guarantee_time_end &&
          fieldsValue.guarantee_time_end.format('YYYY-MM-DD HH:mm:ss');
        if (!props.record.lock_id) {
          setLoading(true);
          addHuoheLock({ ...fieldsValue, room_no_id: props.record.id }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          const { room_no, ...data } = fieldsValue;
          setLoading(true);
          updateHuoheLock({ ...data, id }).then(rsp => {
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
      title="火河门锁"
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
            <Form.Item label="门锁分类">
              {getFieldDecorator(
                'lock_kind',
                {},
              )(
                <Select>
                  <Option key="0" value="0">
                    一代协议433门锁
                  </Option>
                  <Option key="1" value="1">
                    蓝牙门锁
                  </Option>
                  <Option key="3" value="3">
                    二代协议433门锁
                  </Option>
                  <Option key="5" value="5">
                    NB门锁
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="门锁型号">
              {getFieldDecorator(
                'type',
                {},
              )(
                <Select>
                  <Option key="1" value="1">
                    蓝牙外门锁 A221
                  </Option>
                  <Option key="2" value="2">
                    433 一代升二代内门锁 120T
                  </Option>
                  <Option key="3" value="3">
                    蓝牙内门锁 A121
                  </Option>
                  <Option key="4" value="4">
                    433 一代升二代外门锁 A220T
                  </Option>
                  <Option key="5" value="5">
                    433 二代内门锁 A120QT
                  </Option>
                  <Option key="32" value="32">
                    433 二代内门锁 A130
                  </Option>
                  <Option key="48" value="48">
                    433 二代外门锁 A230
                  </Option>
                  <Option key="49" value="49">
                    433 二代外门锁带刷身份 证 A230ID
                  </Option>
                  <Option key="50" value="50">
                    NB 门锁 A232
                  </Option>
                  <Option key="" value="">
                    433 一代门锁 A120 和 A220
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="软件版本">
              {getFieldDecorator('software_version', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="最新软件版本">
              {getFieldDecorator('new_software_version', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="硬件版本">
              {getFieldDecorator('hardware_version', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="门锁编码">{getFieldDecorator('lock_no', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="网关编码">{getFieldDecorator('node_no', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电池电量(0-100)">
              {getFieldDecorator('power', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电量更新时间">
              {getFieldDecorator(
                'power_update_time',
                {},
              )(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="网关通信状态">
              {getFieldDecorator(
                'node_comu_status',
                {},
              )(
                <Select>
                  <Option key="00" value="00">
                    通信正常
                  </Option>
                  <Option key="01" value="01">
                    通信异常
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="门锁通信状态">
              {getFieldDecorator(
                'comu_status',
                {},
              )(
                <Select>
                  <Option key="00" value="00">
                    通信正常
                  </Option>
                  <Option key="01" value="01">
                    通信异常
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="通信状态更新">
              {getFieldDecorator(
                'comu_status_update_time',
                {},
              )(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="锁信号强度">
              {getFieldDecorator('rssi', {})(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="安装地区">{getFieldDecorator('region', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="安装地址">{getFieldDecorator('address', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="房源编码">{getFieldDecorator('house_code', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="房间编码">{getFieldDecorator('room_code', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="是否支持门磁">
              {getFieldDecorator(
                'magnet_flag',
                {},
              )(
                <Select>
                  <Option key={0} value={0}>
                    不支持
                  </Option>
                  <Option key={1} value={1}>
                    支持
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="门状态">
              {getFieldDecorator(
                'open_door_status',
                {},
              )(
                <Select>
                  <Option key="0" value="0">
                    门开
                  </Option>
                  <Option key="1" value="1">
                    门关
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="安装日期">
              {getFieldDecorator(
                'install_time',
                {},
              )(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="质保日期（起）">
              {getFieldDecorator(
                'guarantee_time_start',
                {},
              )(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="质保日期（止）">
              {getFieldDecorator(
                'guarantee_time_end',
                {},
              )(<DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">{getFieldDecorator('description', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="SIM卡卡号">{getFieldDecorator('imsi', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="模组">{getFieldDecorator('imei', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="模组版本">
              {getFieldDecorator('nb_revision', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="工作模式">{getFieldDecorator('work_mode', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始时间">{getFieldDecorator('psm_start', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="结束时间">{getFieldDecorator('psm_end', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="密码有效时长">
              {getFieldDecorator('psw_consult', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="本地密码修改">
              {getFieldDecorator(
                'fuc_flag',
                {},
              )(
                <Select>
                  <Option key={0} value={0}>
                    关闭
                  </Option>
                  <Option key={1} value={1}>
                    开启
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="支持蓝牙">
              {getFieldDecorator(
                'bluetooth_flag',
                {},
              )(
                <Select>
                  <Option key={0} value={0}>
                    支持
                  </Option>
                  <Option key={1} value={1}>
                    不支持
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="支持刷卡">
              {getFieldDecorator(
                'card_flag',
                {},
              )(
                <Select>
                  <Option key={0} value={0}>
                    支持
                  </Option>
                  <Option key={1} value={1}>
                    不支持
                  </Option>
                </Select>,
              )}
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

export default Form.create()(LockHuoheModal);
