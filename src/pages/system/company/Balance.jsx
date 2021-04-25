import { getCompanyCloseType, getArAccount, saveArCloseAccount } from '@/services/account';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Form, Row, Col, Input, Select, InputNumber, message } from 'antd';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import Constants from '@/constans';
const { Option } = Select;

const Balance = props => {
  const columns = [
    // {
    //   title: '公司',
    //   dataIndex: 'name',
    // },
    {
      title: '订单号',
      dataIndex: 'order_no',
    },
    {
      title: '房号',
      dataIndex: 'room_no',
    },
    {
      title: '金额',
      dataIndex: 'charge',
    },
    {
      title: '时间',
      dataIndex: 'generate_time',
    },
    // {
    //   title: '房间',
    //   dataIndex: 'room_no',
    // },
    {
      title: '营业日',
      dataIndex: 'audit_date',
    },
    // {
    //   title: '摘要',
    //   dataIndex: 'summary',
    // },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        '1': {
          text: '正常',
        },
        '2': {
          text: '结账',
        },
        '3': {
          text: '挂账',
        },
        '4': {
          text: '冲账',
        },
        '5': {
          text: '锁定',
        },
      },
    },
    // {
    //   title: '账务单号',
    //   dataIndex: 'account_no',
    // },
    {
      title: '付款单号',
      dataIndex: 'pay_account_no',
    },
    // {
    //   title: '结账单号',
    //   dataIndex: 'close_account_no',
    // },
    // {
    //   title: '协议单位结账单号',
    //   dataIndex: 'ar_close_account_no',
    // },
    {
      title: '备注',
      dataIndex: 'memo',
    },
    {
      title: '有效',
      dataIndex: 'valid',
      key: 'valid',
      valueEnum: {
        '0': {
          text: '无效',
        },
        '1': {
          text: '有效',
        },
      },
    },
  ];

  useEffect(() => {
    getCompanyCloseType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setAccountCode(data);
      }
    });
  }, []);

  const [companyId, setCompanyId] = useState(props.company.id);
  const [modalVis, setModalVis] = useState(false);
  const [accountCode, setAccountCode] = useState([]);
  const [accountIds, setAccountIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const actionRef = useRef();

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const payAccount = rows => {
    if (rows && rows.length < 1) {
      message.info('请选中要结账的账务');
      return;
    }
    const ids = [];
    let amount = 0;
    rows.map(item => {
      if (item.status == '3') {
        ids.push(item.id);
        amount += parseInt(item.charge);
      }
    });
    if (ids.length < 1) {
      message.info('没有可结账账务');
      return;
    }
    setAccountIds(ids);
    props.form.resetFields();
    setModalVis(true);
    const {
      form: { setFieldsValue },
    } = props;
    setFieldsValue({ charge: amount });
  };

  const handleSubmit = () => {
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
            company_id: companyId,
            hotel_group_id,
            hotel_id,
            pay_account_no: values.pay_account_no,
            operate_user: create_user,
            create_user,
            modify_user: create_user,
            memo: values.memo,
            work_shift,
          },
          ids: accountIds,
        };

        console.log(account);

        setLoading(true);
        saveArCloseAccount(account).then(rsp => {
          setLoading(false);
          if (rsp && rsp.code == Constants.SUCCESS) {
            console.log(rsp);
            message.info('更新成功');
            props.form.resetFields();
            setSelectedRowKeys([]);
            setModalVis(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        });
      }
    });
  };

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

  const {
    form: { getFieldDecorator },
  } = props;

  return (
    <>
      {props.unSettle ? (
        <>
          <ProTable
            actionRef={actionRef}
            search={false}
            headerTitle={props.company && props.company.name}
            columns={columns}
            request={() => getArAccount(companyId, 3)}
            rowKey="id"
            toolBarRender={(action, { selectedRows }) => [
              <Button
                type="primary"
                onClick={() => {
                  payAccount(selectedRows);
                }}
              >
                结账
              </Button>,
            ]}
            rowSelection={rowSelection}
          />

          <Modal
            visible={modalVis}
            title="协议单位结账"
            onCancel={() => setModalVis(false)}
            onOk={() => {
              handleSubmit();
            }}
            confirmLoading={loading}
          >
            <Form {...formItemLayout}>
              <Row gutter={8} type="flex">
                <Col span={12}>
                  <Form.Item label="账项代码">
                    {getFieldDecorator('account_code_id', {
                      rules: [{ required: true, message: '账项代码' }],
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
                </Col>
                <Col span={12}>
                  <Form.Item label="金额">
                    {getFieldDecorator('charge', {
                      rules: [
                        {
                          required: true,
                          message: '请输入金额！',
                        },
                      ],
                    })(<InputNumber style={{ width: '100%' }} disabled />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="付款单号">
                    {getFieldDecorator('pay_account_no', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="备注">{getFieldDecorator('memo', {})(<Input />)}</Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </>
      ) : (
        <ProTable
          actionRef={actionRef}
          search={false}
          headerTitle={props.company && props.company.name}
          columns={columns}
          request={() => getArAccount(companyId, 2)}
          rowKey="id"
        />
      )}
    </>
  );
};

export default Form.create()(Balance);
