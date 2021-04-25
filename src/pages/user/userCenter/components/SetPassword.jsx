import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import { setPassword } from '@/services/system/userManage';
import Constants from '@/constans';

const SetPassword = props => {
  const [confirmDirty, setConfirmDirty] = useState(false);

  const compareToFirstPassword = (rule, value, callback) => {
    const {
      form: { getFieldValue },
    } = props;
    if (value && value !== getFieldValue('password')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    const {
      form: { validateFields },
    } = props;
    if (value && confirmDirty) {
      validateFields(['confirm'], { force: true });
    }
    callback();
  };

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const handleSubmit = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const param = {
          oldPassword: values.oldPassword,
          password: values.password,
          userId: props.currentUser.id,
        };
        console.log(param);
        setPassword(param).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '密码修改成功');
            props.handleCancel();
          }
        });
      }
    });
  };

  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <Modal
      title="修改密码"
      visible={props.vis}
      onCancel={() => props.handleCancel()}
      onOk={() => {
        handleSubmit();
      }}
    >
      <Form {...formItemLayout}>
        <Form.Item label="原密码">
          {getFieldDecorator('oldPassword', {
            rules: [
              {
                required: true,
                message: '请输入原密码!',
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="新密码" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入新密码!',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="确认密码" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请再次输入新密码!',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={handleConfirmBlur} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ login }) => ({
  currentUser: login.currentUser,
}))(Form.create()(SetPassword));
