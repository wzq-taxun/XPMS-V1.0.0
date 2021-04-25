import { Form, InputNumber, Select, Button, Input, message } from 'antd';
import styles from '../style.less';
import { useState } from 'react';
import { useEffect } from 'react';
import { saveAccount } from '@/services/order';
import Constants from '@/constans';
import { connect } from 'dva';
import { getConsumeAccountType } from '@/services/account';
const { Option } = Select;
const { TextArea } = Input;

const Entry = props => {
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
    getConsumeAccountType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setAccountCode(data);
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
              room_no: props.room_no,
              create_user,
              modify_user: create_user,
              memo: values.memo,
              work_shift,
            },
          ],
        };

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

  return (
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
          <Select>
            {accountCode.map(item => (
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
        })(<InputNumber />)}
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

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(Entry));
