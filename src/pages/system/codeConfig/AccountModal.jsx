import { Modal, Row, Col, Input, Form, message, DatePicker, Select } from 'antd';
import { useEffect, useState } from 'react';
import { saveCodeAccount, updateCodeAccount } from '@/services/system/codeConfig';
import Constants from '@/constans';
import moment from 'moment';
import Dict from '@/dictionary';
import { getAccountDetailType } from '@/services/account';

const { Option } = Select;

const AccountMoal = props => {
  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const {
          account_type,
          account_code,
          description,
          description_en,
          memo,
          date_start,
          date_end,
          account_detail_type,
        } = props.formValues;
        props.form.setFieldsValue({
          account_type,
          account_code,
          description,
          description_en,
          memo,
          date_start: moment(date_start),
          date_end: moment(date_end),
          account_detail_type,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  useEffect(() => {
    getAccountDetailType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setDetailTypes(data);
        setAllDetailTypes(data);
        let xf = [];
        let fk = [];
        let tk = [];
        let ys = [];
        data.map(item => {
          if (item.types.includes('XF')) {
            xf.push(item);
          }
          if (item.types.includes('FK')) {
            fk.push(item);
          }
          if (item.types.includes('TK')) {
            tk.push(item);
          }
          if (item.types.includes('YS')) {
            ys.push(item);
          }
        });
        setXfDetailTypes(xf);
        setFkDetailTypes(fk);
        setTkDetailTypes(tk);
        setYsDetailTypes(ys);
      } else {
        setDetailTypes([]);
        setAllDetailTypes([]);
        setXfDetailTypes([]);
        setFkDetailTypes([]);
        setTkDetailTypes([]);
        setYsDetailTypes([]);
      }
    });
  }, []);

  const [detailTypes, setDetailTypes] = useState([]);
  const [allDetailTypes, setAllDetailTypes] = useState([]);
  const [xfDetailTypes, setXfDetailTypes] = useState([]);
  const [fkDetailTypes, setFkDetailTypes] = useState([]);
  const [tkDetailTypes, setTkDetailTypes] = useState([]);
  const [ysDetailTypes, setYsDetailTypes] = useState([]);

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

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        fieldsValue.date_start =
          fieldsValue.date_start && fieldsValue.date_start.format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.date_end =
          fieldsValue.date_end && fieldsValue.date_end.format('YYYY-MM-DD HH:mm:ss');

        if (fieldsValue.account_type) {
          Dict.accountType.map(item => {
            if (item.code == fieldsValue.account_type) {
              fieldsValue.credit_debit = item.credit_debit;
            }
          });
        }

        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { hotel_group_id, hotel_id, id: create_user } = currentUser;
        const modify_user = create_user;
        if (props.isAdd) {
          setLoading(true);
          saveCodeAccount([
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
          updateCodeAccount([{ ...fieldsValue, id: props.formValues.id, modify_user }]).then(
            rsp => {
              setLoading(false);
              if (rsp && rsp.code == Constants.SUCCESS) {
                message.success(rsp.message || '修改成功');
                props.handleCancel(true);
              }
            },
          );
        }
      }
    });
  };

  const [loading, setLoading] = useState(false);

  const handleAccountTypeCg = value => {
    let details = [...detailTypes];
    if (value == 'XF') {
      details = [...xfDetailTypes];
    } else if (value == 'FK') {
      details = [...fkDetailTypes];
    } else if (value == 'TK') {
      details = [...tkDetailTypes];
    } else if (value == 'YS') {
      details = [...ysDetailTypes];
    }
    setDetailTypes(details);
    props.form.setFieldsValue({ account_detail_type: null });
  };

  return (
    <Modal
      title="账项代码"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="账务类型">
              {getFieldDecorator('account_type', {
                rules: [{ required: true, message: '请输入代码' }],
              })(
                <Select onChange={value => handleAccountTypeCg(value)}>
                  {Dict.accountType.map(item => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账务小类">
              {getFieldDecorator('account_detail_type', {
                rules: [{ required: true, message: '请输入代码' }],
              })(
                <Select>
                  {detailTypes.map(item => (
                    <Option key={item.code} value={item.code}>
                      {item.description}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="编码">
              {getFieldDecorator('account_code', {
                rules: [{ required: true, message: '编码' }],
              })(<Input placeholder="编码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="名称">
              {getFieldDecorator('description', { rules: [{ required: true, message: '名称' }] })(
                <Input placeholder="名称" />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="英文名称">
              {getFieldDecorator('description_en', {})(<Input placeholder="英文名称" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始">
              {getFieldDecorator('date_start', { rules: [{ required: true, message: '排序' }] })(
                <DatePicker format="YYYY-MM-DD" />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="截止">
              {getFieldDecorator('date_end', {
                rules: [{ required: true, message: '排序' }],
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item label="借贷方">
              {getFieldDecorator(
                'credit_debit',
                {},
              )(
                <Select>
                  <Option value={'2'}>借方</Option>
                  <Option value={'1'}>贷方</Option>
                </Select>,
              )}
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item label="描述">
              {getFieldDecorator('memo', {})(<Input placeholder="描述" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(AccountMoal);
