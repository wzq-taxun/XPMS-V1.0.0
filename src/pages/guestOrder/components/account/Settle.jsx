import { Form, Select, Button, Input, InputNumber, message, Modal } from 'antd';
import styles from '../style.less';
import { useEffect, useState } from 'react';
import { getOrderAccountSum, settleOrderAccount, checkOut } from '@/services/order';
import {
  closeSingleWithExtra,
  getCloseSingleAccount,
  getSettleAccountType,
} from '@/services/account';
import Constants from '@/constans';
import { connect } from 'dva';
import Dict from '@/dictionary';
import { getMemberCard } from '@/services/member';
import CheckOut from './CheckOut';
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const Settle = props => {
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
  const [charge, setCharge] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [memberCardId, setMemberCardId] = useState(props.member_card_id);
  const [initCardNo, setInitCardNo] = useState(null);
  const [initBalance, setInitBalance] = useState(null);

  const [needAdd, setNeedAdd] = useState(false);
  const [additionalId, setAdditionalId] = useState(null);
  const [initAddCharge, setInitAddCharge] = useState(0);
  const [initAllCharge, setInitAllCharge] = useState(0);

  useEffect(() => {
    // getOrderAccountSum(props.id).then(rsp => {
    //   if (rsp && rsp.code == Constants.SUCCESS) {
    //     const charge = rsp.data || 0;
    //     setCharge(charge);
    //     getAccountTypeData(charge);
    //   }
    // });

    getCloseSingleAccount(props.id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || {};
        setCharge(data.ys);

        if (data.js && data.js.all_charge > 0) {
          confirm({
            title: '加收房费',
            content: '是否加收房费?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              setNeedAdd(true);
              setAdditionalId(data.js.id);
              const real_charge = parseFloat(data.ys || 0) + parseFloat(data.js.all_charge);
              setInitAddCharge(data.js.all_charge);
              setInitAllCharge(real_charge);
              // setFieldsValue({ add_charge: data.js.all_charge, real_charge });
              getAccountTypeData(real_charge);
            },
            onCancel() {
              setNeedAdd(false);
              setAdditionalId(null);
              setInitAddCharge(0);
              setInitAllCharge(0);
              getAccountTypeData(charge);
            },
          });
        } else {
          getAccountTypeData(charge);
        }
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
  }, []);

  const getAccountTypeData = charge => {
    let account_type;
    if (charge >= 0) {
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

        const {
          form: { setFieldsValue },
        } = props;
        setFieldsValue({ account_code_id: data[0] && data[0].id });
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

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

        const account = {
          account: {
            account_code_id: values.account_code_id,
            account_detail_type,
            account_code,
            description,
            charge: values.charge || 0,
            hotel_group_id,
            hotel_id,
            order_info_id: props.id,
            order_info_room_id: parseInt(props.order_info_room_id),
            pay_account_no: values.pay_account_no,
            operate_user: create_user,
            room_no_id: props.room_no_id,
            room_no: props.room_no,
            memo: values.memo,
            status: 2,
            create_user,
            modify_user: create_user,
            work_shift,
          },
          order_info_id: props.id,
        };

        console.log(account);

        if (account_detail_type == Dict.accountCode.member) {
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

        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });

          if (needAdd) {
            account.account.charge = values.real_charge;
            closeSingleWithExtra(additionalId, account.account).then(rsp => {
              dispatch({
                type: 'global/changeLoading',
                payload: false,
              });
              if (rsp && rsp.code == Constants.SUCCESS) {
                message.success(rsp.message || '退房成功');
                props.form.resetFields();
                props.handleCancle();
                checkOutSubmit();
              }
            });
          } else {
            settleOrderAccount(account).then(rsp => {
              dispatch({
                type: 'global/changeLoading',
                payload: false,
              });
              if (rsp && rsp.code == Constants.SUCCESS) {
                console.log(rsp);
                props.form.resetFields();
                message.info('更新成功');
                props.handleCancle();
                checkOutSubmit();

                // const data = rsp.data || {};
                // if (data.all_charge && data.all_charge > 0) {
                //   setCheckOutVis(true);
                //   setOrderAdditional(data);
                // } else {
                //   setOrderAdditional(null);
                //   checkOutSubmit();
                //   props.handleCancle();
                // }
              }
            });
          }
        }
      }
    });
  };

  const [checkOutVis, setCheckOutVis] = useState(false);
  const [orderAdditional, setOrderAdditional] = useState(null);

  // 退房
  const checkOutSubmit = () => {
    confirm({
      title: '退房?',
      content: '确认退房?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          checkOut(props.id).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message);
            }
          });
        }
      },
    });
  };

  const handleAccountCg = value => {
    if (value == memberAccount.id) {
      setIsMember(true);
    } else {
      setIsMember(false);
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

  const handleOutCancel = () => {
    setCheckOutVis(false);
    props.handleCancle();
  };

  return (
    <>
      <Form {...formItemLayout} className={styles.panelForm} onSubmit={handleSubmit}>
        <Form.Item label="应收金额">
          {getFieldDecorator('charge', { initialValue: charge })(<InputNumber disabled />)}
        </Form.Item>
        {needAdd && (
          <>
            <Form.Item label="加收金额">
              {getFieldDecorator('add_charge', { initialValue: initAddCharge })(
                <InputNumber disabled />,
              )}
            </Form.Item>
            <Form.Item label="实收金额">
              {getFieldDecorator('real_charge', { initialValue: initAllCharge })(
                <InputNumber disabled />,
              )}
            </Form.Item>
          </>
        )}
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
        <Form.Item label="付款单号">{getFieldDecorator('pay_account_no', {})(<Input />)}</Form.Item>
        <Form.Item label="备注">{getFieldDecorator('memo', {})(<TextArea />)}</Form.Item>
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button onClick={props.handleCancle}>取消</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
            确认
          </Button>
        </Form.Item>
      </Form>

      <CheckOut
        visible={checkOutVis}
        handleCancel={() => handleOutCancel()}
        record={orderAdditional}
      />
    </>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(Settle));
