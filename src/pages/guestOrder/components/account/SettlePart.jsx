import {
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Input,
  InputNumber,
  message,
  Switch,
} from 'antd';
import styles from '../style.less';
import { useEffect, useState } from 'react';
import { settleAccount } from '@/services/order';
import Constants from '@/constans';
import { connect } from 'dva';
import Dict from '@/dictionary';
import { getSettleAccountType } from '@/services/account';
import { getMemberCard } from '@/services/member';
const { Option } = Select;
const { TextArea } = Input;

const SettlePart = props => {
  const {
    form: { getFieldDecorator },
  } = props;

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

  const [accountCode, setAccountCode] = useState([]);
  const [memberAccount, setMemberAccount] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [memberCardId, setMemberCardId] = useState(props.member_card_id);
  const [initCardNo, setInitCardNo] = useState(null);
  const [initBalance, setInitBalance] = useState(null);

  const [wechatAccount, setWechatAccount] = useState(null);
  const [isWechat, setIsWechat] = useState(false);
  const [isScan, setIsScan] = useState(false);

  useEffect(() => {
    // 账务状态 1-正常，2-结账，3-挂账，4-冲账，5-锁定，6-挂S账'
    const selectAccounts = props.selectAccounts || [];
    const hasDis = selectAccounts.some(
      item => item.status != '1' && item.status != '3' && item.status != '4' && item.status != '6',
    );
    if (hasDis) {
      message.error('包含不可结账账务');
      return;
    }

    let account_type = 0;
    if (props.selectAccountCharge >= 0) {
      account_type = Dict.accountCode.FK;
    } else {
      account_type = Dict.accountCode.TK;
    }
    getSettleAccountType(account_type).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setAccountCode(data);

        const memberArr = data.filter(item => item.account_detail_type == Dict.accountCode.member);
        if (memberArr && memberArr.length > 0) {
          setMemberAccount(memberArr[0]);
        }

        const wechatArr = data.filter(item => item.account_detail_type == Dict.accountCode.wechat);
        if (wechatArr && wechatArr.length > 0) {
          setWechatAccount(wechatArr[0]);
        }

        const {
          form: { setFieldsValue },
        } = props;
        setFieldsValue({ account_code_id: data[0] && data[0].id });
      }
    });

    if (props.guest_type_id == Dict.guestType[1].id) {
      getMemberCard({ id: props.member_card_id }).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          setInitCardNo(data[0] && data[0].card_no);
          setInitBalance(data[0] && data[0].balance);
        }
      });
    }
  }, [props.selectAccountCharge]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        const selectAccountIds = props.selectAccountIds;
        if (!selectAccountIds || selectAccountIds.length < 1) {
          message.error('请选择待结账的账务');
          return;
        }

        const selectAccounts = props.selectAccounts || [];
        // 账务状态 1-正常，2-结账，3-挂账，4-冲账，5-锁定，6-挂S账'
        const hasDis = selectAccounts.some(
          item =>
            item.status != '1' && item.status != '3' && item.status != '4' && item.status != '6',
        );
        if (hasDis) {
          message.error('包含不可结账账务');
          return;
        }

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

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, shift: work_shift, id: create_user } = currentUser;

        let accountIds = [];
        selectAccountIds &&
          selectAccountIds.map(item => {
            accountIds.push({ id: item });
          });

        let pay_account_no = values.pay_account_no;
        if (isWechat && isScan) {
          pay_account_no = 'PayCode-' + pay_account_no;
        }

        const account = {
          account: {
            account_code_id: values.account_code_id,
            account_detail_type,
            account_code,
            description,
            charge: values.charge || 0,
            // company_id: props.company_id || 0,
            hotel_group_id,
            hotel_id,
            order_info_id: props.id,
            order_info_room_id: parseInt(props.order_info_room_id),
            pay_account_no,
            operate_user: create_user,
            room_no_id: props.room_no_id,
            memo: values.memo,
            work_shift,
          },
          accountIds,
        };

        if (account.account.account_detail_type == Dict.accountCode.member) {
          if (values.charge > 0 && values.balance < values.charge) {
            message.error('会员卡余额不足');
            return;
          }
          if (!memberCardId) {
            message.error('请正确填写会员卡');
            return;
          }
          account.account.member_card_id = memberCardId;
        }

        console.log(account);

        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          settleAccount(account).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              console.log(rsp);
              props.form.resetFields();
              message.info('更新成功');
              props.handleCancle();
            }
          });
        }
      }
    });
  };

  const handleAccountCg = value => {
    if (value == memberAccount.id) {
      setIsMember(true);
      setIsWechat(false);
    } else if (value == (wechatAccount && wechatAccount.id)) {
      setIsMember(false);
      setIsWechat(true);
    } else {
      setIsMember(false);
      setIsWechat(false);
    }
  };

  const handleCardNoBlur = () => {
    const cardNo = props.form.getFieldValue('card_no');
    if (cardNo) {
      getMemberCard({ card_no: cardNo }).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          if (data[0]) {
            setMemberCardId(data[0].id);
            props.form.setFieldsValue({ balance: data[0].balance });
          }
        } else {
          setMemberCardId(null);
          props.form.setFieldsValue({ balance: 0 });
        }
      });
    } else {
      setMemberCardId(null);
      props.form.setFieldsValue({ balance: 0 });
    }
  };

  return (
    <Form {...formItemLayout} className={styles.panelForm} onSubmit={handleSubmit}>
      <Form.Item label="应收金额">
        {getFieldDecorator('charge', { initialValue: props.selectAccountCharge })(
          <InputNumber disabled />,
        )}
      </Form.Item>
      <Form.Item label="结账类型">
        {getFieldDecorator('account_code_id', {
          rules: [
            {
              required: true,
              message: '请选择结账类型',
            },
          ],
        })(
          <Select onChange={value => handleAccountCg(value)}>
            {accountCode.map(item => (
              <Option value={item.id} key={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {isMember && (
        <>
          <Form.Item label="会员卡号">
            {getFieldDecorator('card_no', { initialValue: initCardNo })(
              <Input onBlur={() => handleCardNoBlur()} />,
            )}
          </Form.Item>
          <Form.Item label="会员余额">
            {getFieldDecorator('balance', { initialValue: initBalance })(<Input disabled />)}
          </Form.Item>
        </>
      )}
      {isWechat && (
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
      )}
      <Form.Item label={isWechat && isScan ? `条形码` : `付款单号`}>
        {getFieldDecorator('pay_account_no', {})(<Input />)}
      </Form.Item>
      <Form.Item label="备注">{getFieldDecorator('memo', {})(<TextArea />)}</Form.Item>
      <Form.Item wrapperCol={{ offset: 8 }}>
        <Button onClick={props.handleCancle}>取消</Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
          确认
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(SettlePart));
