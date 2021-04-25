import { Button, Input, Select, Upload, Form, message, Icon } from 'antd';
import styles from './BaseView.less';
import { connect } from 'dva';
import { updateUser } from '@/services/system/userManage';
import { queryWechatUsers } from '@/services/user';
import Constants from '@/constans';
import { router } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import hotel from '@/assets/hotel.png';

const AvatarView = ({ avatar, url, handleChange }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload action={url} showUploadList={false} onChange={handleChange}>
      <div className={styles.button_view}>
        <Button>
          <Icon type="upload" />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView = props => {
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const user_id = props.currentUser.id;
        const param = { ...values, id: user_id, modify_user: user_id };
        if (avatar) {
          param.photo = avatar;
        }
        console.log(param);
        updateUser(param).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '修改成功');
            const { redirect } = getPageQuery();
            if (window.location.pathname !== '/user/login' && !redirect) {
              router.replace({
                pathname: '/user/login',
                search: stringify({
                  redirect: window.location.href,
                }),
              });
            }
          }
        });
      }
    });
  };

  const [avatar, setAvatar] = useState(props.currentUser && props.currentUser.photo);

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const token = sessionStorage.getItem('token');
  const url =
    '/api/common/uploadFile?user_id=' +
    currentUser.id +
    '&token=' +
    token +
    '&filePath=/userAvatar/' +
    currentUser.id +
    '/';

  const handleChange = ({ file, fileList, event }) => {
    if (file && file.status == 'done') {
      if (file.response && file.response.data) {
        setAvatar(file.response.data[0]);
      }
    }
  };

  const [wechatUsers, setWechatUsers] = useState([]);

  useEffect(() => {
    if (props.currentUser && props.currentUser.openid) {
      const { openid, wechat_nickname } = props.currentUser;
      setWechatUsers([{ openid, nickname: wechat_nickname }]);
    }
  }, []);

  let timer;

  const getWechatData = name => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    function getWechatUsers() {
      queryWechatUsers(name).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const list = rsp.data || [];
          setWechatUsers(list);
        } else {
          setWechatUsers([]);
        }
      });
    }

    timer = setTimeout(getWechatUsers, 300);
  };

  const handleWechatSearch = value => {
    if (value) {
      getWechatData(value);
    } else {
      setWechatUsers([]);
    }
  };

  const { getFieldDecorator } = props.form;

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form layout="vertical" onSubmit={handleSubmit}>
          <Form.Item label="登录名">
            <Input value={props.currentUser.loginid} disabled />
          </Form.Item>
          <Form.Item label="昵称">
            {getFieldDecorator('username', {
              initialValue: props.currentUser.username,
              rules: [
                {
                  required: true,
                  message: '昵称不能为空',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="电话">
            {getFieldDecorator('phone', {
              initialValue: props.currentUser.phone,
              rules: [
                {
                  required: true,
                  message: '电话不能为空',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              initialValue: props.currentUser.email,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="微信">
            {getFieldDecorator('openid', { initialValue: props.currentUser.openid })(
              <Select showSearch filterOption={false} onSearch={value => handleWechatSearch(value)}>
                {wechatUsers.map(item => (
                  <Option key={item.openid} value={item.openid}>
                    {item.nickname}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={avatar || hotel} url={url} handleChange={handleChange} />
      </div>
    </div>
  );
};

export default connect(({ login }) => ({
  currentUser: login.currentUser,
}))(Form.create()(BaseView));
