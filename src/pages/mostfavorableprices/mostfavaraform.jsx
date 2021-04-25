import React, { useState, useImperativeHandle } from 'react';
import { Form, Input, Row, Col, Modal, message, Select, InputNumber } from 'antd';
import { getcanmembercoupons, youhuiquanup, updatenewfavar } from '@/services/couponsSend';
import Constants from '@/constans';
let invoiceBox = props => {
  const [invisible, setInvisible] = useState(false);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [statusval, setStatusval] = useState(true);
  const [typeallbase, setTypeallbase] = useState([]);
  const [isfouloding, setIsfouloding] = useState(false);
  const { Option } = Select;
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(props.cRef, () => ({
    // newChangeVal 就是暴露给父组件的方法1
    newChangeVal: () => {
      // 重置表单清空
      props.form.resetFields();
      requesgetcanmembercoupons();
      setInvisible(true);
      setTitle('新增优惠券');
      // 点击将新建后为true
      setStatusval(true);
    },
    // updatenewChangeVal 就是暴露给父组件的方法2
    updatenewChangeVal: value => {
      requesgetcanmembercoupons();
      //将点击修改的值进行还原到表单中
      setInvisible(true);
      setTitle('修改优惠券');
      //   点击修改后  为false
      setStatusval(false);
      const { coupon_base_id, coupon_desc, description, memo, total, id } = value;
      props.form.setFieldsValue({ coupon_base_id, coupon_desc, description, memo, total });
      setId(id);
    },
  }));
  // 直接 发起 可配置优惠券列表请求
  const requesgetcanmembercoupons = () => {
    getcanmembercoupons().then(res => {
      if (!res || res.code !== Constants.SUCCESS)
        return message.warning(res.message || '优惠券获取失败');
      setTypeallbase(res.data);
    });
  };

  const handleCancelincov = () => {
    setInvisible(false);
  };
  // 雷同代码 抽离
  const leitong = res => {
    if (!res || (res && res.code !== Constants.SUCCESS))
      return message.warning(res.message || '提交失败');
    message.success(res.message || '提交成功');
    //进行表刷新 子组件触发父组件的方法
    props.updatalistb();
    setInvisible(false);
    setIsfouloding(false);
  };
  const handleOkincov = () => {
    const {
      form: { validateFields },
    } = props;
    validateFields((err, values) => {
      if (!err) {
        setIsfouloding(true);
        if (statusval) {
          // 进行新建提交请求
          youhuiquanup({
            ...values,
            type: '',
          }).then(res => {
            // 雷同代码 抽离
            leitong(res);
          });
        } else {
          // 修改的提交请求
          updatenewfavar({
            ...values,
            type: '',
            id,
          }).then(res => {
            //   雷同代码 抽离
            leitong(res);
          });
        }
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
      confirmLoading={isfouloding}
      title={title}
      visible={invisible}
      okText="提交"
      onOk={handleOkincov}
      onCancel={handleCancelincov}
    >
      <Form {...formItemLayout}>
        <Row type="flex" gutter={16}>
          <Col span={12}>
            <Form.Item label="优惠券">
              {getFieldDecorator('coupon_base_id', {
                initialValue: typeallbase[0] && typeallbase[0].id,
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券',
                  },
                ],
              })(
                <Select>
                  {typeallbase &&
                    typeallbase.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.title}
                        </Option>
                      );
                    })}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="活动类型描述">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: '请输入活动类型描述',
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="优惠券描述">
              {getFieldDecorator('coupon_desc', {
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券描述',
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="赠送数量">
              {getFieldDecorator('total', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: '请输入赠送数量',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} min={1} max={10} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">{getFieldDecorator('memo')(<Input />)}</Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create({ name: 'mostfavaraform' })(invoiceBox);
