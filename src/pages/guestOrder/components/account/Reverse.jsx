import { Form, InputNumber, Select, Row, Col, Button, Input, message, Table, Modal } from 'antd';
import styles from '../style.less';
import { reverseAccount, getGoodsDetailAccount, reverseGoodsAccount } from '@/services/order';
import Constants from '@/constans';
import { connect } from 'dva';
import { useState, useEffect } from 'react';
import Dict from '@/dictionary';
const { TextArea } = Input;

const Reverse = props => {
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

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        // 账务状态 1-正常，2-结账，3-挂账，4-冲账，5-锁定，6-挂S账'
        const selectAccounts = props.selectAccounts || [];
        if (selectAccounts.length < 1) {
          message.error('请选择待冲账的账务');
          return;
        } else if (selectAccounts.length > 1) {
          message.error('每次只能针对单笔账务进行冲账');
          return;
        }

        const account = selectAccounts[0];
        if (account && account.status != '1') {
          if (account.status != '4' || account.account_detail_type != Dict.accountCode.XSP) {
            message.error('该类型账务不可冲账');
            return;
          }
        }

        if (
          account.status == '4' &&
          account.account_detail_type == Dict.accountCode.XSP &&
          account.debit_charge < 0
        ) {
          message.error('请对小商品主单进行冲账');
          return;
        }

        const sourceAccount = props.selectAccounts && props.selectAccounts[0];
        if (!sourceAccount) {
          message.error('没有选中的账务');
          return;
        }
        if (sourceAccount.work_shift == '99') {
          message.error('系统账务不能冲账');
          return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, shift: work_shift, id: create_user } = currentUser;

        if (
          sourceAccount.audit_date != props.audit ||
          sourceAccount.work_shift != work_shift ||
          sourceAccount.operate_user != create_user
        ) {
          message.info('存在非本人或非本班次或非本营业日账务,不能操作');
          return;
        }

        if (isGoods) {
          let tempGoods = [];
          let price = 0;
          goods.map(item => {
            if (item.reverse && item.reverse > 0) {
              const amount = item.reverse * item.unit_price;
              price += amount;
              tempGoods.push({
                amount: -amount,
                goods_id: item.goods_id,
                goods_name: item.goods_name,
                numbers: -item.reverse,
                price: -amount,
                reverse_id: item.id,
                unit_price: item.unit_price,
              });
            }
          });
          const account = {
            account: [
              {
                reverse_account_id: sourceAccount.id,
                account_detail_type: sourceAccount.account_detail_type,
                account_code_id: sourceAccount.account_code_id,
                account_code: sourceAccount.account_code,
                description: sourceAccount.description,
                charge: -price,
                order_info_id: props.id,
                order_info_room_id: parseInt(props.order_info_room_id),
                pay_account_no: values.pay_account_no,
                room_no_id: props.room_no_id,
                memo: values.memo,
                work_shift,
              },
            ],
            goods: tempGoods,
          };

          if (sourceAccount.company_id) {
            account.account[0].company_id = sourceAccount.company_id;
          }

          console.log(account);

          const { dispatch } = props;
          if (dispatch) {
            dispatch({
              type: 'global/changeLoading',
              payload: true,
            });
            reverseGoodsAccount(account).then(rsp => {
              dispatch({
                type: 'global/changeLoading',
                payload: false,
              });
              if (rsp && rsp.code == Constants.SUCCESS) {
                console.log(rsp);
                props.form.resetFields();
                message.success(rsp.message || '冲账成功');
                props.handleCancle();
              }
            });
          }
        } else {
          const account = {
            accounts: [
              {
                reverse_account_id: sourceAccount.id,
                account_detail_type: sourceAccount.account_detail_type,
                account_code_id: sourceAccount.account_code_id,
                account_code: sourceAccount.account_code,
                description: sourceAccount.description,
                charge: values.charge || 0,
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
            ],
          };

          if (sourceAccount.company_id) {
            account.accounts[0].company_id = sourceAccount.company_id;
          }

          console.log(account);

          const { dispatch } = props;
          if (dispatch) {
            dispatch({
              type: 'global/changeLoading',
              payload: true,
            });
            reverseAccount(account).then(rsp => {
              dispatch({
                type: 'global/changeLoading',
                payload: false,
              });
              if (rsp && rsp.code == Constants.SUCCESS) {
                console.log(rsp);
                props.handleCancle();
                message.success(rsp.message || '冲账成功');
              }
            });
          }
        }
      }
    });
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goods_name',
      key: 'goods_name',
    },
    {
      title: '单价',
      dataIndex: 'unit_price',
      key: 'unit_price',
    },
    {
      title: '数量',
      dataIndex: 'numbers',
      key: 'numbers',
    },
    // {
    //   title: '总价',
    //   dataIndex: 'amount',
    //   key: 'amount',
    // },
    {
      title: '冲账数量',
      dataIndex: 'reverse',
      key: 'reverse',
      render: (text, record, index) => {
        return (
          <InputNumber
            defaultValue={0}
            min={0}
            max={record.numbers}
            style={{ width: '60px' }}
            onChange={value => handleChangeReverse(value, record, index)}
          />
        );
      },
    },
  ];

  const handleChangeReverse = (value, record, index) => {
    let tempGoods = goods;
    tempGoods.map(item => {
      if (item.id == record.id) {
        item.reverse = value;
      }
    });
    setGoods(tempGoods);
  };

  const [goods, setGoods] = useState([]);
  const [isGoods, setIsGoods] = useState(false);

  useEffect(() => {
    // 账务状态 1-正常，2-结账，3-挂账，4-冲账，5-锁定，6-挂S账'
    const selectAccounts = props.selectAccounts || [];
    if (selectAccounts.length < 1) {
      message.error('请选择待冲账的账务');
      return;
    } else if (selectAccounts.length > 1) {
      message.error('每次只能针对单笔账务进行冲账');
      return;
    }

    const account = selectAccounts[0];
    if (account && account.account_detail_type == Dict.accountCode.XSP) {
      setIsGoods(true);
    } else {
      setIsGoods(false);
    }

    if (account && account.status != '1') {
      if (account.status != '4' || account.account_detail_type != Dict.accountCode.XSP) {
        message.error('该类型账务不可冲账');
        return;
      }
    }

    if (
      account.status == '4' &&
      account.account_detail_type == Dict.accountCode.XSP &&
      account.debit_charge < 0
    ) {
      message.error('请对小商品主单进行冲账');
      return;
    }

    if (account) {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      const { shift, id } = currentUser;
      if (
        account.audit_date != props.audit ||
        account.work_shift != shift ||
        account.operate_user != id
      ) {
        message.info('存在非本人或非本班次或非本营业日账务,不能操作');
        return;
      }

      props.form.setFieldsValue({ charge: -account.charge });

      getGoodsDetailAccount(account.id).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          setGoods(data);
        }
      });
    }
  }, [props.selectAccounts]);

  return (
    <>
      {isGoods && <Table columns={columns} dataSource={goods} rowKey="id" size="small" />}
      <Form {...formItemLayout} className={styles.panelForm} onSubmit={handleSubmit}>
        {!isGoods && (
          <Form.Item label="金额">
            {getFieldDecorator('charge', {})(<InputNumber disabled />)}
          </Form.Item>
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
    </>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(Reverse));
