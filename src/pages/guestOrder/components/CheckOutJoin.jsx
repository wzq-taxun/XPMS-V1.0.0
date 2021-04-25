import { Modal, Table, Form, InputNumber, Row, Col, Select, Input, message, Switch } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  getSettleAccountType,
  getCloseJoinAccount,
  closeJoinTransferWithExtra,
  getOnAccountType,
  getOnCompany,
} from '@/services/account';
import Dict from '@/dictionary';
import Constants from '@/constans';
import { connect } from 'dva';
import { getMemberCard } from '@/services/member';
const { Option } = Select;

const CheckOutJoin = props => {
  const columns = [
    { title: '订单号', dataIndex: 'order_no' },
    { title: '房号', dataIndex: 'room_no' },
    { title: '应收', dataIndex: 'ys' },
    { title: '合计', dataIndex: 'all_charge' },
    { title: '小时', dataIndex: 'times_charge' },
    { title: '钟点', dataIndex: 'hour_charge' },
    { title: '半日', dataIndex: 'half_day_charge' },
    { title: '全日', dataIndex: 'add_day_charge' },
    { title: '凌晨全日', dataIndex: 'day_charge' },
    {
      title: '是否加收',
      dataIndex: 'needAdd',
      render: (text, record, index) => (
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked
          onChange={check => handelSwichChange('needAdd', check, record, index)}
        />
      ),
    },
    {
      title: '转账账务',
      dataIndex: 'transfer',
      render: (text, record, index) => (
        <Switch
          checkedChildren="未结"
          unCheckedChildren="全部"
          defaultChecked
          onChange={check => handelSwichChange('transfer', check, record, index)}
        />
      ),
    },
    {
      title: '是否结账',
      dataIndex: 'needSettle',
      render: (text, record, index) => (
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked
          onChange={check => handelSwichChange('needSettle', check, record, index)}
        />
      ),
    },
  ];

  const handelSwichChange = (field, check, record, index) => {
    const tempList = [...list];
    let tempReceive = 0;
    let tempExtra = 0;

    list.map(item => {
      if (item.order_info_id == record.order_info_id) {
        item[field] = check;
      }
      if (item.needSettle) {
        if (item.needAdd) {
          tempExtra += parseFloat(item.all_charge || 0);
        }
        tempReceive += parseFloat(item.ys || 0);
      }
    });

    const charge = (tempReceive * 100 + tempExtra * 100) / 100;

    setList(tempList);
    setExtra(tempExtra);
    setReceive(tempReceive);

    getAccountCode(charge);

    const {
      form: { setFieldsValue },
    } = props;
    setFieldsValue({ extra: tempExtra, charge });
  };

  const [list, setList] = useState([]);
  const [accountCodes, setAccountCodes] = useState([]);
  const [receive, setReceive] = useState(70);
  const [extra, setExtra] = useState(100);

  useEffect(() => {
    if (props.visible) {
      setIsAr(false);
      setIsMember(false);
      props.form.resetFields();

      getCloseJoinAccount(props.orderInfo.id).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];

          const list = [];
          let receive = 0;
          let extra = 0;
          data.map(item => {
            const { js = {}, ...order } = item;

            let needAdd = true;
            if (js.all_charge && js.all_charge > 0) {
              needAdd = true;
            } else {
              needAdd = false;
            }

            list.push({
              ...order,
              ...js,
              needAdd,
              needSettle: true,
              transfer: true,
            });
            receive += parseFloat(item.ys || 0);
            extra += parseFloat(js.all_charge || 0);
          });

          setList(list);
          setReceive(receive);
          setExtra(extra);

          let charge = (receive * 100 + extra * 100) / 100;
          getAccountCode(charge);
        }
      });
    }
  }, [props.visible]);

  const [accountCodeFK, setAccountCodeFK] = useState([]);
  const [accountCodeTK, setAccountCodeTK] = useState([]);
  const [loading, setLoading] = useState(false);

  const [memberAccount, setMemberAccount] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [memberCardId, setMemberCardId] = useState(props.orderInfo.member_card_id);
  const [initCardNo, setInitCardNo] = useState(null);
  const [initBalance, setInitBalance] = useState(null);

  const [isAr, setIsAr] = useState(false);
  const [arAccount, setArAccount] = useState([]);
  const [company, setCompany] = useState([]);

  const [wechatAccount, setWechatAccount] = useState(null);
  const [isWechat, setIsWechat] = useState(false);
  const [isScan, setIsScan] = useState(false);

  useEffect(() => {
    getSettleAccountType(Dict.accountCode.FK).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];

        getOnAccountType().then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            const data = rsp.data || [];
            setArAccount(data);
            setAccountCodeFK([...list, ...data]);
          }
        });
      }
    });

    getSettleAccountType(Dict.accountCode.TK).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setAccountCodeTK(list);
      }
    });

    getOnCompany().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setCompany(data);
      }
    });

    if (props.orderInfo.guest_type_id == Dict.guestType[1].id) {
      getMemberCard({ id: props.orderInfo.member_card_id }).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          setInitCardNo(data[0] && data[0].card_no);
          setInitBalance(data[0] && data[0].balance);
        }
      });
    }
  }, []);

  const getAccountCode = charge => {
    if (charge >= 0) {
      const tempAccountCode = [...accountCodeFK];
      setAccountCodes(tempAccountCode);

      const memberArr = tempAccountCode.filter(
        item => item.account_detail_type == Dict.accountCode.member,
      );
      if (memberArr && memberArr.length > 0) {
        setMemberAccount(memberArr[0]);
      }

      const wechatArr = tempAccountCode.filter(
        item => item.account_detail_type == Dict.accountCode.wechat,
      );
      if (wechatArr && wechatArr.length > 0) {
        setWechatAccount(wechatArr[0]);
      }

      const {
        form: { setFieldsValue },
      } = props;
      setFieldsValue({ account_code_id: tempAccountCode[0] && tempAccountCode[0].id });
    } else {
      const tempAccountCode = [...accountCodeTK];
      setAccountCodes(tempAccountCode);

      const memberArr = tempAccountCode.filter(
        item => item.account_detail_type == Dict.accountCode.member,
      );
      if (memberArr && memberArr.length > 0) {
        setMemberAccount(memberArr[0]);
      }

      const {
        form: { setFieldsValue },
      } = props;
      setFieldsValue({ account_code_id: tempAccountCode[0] && tempAccountCode[0].id });
    }
  };

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
        let account_detail_type = '';
        let account_code = '';
        let description = '';
        if (receive + extra >= 0) {
          accountCodeFK.map(item => {
            if (item.id == values.account_code_id) {
              account_detail_type = item.account_detail_type;
              account_code = item.account_code;
              description = item.description;
            }
          });
        } else {
          accountCodeTK.map(item => {
            if (item.id == values.account_code_id) {
              account_detail_type = item.account_detail_type;
              account_code = item.account_code;
              description = item.description;
            }
          });
        }

        let member_card_id = null;
        if (account_detail_type == Dict.accountCode.member) {
          if (values.charge > 0 && values.balance < values.charge) {
            message.error('会员卡余额不足');
            return;
          }
          if (!memberCardId) {
            message.error('请正确填写会员卡');
            return;
          }
          member_card_id = memberCardId;
        }

        const tempList = [];
        list.map(item => {
          if (item.needSettle) {
            tempList.push({
              id: item.id,
              order_info_id: item.order_info_id,
              needAdd: item.needAdd,
              needSettle: item.needSettle,
              ys: item.ys,
              js: item.all_charge,
              transfer: item.transfer ? 1 : 0,
            });
          }
        });

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, shift: work_shift, id: create_user } = currentUser;

        let pay_account_no = values.pay_account_no;
        if (isWechat && isScan) {
          pay_account_no = 'PayCode-' + pay_account_no;
        }

        const order = {
          account: {
            hotel_group_id,
            hotel_id,
            modify_user: create_user,
            work_shift,

            account_code_id: values.account_code_id,
            account_detail_type,
            account_code,
            description,
            charge: values.charge || 0,
            member_card_id,
            company_id: values.company_id,
            memo: values.memo,
            pay_account_no,

            order_info_id: props.orderInfo.id,
            order_info_room_id: props.order_info_room_id,
            room_no_id: props.orderInfo.room_no_id,
          },
          additional: tempList,
        };

        console.log(order);

        setLoading(true);
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          closeJoinTransferWithExtra(order).then(rsp => {
            setLoading(false);
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '退房成功');

              const settleList = tempList.filter(item => item.needSettle);
              if (!settleList || settleList.length < 1) {
                props.handleCancel(false, list);
              } else {
                props.handleCancel(true, list);
              }
            }
          });
        }
      }
    });
  };

  const handleAccountCg = value => {
    if (value == memberAccount.id) {
      setIsMember(true);
      setIsAr(false);
      setIsWechat(false);
    } else if (value == (wechatAccount && wechatAccount.id)) {
      setIsMember(false);
      setIsAr(false);
      setIsWechat(true);
    } else {
      setIsMember(false);
      setIsWechat(false);
      const arArr = arAccount.filter(item => item.id == value);
      if (arArr && arArr.length > 0) {
        setIsAr(true);
      } else {
        setIsAr(false);
      }
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
    <Modal
      title="结账"
      visible={props.visible}
      onOk={handleSubmit}
      onCancel={() => props.handleCancel()}
      width={1000}
      confirmLoading={loading}
      destroyOnClose={true}
    >
      <Table columns={columns} dataSource={list} size="small" rowKey="order_info_id" />
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="应收金额">
              {getFieldDecorator('receive', { initialValue: receive })(
                <InputNumber disabled style={{ width: '100%' }} />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="加收房费">
              {getFieldDecorator('extra', { initialValue: extra })(
                <InputNumber disabled style={{ width: '100%' }} />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="总金额">
              {getFieldDecorator('charge', { initialValue: (extra * 100 + receive * 100) / 100 })(
                <InputNumber disabled style={{ width: '100%' }} />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账项代码">
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
          </Col>
          {isMember && (
            <>
              <Col span={12}>
                <Form.Item label="会员卡号">
                  {getFieldDecorator('card_no', { initialValue: initCardNo })(
                    <Input onBlur={() => handleCardNoBlur()} />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="会员余额">
                  {getFieldDecorator('balance', { initialValue: initBalance })(<Input disabled />)}
                </Form.Item>
              </Col>
            </>
          )}
          {isAr && (
            <Col span={12}>
              <Form.Item label="挂账公司">
                {getFieldDecorator('company_id', {
                  initialValue: props.orderInfo && props.orderInfo.company_info_id,
                })(
                  <Select>
                    {company.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
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
            <Form.Item label={isWechat && isScan ? `条形码` : `付款单号`}>
              {getFieldDecorator('pay_account_no', {})(<Input />)}
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

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(CheckOutJoin));
