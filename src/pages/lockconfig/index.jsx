import React, { Component } from 'react';
import { getdoorlockalllist, putupdatedoorlock, getdoorlocktypeobj } from '@/services/doorlock';
import { Form, Input, Row, Col, Button, message, Select } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';
import Constans from '@/constans';
const { Option } = Select;
export class lockconfig extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    type: '',
    userid: '',
    password: '',
    access_id: '',
    access_key: '',
    memo: '',
    url: '',
    secret_method: '',
    version_grant: '',
    handle_service: '',
    // 存储数组类型
    typeall: [],
    loading: false,
    // 下载文件按钮是否显示
    sdk: '',
    isshow: false,
  };
  //   页面加载获取数据
  componentDidMount() {
    this.getdoorlockall();
  }
  // 页面卸载后  移除存储
  componentWillUnmount() {
    sessionStorage.removeItem('lockconfigitem');
  }
  // 发起获取门所配置接口
  getdoorlockall = () => {
    getdoorlockalllist().then(res => {
      // console.log(res)
      if (res && res.code !== Constans.SUCCESS) return message.warning('获取失败');
      message.success('获取成功');
      // 将本条信息进行存储
      sessionStorage.setItem('lockconfigitem', JSON.stringify(res.data));
      let {
        type,
        userid,
        password,
        access_id,
        access_key,
        memo,
        url,
        secret_method,
        version_grant,
        handle_service,
      } = res.data;
      this.setState({
        type,
        userid,
        password,
        access_id,
        access_key,
        memo,
        url,
        secret_method,
        version_grant,
        handle_service,
      });
      // 获取门锁类型
      this.getdoorlocktype(type);
    });
  };
  // 获取门锁类型
  getdoorlocktype = e => {
    getdoorlocktypeobj().then(res => {
      console.log(res)
      if (res && res.code !== Constans.SUCCESS) return message.warning('类型获取失败');
      this.setState({
        typeall: res.data,
      });
      // 对门锁类型进型循环
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].code === e) {
          let {
            handle_service,
            secret_method,
            version_grant,
            url,
            code,
          } = res.data[i];
          this.setState({
            handle_service,
            secret_method,
            url,
            version_grant,
            type: code,
          });
          // 判断当前的里面是否有sdk 为空
          if (res.data[i].sdk && res.data[i].sdk !== '') {
            this.setState({
              sdk: res.data[i].sdk,
              isshow: true,
            });
          } else {
            this.setState({
              isshow: false,
            });
          }
        }
      }
    });
  };

  handleSubmit = e => {
    this.setState({
      loading: true,
    });
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let { id } = JSON.parse(sessionStorage.getItem('lockconfigitem'));
        let data = { ...values, id };
        // 成功提交
        putupdatedoorlock(data).then(res => {
          if (res && res.code !== Constans.SUCCESS)
            return message.warning(res.message || '提交失败');
          message.success(res.message || '提交成功');
          this.setState({
            loading: false,
          });
        });
      }
    });
  };
  // 改变类型选项后 调用接口覆盖掉之前最开始获取项
  handleSelectChange = e => {
    console.log(e);
    // 获取门锁类型
    this.getdoorlocktype(e);
  };
  render() {
    const {
      type,
      userid,
      password,
      access_id,
      access_key,
      memo,
      url,
      secret_method,
      version_grant,
      handle_service,
      typeall,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
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
    return (
      <GridContent className={styles.lockhead}>
        <div className={styles.peizhisuo}>门锁配置</div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row type="flex" gutter={16} style={{ marginRight: '20px' }}>
            <Col span={8}>
              <Form.Item label="门锁类型">
                {getFieldDecorator('type', {
                  initialValue: type,
                  rules: [
                    {
                      required: true,
                      message: '请输入门锁类型',
                    },
                  ],
                })(
                  <Select onChange={e => this.handleSelectChange(e)}>
                    {typeall &&
                      typeall.map(item => {
                        return (
                          <Option value={item.code} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="平台登陆用户">
                {getFieldDecorator('userid', {
                  initialValue: userid,
                  rules: [
                    {
                      required: true,
                      message: '请输入平台登陆用户名',
                    },
                    // {
                    //   validator: this.validateToNextPassword,
                    // },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="平台登陆密码" hasFeedback>
                {getFieldDecorator('password', {
                  initialValue: password,
                  rules: [
                    {
                      required: true,
                      message: '请输入你的密码',
                      whitespace: true,
                    },
                  ],
                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="平台接口地址">
                {getFieldDecorator('url', {
                  initialValue: url,
                  rules: [
                    {
                      required: true,
                      message: '请输入你接口地址',
                      whitespace: true,
                    },
                  ],
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="平台接入id">
                {getFieldDecorator('access_id', {
                  initialValue: access_id,
                  rules: [{ required: true, message: '请输入你的接入id', whitespace: true }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="平台接入密钥">
                {getFieldDecorator('access_key', {
                  initialValue: access_key,
                  rules: [{ required: true, message: '请输入你的密钥', whitespace: true }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="加密方式">
                {getFieldDecorator('secret_method', {
                  initialValue: secret_method,
                  rules: [{ required: true, message: '请输入你的加密方式', whitespace: true }],
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="平台接口版本号">
                {getFieldDecorator('version_grant', {
                  initialValue: version_grant,
                  rules: [{ required: true, message: '请输入你的接口版本号', whitespace: true }],
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="门锁业务接口">
                {getFieldDecorator('handle_service', {
                  initialValue: handle_service,
                  rules: [{ required: true, message: '请输入你的加密方式', whitespace: true }],
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue: memo,
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Form.Item wrapperCol={{ span: 24 }}>
              {this.state.isshow ?
                <Button style={{ marginRight: "20px" }}>
                  <a download href={this.state.sdk}>下载</a>
                </Button> : ''
              }
              <Button type="primary" htmlType="submit" loading={this.state.loading}>
                提交
              </Button>
            </Form.Item>
          </Row>
        </Form>
        {/* 测试 */}
        <span>
          <a href="szztClient://"></a>
        </span>
      </GridContent>
    );
  }
}
const WrappedRegistrationForm = Form.create({ name: 'lockcofgin' })(lockconfig);
export default WrappedRegistrationForm;
