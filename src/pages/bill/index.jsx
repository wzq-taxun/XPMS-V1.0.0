import { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import {
  Input,
  Row,
  Col,
  Table,
  InputNumber,
  Radio,
  Select,
  Form,
  Modal,
  Button,
  Spin,
  message,
  Switch,
} from 'antd';
import styles from './index.less';
import { router } from 'umi';
import { getGoods } from '@/services/order';
import Constants from '@/constans';
import {
  getSynthesize,
  saveGoodsCloseAccount,
  getPayAccountType,
  getSynthesizeAccountType,
} from '@/services/account';
import Dict from '@/dictionary';
import ProTable from '@ant-design/pro-table';

const { Search } = Input;
const { Option } = Select;

const columns = [
  {
    title: '单号',
    key: 'account_no',
    dataIndex: 'account_no',
  },
  {
    title: '类别',
    key: 'description',
    dataIndex: 'description',
  },
  {
    title: '商品',
    dataIndex: 'goods_name',
    key: 'goods_name',
  },
  {
    title: '单价',
    dataIndex: 'unit_price',
    key: 'unit_price',
    render: (text, record) => {
      if (!record.unit_price) {
        return record.charge;
      }
      return text;
    },
  },
  {
    title: '数量',
    key: 'numbers',
    dataIndex: 'numbers',
  },
  // {
  //   title: '总价',
  //   key: 'amount',
  //   dataIndex: 'amount',
  // },
  {
    title: '结账单号',
    key: 'close_account_no',
    dataIndex: 'close_account_no',
  },
  // {
  //   title: '订单总金额',
  //   key: 'close_account_no',
  //   dataIndex: 'close_account_no',
  // },
  {
    title: '生成时间',
    key: 'generate_time',
    dataIndex: 'generate_time',
  },
  // {
  //   title: '备注',
  //   key: 'summary',
  //   dataIndex: 'summary',
  // },
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

class Bills extends Component {
  state = {
    loading: false,
    accounts: [],
    buyGoods: [],
    visible: false,
    amount: 0,
    count: 0,
    goods: [],
    accountCodes: [],
    goodsAccount: {},
    wechatAccount: null,
    isWechat: false,
    isScan: false,
  };

  componentDidMount() {
    this.getTableData();

    // getGoods().then(rsp => {
    //   if (rsp && rsp.code == Constants.SUCCESS) {
    //     const data = rsp.data || [];
    //     this.setState({ goods: data });
    //   }
    // });

    // 支付
    getPayAccountType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ accountCodes: data });

        const scanAccountArr = data.filter(
          item => item.account_detail_type == Dict.accountCode.wechat,
        );
        if (scanAccountArr && scanAccountArr.length > 0) {
          this.setState({ wechatAccount: scanAccountArr[0] });
        }

        const {
          form: { setFieldsValue },
        } = this.props;
        setFieldsValue({ account_code_id: data[0] && data[0].id });
      }
    });

    // 小商品
    getSynthesizeAccountType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ goodsAccount: data[0] });
      }
    });
  }

  getTableData() {
    getSynthesize().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ accounts: data });
      }
    });
  }

  buyColumns = [
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
        <InputNumber
          value={text}
          onChange={value => this.handelChangeField('number', value, index)}
        />
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
      render: (text, record, index) => <a onClick={e => this.handleRemove(index)}>X</a>,
    },
  ];

  handleAccountCg = value => {
    const { wechatAccount } = this.state;
    if (value == (wechatAccount && wechatAccount.id)) {
      this.setState({ isWechat: true });
    } else {
      this.setState({ isWechat: false });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.amount <= 0) return;

        let goods = [];
        let goodsMemo = '';
        let hasErrorGood = false;
        this.state.buyGoods.map(item => {
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

        const { accountCodes, goodsAccount } = this.state;

        let param = {};
        let account_detail_type = '';
        let account_code = 0;
        let description = '';
        accountCodes.map(item => {
          if (item.id == values.account_code_id) {
            account_detail_type = item.account_detail_type;
            account_code = item.account_code;
            description = item.description;
          }
        });

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { shift } = currentUser;

        let pay_account_no = values.order_no;
        if (this.state.isWechat && this.state.isScan) {
          pay_account_no = 'PayCode-' + pay_account_no;
        }

        param = {
          account: [
            {
              account_detail_type: goodsAccount.account_detail_type,
              account_code: goodsAccount.account_code,
              account_code_id: goodsAccount.id,
              charge: values.amount,
              description: goodsAccount.description,
              memo: values.remark,
              pay_account_no: values.order_no,
              work_shift: shift,
              memo: goodsMemo,
            },
            {
              account_detail_type,
              account_code,
              account_code_id: values.account_code_id,
              charge: values.amount,
              description,
              memo: values.remark,
              pay_account_no,
              work_shift: shift,
            },
          ],
          goods,
        };

        console.log(param);

        this.setState({ loading: true });
        saveGoodsCloseAccount(param).then(rsp => {
          this.setState({ loading: false });
          if (rsp && rsp.code == Constants.SUCCESS) {
            console.log(rsp);
            this.props.form.resetFields();
            this.setState({ buyGoods: [], loading: false, amount: 0, count: 0 });
            message.info(rsp.message || '更新成功');
            this.getTableData();
          }
        });
      }
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  goodsManage = e => {
    router.push('goodsManage');
  };

  handleAddGoods = record => {
    let isContain = false;
    const { amount, count, buyGoods } = this.state;
    const newAmount = amount + parseFloat(record.price);
    let newCount = count + 1;

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

    this.setState({ amount: newAmount, count: newCount, buyGoods: tempGoods });

    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ amount: newAmount });
  };

  handleRemove = index => {
    let tempGoods = this.state.buyGoods;
    tempGoods.splice(index, 1);
    let amount = 0;
    let count = 0;
    if (tempGoods.length > 0) {
      tempGoods.map(good => {
        amount += parseFloat(good.price) * parseInt(good.number);
        count += parseInt(good.number);
      });
    }
    this.setState({ buyGoods: tempGoods, amount, count });

    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ amount });
  };

  handelChangeField = (field, value, index) => {
    let tempGoods = this.state.buyGoods;
    tempGoods[index][field] = value;
    let amount = 0;
    let count = 0;
    tempGoods.map(item => {
      amount += parseFloat(item.price) * parseInt(item.number);
      count += parseInt(item.number);
    });

    this.setState({ buyGoods: tempGoods, amount, count });

    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ amount });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <Spin spinning={this.state.loading}>
        <GridContent>
          <div style={{ background: '#fff', height: '60px', padding: '10px 25px' }}>
            <span style={{ lineHeight: '40px', display: 'inline-block' }}>消费项目</span>
            <Search
              placeholder="搜索"
              onSearch={value => console.log(value)}
              style={{ width: 200, lineHeight: '40px', float: 'right' }}
            />
          </div>
          <Row style={{ background: '#fff', marginTop: '10px' }}>
            <Col span={16}>
              <Table
                columns={columns}
                dataSource={this.state.accounts}
                rowKey={record => {
                  return record.syid + '-' + record.deid;
                }}
                size="middle"
              />
            </Col>
            <Col span={8}>
              <div style={{ paddingRight: '10px', paddingBottom: '10px' }}>
                <div
                  style={{
                    height: '35px',
                    background: '#2F3754',
                    padding: '5px 10px',
                    color: '#fff',
                    lineHeight: '25px',
                  }}
                >
                  综合结账
                </div>
                <div style={{ height: '340px', border: '1px solid #aaa' }}>
                  <Table
                    columns={this.buyColumns}
                    dataSource={this.state.buyGoods}
                    rowKey="goods_info_id"
                    size="small"
                  />
                </div>
                <div>
                  <span>总计数量：{this.state.count}</span>
                  <span style={{ marginLeft: '20px' }}>总计金额：{this.state.amount}</span>
                </div>
                <div style={{ height: '340px', background: '#F5F5F5' }}>
                  <Form {...formItemLayout}>
                    <Form.Item label="结账类型" style={{ marginBottom: '6px', paddingTop: '18px' }}>
                      {getFieldDecorator('account_code_id', {
                        rules: [
                          {
                            required: true,
                            message: '请填写备注',
                          },
                        ],
                      })(
                        <Select
                          style={{ width: '80%' }}
                          onChange={value => this.handleAccountCg(value)}
                        >
                          {this.state.accountCodes.map(item => (
                            <Option key={item.id} value={item.id}>
                              {item.description}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                    {this.state.isWechat && (
                      <Form.Item label="支付方式" style={{ marginBottom: '6px' }}>
                        {getFieldDecorator('isScan', { initialValue: false })(
                          <Switch
                            checkedChildren="扫码"
                            unCheckedChildren="手动"
                            defaultChecked={false}
                            onChange={check => {
                              this.setState({ isScan: check });
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
                    <Form.Item label="总价" style={{ marginBottom: '6px' }}>
                      {getFieldDecorator('amount', {
                        initialValue: this.state.amount,
                      })(<InputNumber style={{ width: '80%' }} disabled />)}
                    </Form.Item>
                    <Form.Item
                      label={this.state.isWechat && this.state.isScan ? `条形码` : `单号`}
                      style={{ marginBottom: '6px' }}
                    >
                      {getFieldDecorator('order_no', {})(<Input style={{ width: '80%' }} />)}
                    </Form.Item>
                    <Form.Item label="备注" style={{ marginBottom: '6px' }}>
                      {getFieldDecorator('remark', {})(<Input style={{ width: '80%' }} />)}
                    </Form.Item>
                    <Form.Item label="账单份数" style={{ marginBottom: '6px' }}>
                      {getFieldDecorator('num', {})(<InputNumber style={{ width: '80%' }} />)}
                    </Form.Item>
                  </Form>
                  <div className={styles.opBtsGroup}>
                    <button onClick={this.showModal}>新增</button>
                    <button>打印账单</button>
                    <button onClick={this.goodsManage}>商品管理</button>
                    <button onClick={this.handleSubmit}>入账</button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Modal
            title="商品"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={600}
            className={styles.myProtable}
            footer={
              <Button type="primary" onClick={e => this.handleCancel()}>
                关闭
              </Button>
            }
          >
            <ProTable
              columns={addColumns}
              // dataSource={this.state.goods}
              request={params => getGoods(params)}
              rowKey="goods_info_id"
              size="small"
              pagination={{ defaultPageSize: 10 }}
              onRow={record => {
                return {
                  onClick: e => {
                    this.handleAddGoods(record);
                  },
                };
              }}
            />
          </Modal>
        </GridContent>
      </Spin>
    );
  }
}

export default new Form.create()(Bills);
