import { Modal, Row, Col, Input, Form, Select, message, DatePicker, InputNumber, Icon } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import moment from 'moment';
import {
  getMemberLevel,
  addMember,
  updateMember,
  getMembers,
  checkMemberCard,
} from '@/services/member';
import Dict from '@/dictionary';

const { Option } = Select;

const AddMember = props => {
  useEffect(() => {
    if (props.visible) {
      props.form.resetFields();

      if (props.phone) {
        checkMemberNo();
        checkCardNo();
      }
    }
  }, [props.visible]);

  useEffect(() => {
    getMemberLevel().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setMemberLevel(data);
      }
    });
  }, []);

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

        const {
          member_no,
          member_level_id,
          score,
          phone,
          email,
          company,
          card_no,
          card_type,
          memo,
        } = fieldsValue;

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;

        if (!props.guestBaseId) {
          message.error('缺少客户信息');
          return;
        }

        const data = {
          member: {
            hotel_group_id,
            hotel_id,
            guest_base_id: props.guestBaseId,
            member_no,
            member_level_id,
            score,
            phone,
            email,
            company,
            create_user,
            modify_user: create_user,
            memo,
          },
          card: {
            card_no,
            card_type,
            hotel_group_id,
            hotel_id,
            create_user,
            modify_user: create_user,
          },
        };
        console.log(data);
        setLoading(true);

        addMember(data).then(rsp => {
          setLoading(false);
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '添加成功');
            props.handleCancel(true);
          }
        });
      }
    });
  };

  const [loading, setLoading] = useState(false);
  const [memberLevel, setMemberLevel] = useState([]);

  const checkMemberNo = () => {
    const {
      form: { getFieldValue },
    } = props;
    const member_no = getFieldValue('member_no');
    if (member_no) {
      getMembers({ member_no }).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data;
          if (data && data.length > 0) {
            message.error('该会员编号已存在');
          }
        }
      });
    }
  };

  const checkCardNo = () => {
    const {
      form: { getFieldValue },
    } = props;
    const card_no = getFieldValue('card_no');
    if (card_no) {
      checkMemberCard({ card_no }).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data;
          if (data && data.length > 0) {
            message.error('该会员卡号已存在');
          }
        }
      });
    }
  };

  return (
    <Modal
      title="会员卡"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={720}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="会员编号">
              {getFieldDecorator('member_no', {
                rules: [
                  {
                    required: true,
                    message: '会员编号',
                  },
                ],
                initialValue: props.phone,
              })(<Input onBlur={() => checkMemberNo()} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="会员等级">
              {getFieldDecorator(
                'member_level_id',
                {},
              )(
                <Select>
                  {memberLevel.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="会员积分">
              {getFieldDecorator('score', {})(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电话">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请填写电话',
                  },
                ],
                initialValue: props.phone,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="邮箱">{getFieldDecorator('email', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="工作单位">{getFieldDecorator('company', {})(<Input />)}</Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="会员卡类型">
              {getFieldDecorator('card_type', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="会员卡卡号">
              {getFieldDecorator('card_no', {
                rules: [
                  {
                    required: true,
                    message: '会员卡卡号',
                  },
                ],
                initialValue: props.phone,
              })(<Input onBlur={() => checkCardNo()} />)}
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

export default Form.create()(AddMember);
