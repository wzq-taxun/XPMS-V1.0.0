import { Form, Select, DatePicker, Row, Col, Button, Input, InputNumber, message } from 'antd';
import styles from '../style.less';
import { useEffect, useState } from 'react';
import { settleAccount } from '@/services/order';
import { getOnSAccountType } from '@/services/account';
import Constants from '@/constans';
import { connect } from 'dva';
const { Option } = Select;
const { TextArea } = Input;

const OnSAccount = props => {
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

  useEffect(() => {
    // 账务状态 1-正常，2-结账，3-挂账，4-冲账，5-锁定，6-挂S账'
    const selectAccounts = props.selectAccounts || [];

    if (selectAccounts.length <= 0) {
      message.error('请选待挂账账务');
      return;
    }

    const hasDis = selectAccounts.some(item => item.status != '1');
    if (hasDis) {
      message.error('包含不可挂S账账务');
      return;
    }

    // if (props.selectAccountCharge <= 0) {
    //   message.error('所选账务总金额为负,不可挂S账,请走退款');
    //   return;
    // }
    getOnSAccountType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setAccountCode(data);
      }
    });
  }, [props.selectAccountCharge]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        // 账务状态 1-正常，2-结账，3-挂账，4-冲账，5-锁定，6-挂S账'
        const selectAccounts = props.selectAccounts || [];
        const hasDis = selectAccounts.some(item => item.status != '1');
        if (hasDis) {
          message.error('包含不可挂S账账务');
          return;
        }

        // if (props.selectAccountCharge <= 0) {
        //   message.error('所选账务总金额为负,不可挂S账,请走退款');
        //   return;
        // }

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
        const selectAccountIds = props.selectAccountIds;
        if (!selectAccountIds || selectAccountIds.length < 1) {
          message.error('请选择待挂账的账务');
          return;
        }
        selectAccountIds &&
          selectAccountIds.map(item => {
            accountIds.push({ id: item });
          });

        const account = {
          account: {
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
            order_info_room_id: parseInt(props.order_info_room_id),
            pay_account_no: values.pay_account_no,
            operate_user: create_user,
            room_no_id: props.room_no_id,
            memo: values.memo,
            work_shift,
          },
          accountIds,
        };

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
          <Select>
            {accountCode.map(item => (
              <Option value={item.id} key={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="付款单号">{getFieldDecorator('pay_account_no', {})(<Input />)}</Form.Item>
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

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(OnSAccount));
