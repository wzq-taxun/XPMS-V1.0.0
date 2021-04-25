import { Modal, Form, Row, Col, Input, InputNumber, Select, message } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { addMemberUpRights, updateMemberUpRights } from '@/services/member';
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
            case 'SCORE':
              fieldsValue.name = '积分';
              break;
            default:
              break;
          }

          addMemberUpRights({
            ...fieldsValue,
            hotel_group_id,
            up_config_id: props.upConfigId,
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
          updateMemberUpRights({
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
  const [isScore, setIsScore] = useState(false);

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const { type, description, score, memo } = props.formValues;
        props.form.setFieldsValue({ type, description, score, memo });
        if (type == 'SCORE') {
          setIsScore(true);
        } else {
          setIsScore(false);
        }
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  return (
    <Modal
      title="升级权益配置"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={720}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="权益类型">
              {getFieldDecorator(
                'type',
                {},
              )(
                <Select
                  disabled={!props.isAdd}
                  onChange={value => {
                    if (value == 'SCORE') {
                      setIsScore(true);
                    } else {
                      setIsScore(false);
                    }
                  }}
                >
                  <Option value={'COUPON'}>优惠卷</Option>
                  <Option value={'SCORE'}>积分</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">{getFieldDecorator('description', {})(<Input />)}</Form.Item>
          </Col>
          {isScore && (
            <Col span={12}>
              <Form.Item label="赠送积分">
                {getFieldDecorator('score', {})(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item label="备注">{getFieldDecorator('memo', {})(<Input />)}</Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(RightsModal);
