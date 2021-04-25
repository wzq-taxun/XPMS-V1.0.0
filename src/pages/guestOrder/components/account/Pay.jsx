import { Form, InputNumber, Select, Row, Col, Button, Input, message } from 'antd';
import styles from '../style.less';
import { useState } from 'react';
import { useEffect } from 'react';
import { saveAccount } from '@/services/order';
import Constants from '@/constans';
import { connect } from 'dva';
import { getPayAccountType } from '@/services/account';
import { getOrderCoupons } from '@/services/order';
import Dict from '@/dictionary';
import { getMemberCard } from '@/services/member';
import ScanPay from './ScanPay';
const { Option } = Select;
const { TextArea } = Input;

const Pay = props => {
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
  const [scanAccount, setScanAccount] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [memberCardId, setMemberCardId] = useState(props.member_card_id);
  const [initCardNo, setInitCardNo] = useState(null);
  const [initBalance, setInitBalance] = useState(null);

  const [visible, setVisible] = useState(false);
  const [scanValues, setScanValues] = useState(null);

  const [isCoupon, setIsCoupon] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [couponAccount, setCouponAccount] = useState(null);
  const [canWrite, setCarnWrite] = useState(false);

  const [scanBtVis, setScanBtVis] = useState(false);

  useEffect(() => {
    getPayAccountType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setAccountCode(data);

        const memberArr = data.filter(item => item.account_detail_type == Dict.accountCode.member);
        if (memberArr && memberArr.length > 0) {
          setMemberAccount(memberArr[0]);
        }

        const couponArr = data.filter(item => item.account_detail_type == Dict.accountCode.coupon);
        if (couponArr && couponArr.length > 0) {
          setCouponAccount(couponArr[0]);
        }

        const scanAccountArr = data.filter(
          item => item.account_detail_type == Dict.accountCode.wechat,
          // ||
          // item.account_detail_type == Dict.accountCode.aliPay,
        );
        if (scanAccountArr && scanAccountArr.length > 0) {
          setScanAccount(scanAccountArr);
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

    getOrderCoupons(props.id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setCoupons(data);
      }
    });
  }, []);

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

        // 支付宝微信 扫码支付
        // if (
        //   account_detail_type == Dict.accountCode.wechat ||
        //   account_detail_type == Dict.accountCode.aliPay
        // ) {
        //   setScanValues(values);
        //   setVisible(true);
        //   return;
        // }

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
              company_id: props.company_id || 0,
              hotel_group_id,
              hotel_id,
              order_info_id: props.id,
              order_info_room_id: props.order_info_room_id,
              pay_account_no: values.pay_account_no,
              operate_user: create_user,
              room_no_id: props.room_no_id,
              memo: values.memo,
              work_shift,
            },
          ],
        };

        if (account.accounts[0].account_detail_type == Dict.accountCode.member) {
          if (values.charge > 0 && values.balance < values.charge) {
            message.error('会员卡余额不足');
            return;
          }
          if (!memberCardId) {
            message.error('请正确填写会员卡');
            return;
          }
          account.accounts[0].member_card_id = memberCardId;
        }

        if (isCoupon && !canWrite) {
          account.accounts[0].coupon_id = values.coupon_id;
        }

        console.log(account);

        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          saveAccount(account).then(rsp => {
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
      setIsCoupon(false);
    } else if (value == couponAccount.id) {
      setIsMember(false);
      setIsCoupon(true);
    } else if (value == (scanAccount && scanAccount[0] && scanAccount[0].id)) {
      setIsMember(false);
      setIsCoupon(false);
      setScanBtVis(true);
    } else {
      setIsMember(false);
      setIsCoupon(false);
    }
  };

  const handleCouponCg = value => {
    if (value === 0) {
      setCarnWrite(true);
      return;
    }
    const couponArr = coupons.filter(item => item.id == value);
    const coupon = couponArr && couponArr[0];
    const {
      form: { setFieldsValue },
    } = props;
    setFieldsValue({ charge: coupon && coupon.reduce_cost });
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

  const handleCancel = () => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLoading',
        payload: true,
      });
      setVisible(false);
      dispatch({
        type: 'global/changeLoading',
        payload: false,
      });
    }
  };

  const handleGoScanPay = () => {
    setVisible(true);
  };

  return (
    <>
      <Form {...formItemLayout} className={styles.panelForm} onSubmit={handleSubmit}>
        <Form.Item label="账务类型">
          {getFieldDecorator('account_code_id', {
            rules: [
              {
                required: true,
                message: '请选择账务类型！',
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
        {isCoupon && (
          <Form.Item label="优惠卷">
            {getFieldDecorator('coupon_id', {
              rules: [
                {
                  required: true,
                  message: '请选择优惠卷！',
                },
              ],
            })(
              <Select onChange={value => handleCouponCg(value)}>
                {coupons &&
                  coupons.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.title}
                    </Option>
                  ))}
                <Option value={0} key={0}>
                  手动输入
                </Option>
              </Select>,
            )}
          </Form.Item>
        )}
        <Form.Item label="金额">
          {getFieldDecorator('charge', {
            rules: [
              {
                required: true,
                message: '请输入金额！',
              },
            ],
          })(<InputNumber disabled={isCoupon && !canWrite} />)}
        </Form.Item>
        <Form.Item label="付款单号">{getFieldDecorator('pay_account_no', {})(<Input />)}</Form.Item>
        <Form.Item label="备注">{getFieldDecorator('memo', {})(<TextArea />)}</Form.Item>
        <Form.Item wrapperCol={{ offset: scanBtVis ? 2 : 8 }}>
          <Button onClick={props.handleCancle}>取消</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
            确认
          </Button>
          {scanBtVis && (
            <Button type="primary" onClick={() => handleGoScanPay()} style={{ marginLeft: '10px' }}>
              扫码付
            </Button>
          )}
        </Form.Item>
      </Form>

      <ScanPay
        visible={visible}
        handleCancel={handleCancel}
        accountCode={scanAccount}
        formValues={scanValues}
        order={{
          order_info_id: props.id,
          order_info_room_id: parseInt(props.order_info_room_id),
          room_no_id: props.room_no_id,
        }}
      />
    </>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(Pay));
