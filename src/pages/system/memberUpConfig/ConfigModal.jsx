import { Modal, Form, Row, Col, Input, InputNumber, Select, message } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { getMemberLevel, addMemberUpConfigs, updateMemberUpConfigs } from '@/services/member';
import Constants from '@/constans';

const { Option } = Select;

const ConfigModal = props => {
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
          if (fieldsValue.old_level == 0) {
            delete fieldsValue.old_level;
          }

          switch (fieldsValue.type) {
            case 'RECHARGE':
              fieldsValue.name = '储值';
              break;
            case 'BUY':
              fieldsValue.name = '购买';
              break;
            case 'SCORE':
              fieldsValue.name = '积分兑换';
              break;
            case 'ORDER':
              fieldsValue.name = '首单';
            case 'SYS':
              fieldsValue.name = '平台设置';
              break;
            default:
              break;
          }

          addMemberUpConfigs({
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
          updateMemberUpConfigs({
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
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    getMemberLevel().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setLevels(list);
      }
    });
  }, []);

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const { old_level, new_level, type, description, consume, memo } = props.formValues;
        props.form.setFieldsValue({
          old_level,
          new_level,
          type,
          description,
          consume,
          memo,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  return (
    <Modal
      title="升级配置"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={720}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="升级前等级">
              {getFieldDecorator(
                'old_level',
                {},
              )(
                <Select disabled={!props.isAdd}>
                  <Option value={0}>无</Option>
                  {levels.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="升级后等级">
              {getFieldDecorator('new_level', {
                rules: [
                  {
                    required: true,
                    message: '升级后等级',
                  },
                ],
              })(
                <Select disabled={!props.isAdd}>
                  {levels.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="升级方式">
              {getFieldDecorator(
                'type',
                {},
              )(
                <Select disabled={!props.isAdd}>
                  <Option value={'RECHARGE'}>储值</Option>
                  <Option value={'BUY'}>购买</Option>
                  <Option value={'SCORE'}>积分兑换</Option>
                  <Option value={'ORDER'}>首单</Option>
                  <Option value={'SYS'}>平台设置</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">{getFieldDecorator('description', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="升级消耗">
              {getFieldDecorator('consume', {})(<InputNumber style={{ width: '100%' }} />)}
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

export default Form.create()(ConfigModal);
