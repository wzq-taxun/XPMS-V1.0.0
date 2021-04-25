import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Form, Input, Row, Col, Button, Modal, message } from 'antd';
import { getQueorderdatahor, loggingdatatijiao } from '@/services/order';
import Constants from '@/constans';
let invoiceBox = props => {
  const [invisible, setInvisible] = useState(false);
  const [intitlebiao, setIntitlebiao] = useState('');
  const [listinvoc, setIistinvoc] = useState({});
  const [isock, setIsock] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [status, setStatus] = useState('');

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(props.cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: () => {
      // 此时发起查询获取开票信息
      const orderId = props.orderInfo.id;
      getQueorderdatahor(orderId).then(res => {
        if (!res || res.code !== Constants.SUCCESS)
          return message.warning(res.mesage || '开票查询失败');
        // 成功时 有 []  1 开票中 2 已开票
        if (res.data.length == 0) {
          setInvoiceId(null);
          setIsock(false);
          setStatus('');
          setIistinvoc({
            bankAccount: '',
            bankName: '',
            companyAddress: '',
            taxNumber: '',
            telephone: '',
            title: '',
            email: '',
            memo: '',
          });
          setIntitlebiao('请开票');
          setInvisible(true);
          return message.success('请开票提交');
        }

        setInvoiceId(res.data[0].id);

        if (res.data[0].status === '1') {
          // 将值还原到表中
          setIsock(false);
          setStatus('1');
          setIistinvoc(res.data[0]);
          setIntitlebiao('开票中');
          setInvisible(true);
          return message.success('开票中');
        }

        if (res.data[0].status === '2') {
          setIsock(true);
          setIistinvoc(res.data[0]);
          setIntitlebiao('已开票');
          setInvisible(true);
          return message.success('已开票');
        }
      });
    },
  }));
  const handleCancelincov = () => {
    setInvisible(false);
  };
  const handleOkincov = () => {
    const {
      form: { validateFields },
    } = props;
    validateFields((err, values) => {
      if (!err) {
        const orderId = props.orderInfo.id;
        let { hotel_group_id, hotel_id, id: user_id } = JSON.parse(
          sessionStorage.getItem('currentUser'),
        );
        // 进行提交请求
        loggingdatatijiao({
          ...values,
          create_user: user_id,
          hotel_group_id,
          hotel_id,
          id: invoiceId,
          modify_user: user_id,
          order_info_id: orderId,
        }).then(res => {
          console.log(res);
          if (res && res.code !== Constants.SUCCESS)
            return message.warning(res.message || '提交失败');
          message.success(res.message || '提交成功');
          setInvisible(false);
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;
  const [formItemLayout] = useState({
    labelCol: {
      xs: { span: 12 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  });
  return (
    <Modal
      width={1000}
      style={{ textAlign: 'center' }}
      title={intitlebiao}
      visible={invisible}
      okText="提交"
      footer={
        isock ? (
          <Button onClick={() => handleCancelincov()}>取消</Button>
        ) : (
          <span>
            <Button onClick={() => handleCancelincov()}>取消</Button>
            <Button type="primary" onClick={() => handleOkincov()}>
              提交
            </Button>
          </span>
        )
      }
      // onOk={handleOkincov}
      onCancel={handleCancelincov}
    >
      <Form {...formItemLayout}>
        <Row type="flex" gutter={16}>
          <Col span={12}>
            <Form.Item label="银行账号">
              {getFieldDecorator('bankAccount', {
                initialValue: listinvoc.bankAccount,
                rules: [
                  {
                    required: true,
                    message: '请输入银行账号',
                  },
                ],
              })(<Input disabled={isock} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="银行名称">
              {getFieldDecorator('bankName', {
                initialValue: listinvoc.bankName,
                rules: [
                  {
                    required: true,
                    message: '请输入银行名称',
                  },
                ],
              })(<Input disabled={isock} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="公司地址">
              {getFieldDecorator('companyAddress', {
                initialValue: listinvoc.companyAddress,
                rules: [
                  {
                    required: true,
                    message: '请输入公司地址',
                    whitespace: true,
                  },
                ],
              })(<Input disabled={isock} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="税号">
              {getFieldDecorator('taxNumber', {
                initialValue: listinvoc.taxNumber,
                rules: [
                  {
                    required: true,
                    message: '请输入税号',
                    whitespace: true,
                  },
                ],
              })(<Input disabled={isock} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电话">
              {getFieldDecorator('telephone', {
                initialValue: listinvoc.telephone,
                rules: [{ required: true, message: '请输入电话', whitespace: true }],
              })(<Input disabled={isock} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="名称">
              {getFieldDecorator('title', {
                initialValue: listinvoc.title,
                rules: [{ required: true, message: '请输名称', whitespace: true }],
              })(<Input disabled={isock} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                initialValue: listinvoc.email,
                rules: [{ required: true, message: '请输入邮箱', whitespace: true }],
              })(<Input disabled={isock} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
                initialValue: listinvoc.memo,
              })(<Input disabled={isock} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: 'invoiceBox' })(invoiceBox);
