import {
  Modal,
  Table,
  Popconfirm,
  Form,
  InputNumber,
  Row,
  Col,
  Select,
  Input,
  message,
  Radio,
  Switch,
} from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  getSettleAccountType,
  getJoinAccount,
  closeAccountWithExtra,
  getOnAccountType,
  getOnCompany,
} from '@/services/account';
import Dict from '@/dictionary';
import Constants from '@/constans';
import { connect } from 'dva';
import { getMemberCard } from '@/services/member';
const { Option } = Select;

const CheckOut = props => {
  const columns = [
    { title: '订单号', dataIndex: 'orderNO' },
    { title: '房号', dataIndex: 'room_no' },
    {
      title: '类型',
      dataIndex: 'order_type',
      render: (text, record, index) => {
        if (text == Dict.orderType[0].code) {
          return '全日';
        } else if (text == Dict.orderType[1].code) {
          return '钟点';
        } else if (text == Dict.orderType[2].code) {
          return '长包';
        } else if (text == Dict.orderType[3].code) {
          return '长租';
        }
      },
    },
    {
      title: '结余',
      dataIndex: 'ys',
    },
    {
      title: '加收方式',
      dataIndex: 'type',
      render: (text, record, index) => (
        <Radio.Group
          value={list[index] && list[index].type}
          buttonStyle="solid"
          onChange={e => handleTypeChange(e.target.value, record)}
        >
          <Radio.Button value="HANDRENT">延时</Radio.Button>
          <Radio.Button value="HOURRENT">钟点</Radio.Button>
          <Radio.Button value="HALFRENT">半日</Radio.Button>
          <Radio.Button value="FULLRENT">全日</Radio.Button>
          <Radio.Button value="NO">不加收</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: '加收金额',
      dataIndex: 'charge',
      render: (text, record, index) => (
        <InputNumber
          value={list[index] && list[index].charge}
          onChange={value => handelChangeCharge(value, index)}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (text, record, index) => {
        return (
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => handleDeleteRow(index)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const handleTypeChange = (value, record) => {
    const tempList = [...list];
    let tempExtra = 0;
    list.map(item => {
      if (item.orderInfoID == record.orderInfoID) {
        item.type = value;
        switch (value) {
          case 'HANDRENT':
            item.charge = item.js;
            break;
          case 'HOURRENT':
            item.charge = item.hour;
            break;
          case 'HALFRENT':
            item.charge = item.br;
            break;
          case 'FULLRENT':
            item.charge = item.qr;
            break;
          case 'NO':
            item.charge = 0;
            break;
          default:
            break;
        }
      }
      tempExtra += parseFloat(item.charge) * 100;
    });
    setList(tempList);
    setExtra(tempExtra / 100);

    getAccountCode((receive * 100 + tempExtra) / 100);

    const {
      form: { setFieldsValue },
    } = props;
    setFieldsValue({ extra: tempExtra / 100, charge: (receive * 100 + tempExtra) / 100 });
  };

  const handelChangeCharge = (value, index) => {
    let tempList = [...list];
    tempList[index].charge = value;
    setList(tempList);
    let tempReceive = 0;
    let tempExtra = 0;
    tempList.map(item => {
      tempReceive += parseFloat(item.ys) * 100;
      tempExtra += parseFloat(item.charge) * 100;
    });
    setReceive(tempReceive / 100);
    setExtra(tempExtra / 100);
    getAccountCode((tempReceive + tempExtra) / 100);

    const {
      form: { setFieldsValue },
    } = props;
    setFieldsValue({
      receive: tempReceive / 100,
      extra: tempExtra / 100,
      charge: (tempReceive + tempExtra) / 100,
    });
  };

  const handleDeleteRow = index => {
    let tempList = [...list];
    tempList.splice(index, 1);
    let tempReceive = 0;
    let tempExtra = 0;
    tempList.map(item => {
      tempReceive += parseFloat(item.ys) * 100;
      tempExtra += parseFloat(item.charge) * 100;
    });
    setReceive(tempReceive / 100);
    setExtra(tempExtra / 100);
    setList(tempList);

    getAccountCode((tempReceive + tempExtra) / 100);

    const {
      form: { setFieldsValue },
    } = props;
    setFieldsValue({
      receive: tempReceive / 100,
      extra: tempExtra / 100,
      charge: (tempReceive + tempExtra) / 100,
    });
  };

  const [list, setList] = useState([]);
  const [accountCodes, setAccountCodes] = useState([]);
  const [receive, setReceive] = useState(0);
  const [extra, setExtra] = useState(0);

  const [wechatAccount, setWechatAccount] = useState(null);
  const [isWechat, setIsWechat] = useState(false);
  const [isScan, setIsScan] = useState(false);

  useEffect(() => {
    if (props.visible) {
      setIsAr(false);
      setIsMember(false);
      setIsWechat(false);
      setIsScan(false);

      getJoinAccount(props.orderInfo.id).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          setList(data);
          let receive = 0;
          let extra = 0;
          data.map(item => {
            receive += parseFloat(item.ys) * 100;
            extra += parseFloat(item.js) * 100;
            item.type = 'HANDRENT';
            item.charge = item.js;
          });
          let charge = (receive + extra) / 100;

          receive = receive / 100;
          extra = extra / 100;
          setReceive(receive);
          setExtra(extra);

          getAccountCode(charge);

          const {
            form: { setFieldsValue },
          } = props;
          setFieldsValue({ receive, extra, charge });
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

  useEffect(() => {
    getSettleAccountType(Dict.accountCode.FK).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];

        // const member_card_id = props.orderInfo && props.orderInfo.member_card_id;
        // if (!member_card_id || member_card_id == 0) {
        //   const filterList = list.filter(item => item.account_detail_type != 'MEMBERCARD');
        //   setAccountCodeFK(filterList);
        // } else {
        // setAccountCodeFK(list);
        // }

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

    // let account_type = Dict.accountCode.FK;
    // if (charge >= 0) {
    //   account_type = Dict.accountCode.FK;
    // } else {
    //   account_type = Dict.accountCode.TK;
    // }
    // getSettleAccountType(account_type).then(rsp => {
    //   if (rsp && rsp.code == Constants.SUCCESS) {
    //     const list = rsp.data || [];
    //     setAccountCodes(list);

    //     const {
    //       form: { setFieldsValue },
    //     } = props;
    //     setFieldsValue({ account_code_id: list[0] && list[0].id });
    //   }
    // });
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
        let detail_type = '';
        if (receive + extra >= 0) {
          accountCodeFK.map(item => {
            if (item.id == values.account_code_id) {
              detail_type = item.account_detail_type;
            }
          });
        } else {
          accountCodeTK.map(item => {
            if (item.id == values.account_code_id) {
              detail_type = item.account_detail_type;
            }
          });
        }

        let member_card_id = null;
        if (detail_type == Dict.accountCode.member) {
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

        let pay_account_no = values.pay_account_no;
        if (isWechat && isScan) {
          pay_account_no = 'PayCode-' + pay_account_no;
        }

        const tempList = [];
        list.map(item => {
          const order = {
            order_info_id: item.orderInfoID,
            js_account_code: item.type || 'HANDRENT',
            // js_charge: tempExtra,
            js_charge: item.charge,
            ys_account_code: detail_type,
            ys_charge: (parseFloat(item.ys) * 100 + item.charge * 100) / 100,
            room_no_id: item.room_no_id,
            room_no: item.room_no,
            order_info_room_id: item.order_info_room_id,
            pay_account_no,
            member_card_id,
            company_id: values.company_id,
            order_type: item.order_type,
            memo: values.memo,
          };

          tempList.push(order);
        });

        console.log(tempList);

        setLoading(true);
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          closeAccountWithExtra(tempList).then(rsp => {
            setLoading(false);
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '退房成功');
              props.handleCancel();
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
      title="退房"
      visible={props.visible}
      onOk={handleSubmit}
      onCancel={() => props.handleCancel()}
      width={900}
      confirmLoading={loading}
    >
      <Table columns={columns} dataSource={list} size="small" rowKey="orderInfoID" />
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="结余金额">
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
              {getFieldDecorator('charge', { initialValue: extra + receive })(
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
                    {company &&
                      company.map(item => (
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
              <Form.Item label="支付方式：" style={{ marginBottom: '6px' }}>
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

export default connect(({ global }) => ({ loading: global.loading }))(Form.create()(CheckOut));
