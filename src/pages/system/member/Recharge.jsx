import { Modal, Row, Col, Input, Form, InputNumber, message, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { getReceiveAccountType, saveMemberAccount } from '@/services/account';
import Constants from '@/constans';
import Dict from '@/dictionary';
const { Option } = Select;

const Recharge = props => {
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
      props.form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    getReceiveAccountType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setAccount(data);

        const wechatArr = data.filter(item => item.account_detail_type == Dict.accountCode.wechat);
        if (wechatArr && wechatArr.length > 0) {
          setWechatAccount(wechatArr[0]);
        }
      }
    });
  }, []);

  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(false);

  const [wechatAccount, setWechatAccount] = useState(null);
  const [isWechat, setIsWechat] = useState(false);
  const [isScan, setIsScan] = useState(false);

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user, shift } = currentUser;
        const modify_user = create_user;

        let account_detail_type = '';
        let account_code = '';
        let description = '';
        account.map(item => {
          if (item.id == fieldsValue.account_code_id) {
            account_detail_type = item.account_detail_type;
            account_code = item.account_code;
            description = item.description;
          }
        });

        let pay_account_no = fieldsValue.pay_account_no;
        if (isWechat && isScan) {
          pay_account_no = 'PayCode-' + pay_account_no;
        }

        const param = {
          account: [
            {
              member_card_id: props.member.member_card_id,
              account_detail_type,
              account_code,
              account_code_id: fieldsValue.account_code_id,
              charge: fieldsValue.charge,
              description,
              memo: fieldsValue.memo,
              pay_account_no,
              work_shift: shift,
              hotel_group_id,
              hotel_id,
              create_user,
              modify_user,
            },
          ],
          type: '1',
        };

        console.log(param);

        setLoading(true);
        saveMemberAccount(param).then(rsp => {
          setLoading(false);
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '添加成功');
            props.handleCancel(true);
          }
        });
      }
    });
  };

  const handleAccountCg = value => {
    if (value == (wechatAccount && wechatAccount.id)) {
      setIsWechat(true);
    } else {
      setIsWechat(false);
    }
  };

  return (
    <Modal
      title="充值"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="账务类型">
              {getFieldDecorator('account_code_id', {
                rules: [{ required: true, message: '账务类型' }],
              })(
                <Select onChange={value => handleAccountCg(value)}>
                  {account.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          {isWechat && (
            <Col span={12}>
              <Form.Item label="支付方式">
                {getFieldDecorator('isScan', { initialValue: false })(
                  <Switch
                    checkedChildren="扫码"
                    unCheckedChildren="手动"
                    defaultChecked={false}
                    onChange={check => {
                      setIsScan(check);
                      if (check) {
                        message.info(
                          '扫码付款时请鼠标点击条形码输入框,待条形码输入框接收到用户条形码后方可提交',
                          5,
                        );
                      }
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item label="金额">
              {getFieldDecorator('charge', { rules: [{ required: true, message: '金额' }] })(
                <InputNumber style={{ width: '100%' }} placeholder="金额" />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={isWechat && isScan ? `条形码` : `付款单号`}>
              {getFieldDecorator('pay_account_no', {})(<Input />)}
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

export default Form.create()(Recharge);
