import { Modal, Form, InputNumber, Input, Button, Select, message, Spin } from 'antd';
import { useEffect } from 'react';
import Dict from '@/dictionary';
import moment from 'moment';
import { connect } from 'dva';
import { saveAccount, wechatAliPay } from '@/services/order';
import Constants from '@/constans';
import { useState } from 'react';

const { TextArea } = Input;
const { Option } = Select;

const ScanPay = props => {
  const {
    form: { getFieldDecorator },
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const { account_code_id, charge, pay_account_no, memo } = props.formValues;
        props.form.setFieldsValue({ account_code_id, charge, pay_account_no, memo });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  const [loading, setLoading] = useState(false);

  const handleAddAccount = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        const { accountCode } = props;
        let account_detail_type = '';
        let account_code = '';
        let description = '';
        accountCode &&
          accountCode.map(item => {
            if (item.id == values.account_code_id) {
              account_detail_type = item.account_detail_type;
              account_code = item.account_code;
              description = item.description;
            }
          });

        const { order_info_id, order_info_room_id, room_no_id } = props.order || {};
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, shift: work_shift, id: create_user } = currentUser;
        const account = {
          accounts: [
            {
              account_code_id: values.account_code_id,
              account_detail_type,
              account_code,
              description,
              quantity: 1,
              price: values.charge || 0,
              charge: values.charge || 0,
              hotel_group_id,
              hotel_id,
              order_info_id,
              order_info_room_id,
              pay_account_no: values.pay_account_no,
              operate_user: create_user,
              room_no_id,
              memo: values.memo,
              work_shift,
            },
          ],
        };

        console.log(account);

        setLoading(true);
        saveAccount(account).then(rsp => {
          setLoading(false);
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.info(rsp.message || '更新成功');
            props.handleCancel();
          }
        });
      }
    });
  };

  const handleScanAccount = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        const { auth_code, account_code_id } = values;
        const { accountCode } = props;
        if (!auth_code) {
          message.error('条形码扫码结果为空');
          return;
        }

        if (!accountCode) {
          message.error('账项代码列表为空');
          return;
        }

        let account_detail_type = '';
        let account_code = '';
        let description = '';
        const wxcontent = /^(10|11|12|13|14|15)\d{16}$/g;
        const alcontent = /^(25|26|27|28|29|30)\d{14,22}$/g;
        for (let i = 0; i < accountCode.length; i++) {
          const item = accountCode[i];
          if (item.id == account_code_id) {
            account_detail_type = item.account_detail_type;
            account_code = item.account_code;
            description = item.description;
            if (account_detail_type == Dict.accountCode.wechat) {
              if (auth_code.search(wxcontent) < 0) {
                message.error('该条形码不是微信条形码');
                return;
              }
              break;
            } else if (account_detail_type == Dict.accountCode.aliPay) {
              if (auth_code.search(alcontent) < 0) {
                message.error('该条形码不是支付宝条形码');
                return;
              }
              break;
            } else {
              message.error('账项代码列表错误');
              return;
            }
          }
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, shift: work_shift, id: create_user } = currentUser;
        const { order_info_id, order_info_room_id, room_no_id } = props.order || {};
        const pay_account_no = 'PayCode-' + auth_code;
        // moment().format('YYYYMMDDHHmmss') + '-' + hotel_group_id + '-' + hotel_id;
        const account = {
          accounts: [
            {
              account_code_id,
              account_detail_type,
              account_code,
              description,
              price: values.charge || 0,
              charge: values.charge || 0,
              hotel_group_id,
              hotel_id,
              order_info_id,
              order_info_room_id,
              pay_account_no,
              operate_user: create_user,
              room_no_id,
              memo: values.memo,
              work_shift,
              // valid: '2',
            },
          ],
        };

        console.log(account);

        setLoading(true);
        saveAccount(account).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            // const payData = {
            //   auth_code: auth_code,
            //   charge: values.charge,
            //   limit_pay: 1,
            //   out_trade_no: pay_account_no,
            // };
            // console.log(payData);
            // wechatAliPay(payData).then(rsp => {
            //   setLoading(false);
            //   if (rsp && rsp.code == Constants.SUCCESS) {
            message.info(rsp.message || '保存成功');
            props.handleCancel();
            // } else {
            //   message.error(rsp.msg || '保存失败');
            //   props.handleCancel();
            // }
            // });
          } else {
            setLoading(false);
          }
        });
      }
    });
  };

  return (
    <Modal
      title="扫码支付"
      width={720}
      visible={props.visible}
      footer={false}
      onCancel={() => props.handleCancel()}
    >
      <Spin spinning={loading}>
        <Form {...formItemLayout}>
          <Form.Item label="账务类型">
            {getFieldDecorator('account_code_id', {
              rules: [
                {
                  required: true,
                  message: '请选择账务类型！',
                },
              ],
            })(
              <Select>
                {props.accountCode &&
                  props.accountCode.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.description}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="金额">
            {getFieldDecorator('charge', {
              rules: [
                {
                  required: true,
                  message: '请输入金额！',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
          {/* <Form.Item label="付款单号(扫码无效)">
            {getFieldDecorator('pay_account_no', {})(<Input />)}
          </Form.Item> */}
          <Form.Item label="条形码">{getFieldDecorator('auth_code', {})(<Input />)}</Form.Item>
          <Form.Item label="备注">{getFieldDecorator('memo', {})(<TextArea />)}</Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            {/* <Button key="addAccount" type="primary" onClick={() => handleAddAccount()}>
              基础入账
            </Button> */}
            <Button
              key="scanAccount"
              type="primary"
              style={{ marginLeft: '20px' }}
              onClick={() => handleScanAccount()}
            >
              扫码入账
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create()(ScanPay);
