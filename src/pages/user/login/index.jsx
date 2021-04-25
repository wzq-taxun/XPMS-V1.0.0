import { Alert, Checkbox, Select, message, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';
import Constants from '@/constans';
import { fakeShift } from '@/services/login';
import hotelPng from '@/assets/login/hotel.png';
import shiftPng from '@/assets/login/shift.png';
const { UserName, Password, Submit, Hotel } = LoginComponents;
const { Option } = Select;

class Login extends Component {
  loginForm = undefined;
  state = {
    autoLogin: true,
    remeber: false,
    fakeShift: [],
    shift: null,
    hotel: null,
  };

  componentDidMount() {
    const hotel = localStorage.getItem('hotel');
    if (hotel) {
      this.setState({ hotel, remeber: true });
    }
    fakeShift().then(rsp => {
      if (rsp && rsp.code === Constants.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ fakeShift: data, shift: data[0] && data[0].id });
      }
    });
    // // 调用
    // this.huanxing();
  }
  // 测试在 react 中调用小程序中间件
  // huanxing = () => {
  //   let ws = new WebSocket(
  //     'ws://wrl.zorrosoft.com?sid=321&pid=F90B1CF0-8485-40ec-B4E8-B87598AAB35D&flag=1=CHS',
  //   );
  //   console.log('ws连接状态：' + ws.readyState);
  //   //监听是否连接成功
  //   ws.onopen = function() {
  //     console.log('ws连接状态：' + ws.readyState);
  //     //连接成功则发送一个数据
  //     ws.send('test1');
  //   };
  //   //接听服务器发回的信息并处理展示
  //   ws.onmessage = function(data) {
  //     console.log('接收到来自服务器的消息：');
  //     console.log(data);
  //     //完成通信后关闭WebSocket连接
  //     ws.close();
  //   };
  //   //监听连接关闭事件
  //   ws.onclose = function() {
  //     //监听整个过程中websocket的状态
  //     console.log('ws连接状态：' + ws.readyState);
  //   };
  //   //监听并处理error事件
  //   ws.onerror = function(error) {
  //     console.log(error);
  //   };
  // };
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  changeRemeber = e => {
    this.setState({
      remeber: e.target.checked,
    });
  };

  /**
   * 提交登录
   */
  handleSubmit = (err, values) => {
    if (!err) {
      const { shift, fakeShift, hotel } = this.state;
      if (!shift) {
        message.info('请选择班次');
        return;
      }

      if (!hotel) {
        message.info('请输入酒店');
        return;
      }

      if (this.state.remeber) {
        localStorage.setItem('hotel', this.state.hotel);
      } else {
        localStorage.removeItem('hotel');
      }

      let shiftName = '';
      fakeShift.map(item => {
        if (item.id == shift) {
          shiftName = item.description;
        }
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: { ...values, shift: this.state.shift, shiftName, hotel },
      });
    }
  };

  handleHotelChange = e => {
    let value = e.target.value;
    this.setState({ hotel: value.toLocaleUpperCase() });
  };

  /**
   * 渲染提示信息
   */
  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin = {}, submitting } = this.props;
    const { status, errmessage } = userLogin;
    const { autoLogin, remeber } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
          {status === 'error' && this.renderMessage(errmessage)}
          <Input
            size="large"
            placeholder="酒店编码"
            style={{ width: '100%', marginBottom: '15px' }}
            prefix={<img src={hotelPng} style={{ height: '16px' }} />}
            value={this.state.hotel}
            onChange={e => this.handleHotelChange(e)}
          />
          {/* <Hotel name="hotel" /> */}
          <UserName name="username" />
          <Password
            name="password"
            onPressEnter={e => {
              e.preventDefault();
              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />
          <div className={styles.shiftContain}>
            <img src={shiftPng} />
            <Select
              size="large"
              placeholder="班次"
              style={{ width: '100%', marginBottom: '15px' }}
              onChange={value => this.setState({ shift: value })}
              value={this.state.shift}
            >
              {this.state.fakeShift.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.description}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox> */}
            <Checkbox checked={remeber} onChange={this.changeRemeber}>
              记住我
            </Checkbox>
          </div>
          <Submit loading={submitting} type="danger">
            登录
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
