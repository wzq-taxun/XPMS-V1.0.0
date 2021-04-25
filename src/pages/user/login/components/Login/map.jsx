import { Icon } from 'antd';
import React from 'react';
import styles from './index.less';
import user from '@/assets/login/user.png';
import pw from '@/assets/login/pw.png';
import src from 'umi-plugin-pro-block';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      // prefix: <Icon type="user" className={styles.prefixIcon} />,
      prefix: <img src={user} style={{ height: '16px' }} />,
      placeholder: '用户名',
    },
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],
  },
  Hotel: {
    props: {
      size: 'large',
      id: 'hotel',
      // prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '酒店代码',
      // onChange: e => {
      //   console.log(e.target.value);
      // },
    },
    rules: [
      {
        required: true,
        message: '请输入酒店代码',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      // prefix: <Icon type="lock" className={styles.prefixIcon} />,
      prefix: <img src={pw} style={{ height: '16px' }} />,
      type: 'password',
      id: 'password',
      placeholder: '密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
};
