import { Modal, Row, Col, Input, Form, Select, message, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import moment from 'moment';
import { addCompany, updateCompany } from '@/services/company';
import { getMarket } from '@/services/checkIn';

const { Option } = Select;

const CompanyModal = props => {
  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const {
          code_base_id,
          name,
          market_id,
          phone,
          fax,
          email,
          linkman,
          occupation,
          birth,
          city,
          representative,
          company,
          taxpayer_no,
          address,
          telPhone,
          bank_name,
          bank_account,
          tax_emai,
          ar_account,
          account_limit,
          account_balance,
          memo,
        } = props.formValues;
        props.form.setFieldsValue({
          code_base_id,
          name,
          market_id,
          phone,
          fax,
          email,
          linkman,
          occupation,
          birth: moment(birth),
          city,
          representative,
          company,
          taxpayer_no,
          address,
          telPhone,
          bank_name,
          bank_account,
          tax_emai,
          ar_account,
          account_limit,
          account_balance,
          memo,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 14 },
    },
  };

  const {
    form: { getFieldDecorator },
  } = props;

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        console.log(fieldsValue);
        fieldsValue.birth = fieldsValue.birth && fieldsValue.birth.format('YYYY-MM-DD HH:mm:ss');

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        if (props.isAdd) {
          setLoading(true);
          addCompany([
            { ...fieldsValue, hotel_group_id, hotel_id, create_user, modify_user: create_user },
          ]).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          setLoading(true);
          updateCompany([
            { ...fieldsValue, id: props.formValues.id, modify_user: create_user },
          ]).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    getMarket().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setMarket(data);
      }
    });
  }, []);

  const [market, setMarket] = useState([]);

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      title="公司档案"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="类型">
              {getFieldDecorator('code_base_id', {
                rules: [{ required: true, message: '类型' }],
              })(
                <Select>
                  <Option key={38} value={38}>
                    协议公司
                  </Option>
                  <Option key={39} value={39}>
                    中/旅
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '名称' }],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="公司名称">{getFieldDecorator('company', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="市场">
              {getFieldDecorator('market_id', {
                rules: [{ required: true, message: '请选择市场' }],
              })(
                <Select>
                  {market.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="城市">{getFieldDecorator('city', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="地址">{getFieldDecorator('address', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电话">{getFieldDecorator('phone', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="传真">{getFieldDecorator('fax', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="邮箱">{getFieldDecorator('email', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="联系人">{getFieldDecorator('linkman', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="联系人职位">
              {getFieldDecorator('occupation', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="联系人生日">
              {getFieldDecorator('birth', {})(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="销售员">
              {getFieldDecorator('representative', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="纳税人识别号">
              {getFieldDecorator('taxpayer_no', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="纳税人电话">{getFieldDecorator('telPhone', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="纳税人邮箱">{getFieldDecorator('tax_emai', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开户行">{getFieldDecorator('bank_name', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账户">{getFieldDecorator('bank_account', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="AR协议">
              {getFieldDecorator(
                'ar_account',
                {},
              )(
                <Select>
                  <Option key={'0'} value={'0'}>
                    无
                  </Option>
                  <Option key={'1'} value={'1'}>
                    有
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="金额限制">
              {getFieldDecorator('account_limit', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="余额">
              {getFieldDecorator('account_balance', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">{getFieldDecorator('memo', {})(<Input />)}</Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(CompanyModal);
