import { Form, Modal, Row, Col, Input, Button } from 'antd';

const AccountDetail = props => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };

  const {
    form: { getFieldDecorator },
  } = props;

  return (
    <Modal
      visible={props.visible}
      title="账务详情"
      width={720}
      onCancel={props.handleAccountColse}
      footer={<Button onClick={() => props.handleAccountColse()}>关闭</Button>}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="房号">
              {getFieldDecorator('room_no', { initialValue: props.record && props.record.room_no })(
                <Input disabled />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账务单号">
              {getFieldDecorator('account_no', {
                initialValue: props.record && props.record.account_no,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账项代码">
              {getFieldDecorator('account_code', {
                initialValue: props.record && props.record.account_code,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="小类代码">
              {getFieldDecorator('account_detail_type', {
                initialValue: props.record && props.record.account_detail_type,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账项描述">
              {getFieldDecorator('description', {
                initialValue: props.record && props.record.description,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="总价">
              {getFieldDecorator('charge', {
                initialValue: props.record && props.record.charge,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="借方金额">
              {getFieldDecorator('debit_charge', {
                initialValue: props.record && props.record.debit_charge,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="贷方金额">
              {getFieldDecorator('credit_charge', {
                initialValue: props.record && props.record.credit_charge,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="结账单号">
              {getFieldDecorator('close_account_no', {
                initialValue: props.record && props.record.close_account_no,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="付款单号">
              {getFieldDecorator('pay_account_no', {
                initialValue: props.record && props.record.pay_account_no,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="营业日期">
              {getFieldDecorator('audit_date', {
                initialValue: props.record && props.record.audit_date,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="发生时间">
              {getFieldDecorator('generate_time', {
                initialValue: props.record && props.record.generate_time,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="账务状态">
              {getFieldDecorator('status', {
                initialValue: props.record && props.record.status_name,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          {props.record && props.record.company_name && (
            <Col span={12}>
              <Form.Item label="挂账公司">
                {getFieldDecorator('company_name', {
                  initialValue: props.record && props.record.company_name,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item label="操作员">
              {getFieldDecorator('operate_user_name', {
                initialValue: props.record && props.record.operate_user_name,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="班次">
              {getFieldDecorator('work_shift_name', {
                initialValue: props.record && props.record.work_shift_name,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="摘要">
              {getFieldDecorator('summary', {
                initialValue: props.record && props.record.summary,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
                initialValue: props.record && props.record.memo,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(AccountDetail);
