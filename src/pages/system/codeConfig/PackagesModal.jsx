import { Modal, Row, Col, Input, Form, message, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import { savePackages, updatePackages } from '@/services/system/codeConfig';
import Constants from '@/constans';
const { Option } = Select;

const PackagesMoal = props => {
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

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const { packages_code, description, price, is_charge, memo } = props.formValues;
        props.form.setFieldsValue({
          packages_code,
          description,
          price,
          is_charge,
          memo,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        const modify_user = create_user;
        if (props.isAdd) {
          setLoading(true);
          savePackages([
            {
              ...fieldsValue,
              hotel_group_id,
              hotel_id,
              create_user,
              modify_user,
            },
          ]).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          setLoading(true);
          updatePackages([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '修改成功');
              props.handleCancel(true);
            }
          });
        }
      }
    });
  };

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      title="包价"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="代码">
              {getFieldDecorator('packages_code', {
                rules: [{ required: true, message: '请输入代码' }],
              })(<Input placeholder="代码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="包价">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '包价' }],
              })(<Input placeholder="包价" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="价格">
              {getFieldDecorator('price', { rules: [{ required: true, message: '价格' }] })(
                <InputNumber placeholder="价格" />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="收费">
              {getFieldDecorator('is_charge', {
                rules: [{ required: true, message: 'is_charge' }],
              })(
                <Select>
                  <Option value={'0'}>不收费</Option>
                  <Option value={'1'}>收费</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {})(<Input placeholder="备注" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(PackagesMoal);
