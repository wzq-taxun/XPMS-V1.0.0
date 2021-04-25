import { Table, Form, Input, InputNumber, Select, Modal, Button, message, Switch } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { getGoods, saveGoodsAccount } from '@/services/order';
import { getGoodsAccountType, getPayAccountType } from '@/services/account';
import Constants from '@/constans';
import { connect } from 'dva';
import Dict from '@/dictionary';
import { getMemberCard } from '@/services/member';
import ProTable from '@ant-design/pro-table';
import styles from '../style.less';
const { Option } = Select;

const Goods = props => {
  const columns = [
    {
      title: '内容',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      render: (text, record, index) => (
        <InputNumber value={text} onChange={value => handelChangeField('number', value, index)} />
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'op',
      key: 'op',
      align: 'center',
      render: (text, record, index) => <a onClick={e => handleRemove(index)}>X</a>,
    },
  ];

  const addColumns = [
    {
      title: '类型',
      dataIndex: 'type_desc',
      key: 'type_desc',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'goods_info_name',
      key: 'goods_info_name',
      align: 'center',
    },
    {
      title: '简称',
      dataIndex: 'goods_short_name',
      key: 'goods_short_name',
      align: 'center',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '库存',
      dataIndex: 'numbers',
      key: 'numbers',
      align: 'numbers',
      hideInSearch: true,
    },
  ];

  // const [goods, setGoods] = useState([]);
  const [buyGoods, setBuyGoods] = useState([]);
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [count, setCount] = useState(0);
  const [accountCodes, setAccountCodes] = useState([]);
  const [goodsAccount, setGoodsAccount] = useState({});
  const [memberAccount, setMemberAccount] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [memberCardId, setMemberCardId] = useState(props.member_card_id);
  const [initCardNo, setInitCardNo] = useState(null);
  const [initBalance, setInitBalance] = useState(null);

  const [wechatAccount, setWechatAccount] = useState(null);
  const [isWechat, setIsWechat] = useState(false);
  const [isScan, setIsScan] = useState(false);

  useEffect(() => {
    // getGoods().then(rsp => {
    //   if (rsp && rsp.code == Constants.SUCCESS) {
    //     const data = rsp.data || [];
    //     setGoods(data);
    //   }
    // });

    // 支付
    getPayAccountType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setAccountCodes(data);

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

    //消费(小商品)
    getGoodsAccountType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setGoodsAccount(data && data[0]);
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

  const handleAddGoods = record => {
    let isContain = false;
    const newAmount = parseFloat(amount) + parseFloat(record.price);
    setAmount(newAmount);
    let newCount = count + 1;
    setCount(newCount);

    let tempGoods = [...buyGoods];
    if (tempGoods.length > 0) {
      tempGoods = tempGoods.map(good => {
        if (good.goods_info_id == record.goods_info_id) {
          good.number++;
          isContain = true;
        }
        return good;
      });
    }

    if (!isContain) {
      tempGoods.push({
        goods_info_id: record.goods_info_id,
        name: record.goods_info_name,
        number: 1,
        price: record.price,
      });
    }
    setBuyGoods(tempGoods);

    // const {
    //   form: { setFieldsValue },
    // } = props;
    // setFieldsValue({ amount: newAmount });
  };

  const handleRemove = index => {
    let tempGoods = [...buyGoods];
    tempGoods.splice(index, 1);
    let tempAmount = 0;
    let tempCount = 0;
    tempGoods.map(item => {
      tempAmount += parseFloat(item.price) * parseInt(item.number);
      tempCount += parseInt(item.number);
    });
    setAmount(tempAmount);
    setCount(tempCount);
    setBuyGoods(tempGoods);
  };

  const handelChangeField = (field, value, index) => {
    let tempGoods = [...buyGoods];
    tempGoods[index][field] = value;
    let tempAmount = 0;
    let tempCount = 0;
    tempGoods.map(item => {
      tempAmount += parseFloat(item.price) * parseInt(item.number);
      tempCount += parseInt(item.number);
    });
    setBuyGoods(tempGoods);
    setAmount(tempAmount);
    setCount(tempCount);

    // const {
    //   form: { setFieldsValue },
    // } = props;
    // setFieldsValue({ amount: tempAmount });
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        let goods = [];
        let goodsMemo = '';
        let hasErrorGood = false;
        buyGoods.map(item => {
          if (item.number == 0) {
            message.error(item.name + '数量为0');
            hasErrorGood = true;
          }

          const amount = parseFloat(item.price) * parseFloat(item.number);
          goods.push({
            amount: amount,
            goods_id: item.goods_info_id,
            goods_name: item.name,
            numbers: item.number,
            price: amount,
            // reverse_id: amount,
            unit_price: item.price,
          });
          goodsMemo = goodsMemo + item.name + item.number + '*' + item.price + ',';
        });

        if (hasErrorGood) {
          return;
        }

        if (goodsMemo.endsWith(',')) {
          goodsMemo = goodsMemo.substr(0, goodsMemo.length - 1);
        }

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, shift: work_shift, id: create_user } = currentUser;

        let pay_account_no = values.order_no;
        if (isWechat && isScan) {
          pay_account_no = 'PayCode-' + pay_account_no;
        }

        let param = {};
        if (values.amount > 0) {
          let account_detail_type = '';
          let account_code = '';
          let description = '';
          accountCodes.map(item => {
            if (item.id == values.account_code_id) {
              account_detail_type = item.account_detail_type;
              account_code = item.account_code;
              description = item.description;
            }
          });

          param = {
            account: [
              {
                account_code: goodsAccount.account_code,
                account_code_id: goodsAccount.id,
                account_detail_type: goodsAccount.account_detail_type,
                charge: amount,
                description: goodsAccount.description,
                order_info_id: props.id,
                order_info_room_id: parseInt(props.order_info_room_id),
                room_no_id: props.room_no_id,
                work_shift,
                memo: goodsMemo,
              },
              {
                account_code,
                account_code_id: values.account_code_id,
                account_detail_type,
                charge: values.amount,
                description,
                memo: values.remark,
                order_info_id: props.id,
                order_info_room_id: parseInt(props.order_info_room_id),
                pay_account_no,
                room_no_id: props.room_no_id,
                work_shift,
              },
            ],
            goods,
          };

          if (param.account[1].account_detail_type == Dict.accountCode.member) {
            if (values.charge > 0 && values.balance < values.charge) {
              message.error('会员卡余额不足');
              return;
            }
            if (!memberCardId) {
              message.error('请正确填写会员卡');
              return;
            }
            param.account[1].member_card_id = memberCardId;
          }
        } else {
          param = {
            account: [
              {
                account_code: goodsAccount.account_code,
                account_code_id: goodsAccount.id,
                account_detail_type: goodsAccount.account_detail_type,
                charge: amount,
                description: goodsAccount.description,
                order_info_id: props.id,
                order_info_room_id: parseInt(props.order_info_room_id),
                room_no_id: props.room_no_id,
                work_shift,
                memo: goodsMemo,
              },
            ],
            goods,
          };
        }

        console.log(param);

        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          saveGoodsAccount(param).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              console.log(rsp);
              props.form.resetFields();
              setBuyGoods([]);
              message.info(rsp.message || '更新成功');
              props.handleCancle();
            }
          });
        }
      }
    });
  };

  const handleAccountCg = value => {
    if (value == (memberAccount && memberAccount.id)) {
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
    <>
      <Table columns={columns} dataSource={buyGoods} rowKey="goods_info_id" size="small" />
      <div style={{ marginTop: '10px' }}>
        <Button type="primary" size="small" onClick={() => setModal(true)}>
          新增
        </Button>
        <span style={{ marginLeft: '10px' }}>总计:数量{count}</span>
        <span style={{ marginLeft: '10px' }}>金额{amount}</span>
      </div>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="结账类型" style={{ marginBottom: '6px', paddingTop: '18px' }}>
          {getFieldDecorator(
            'account_code_id',
            {},
          )(
            <Select onChange={value => handleAccountCg(value)}>
              {accountCodes &&
                accountCodes.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.description}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>
        {isMember && (
          <>
            <Form.Item label="会员卡号" style={{ marginBottom: '6px' }}>
              {getFieldDecorator('card_no', { initialValue: initCardNo })(
                <Input onBlur={() => handleCardNoBlur()} />,
              )}
            </Form.Item>
            <Form.Item label="会员余额" style={{ marginBottom: '6px' }}>
              {getFieldDecorator('balance', { initialValue: initBalance })(<Input disabled />)}
            </Form.Item>
          </>
        )}
        {isWechat && (
          <Form.Item label="支付方式" style={{ marginBottom: '6px' }}>
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

        <Form.Item label={isWechat && isScan ? `条形码` : `单号`} style={{ marginBottom: '6px' }}>
          {getFieldDecorator('order_no', {})(<Input />)}
        </Form.Item>
        <Form.Item label="总价" style={{ marginBottom: '6px' }}>
          {getFieldDecorator('amount', {})(<InputNumber />)}
        </Form.Item>
        <Form.Item label="备注" style={{ marginBottom: '6px' }}>
          {getFieldDecorator('remark', {})(<Input />)}
        </Form.Item>
        {/* <Form.Item label="账单份数" style={{ marginBottom: '6px' }}>
          {getFieldDecorator('num', {})(<InputNumber />)}
        </Form.Item> */}
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button onClick={props.handleCancle}>取消</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
            确认
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="商品"
        visible={modal}
        width={720}
        className={styles.myProtable}
        onCancel={() => setModal(false)}
        footer={
          <Button type="primary" onClick={e => setModal(false)}>
            关闭
          </Button>
        }
      >
        <ProTable
          columns={addColumns}
          // dataSource={goods}
          request={params => getGoods(params)}
          rowKey="goods_info_id"
          size="small"
          pagination={{ defaultPageSize: 10 }}
          onRow={record => {
            return {
              onClick: e => {
                handleAddGoods(record);
              },
            };
          }}
        />
      </Modal>
    </>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(Goods));
