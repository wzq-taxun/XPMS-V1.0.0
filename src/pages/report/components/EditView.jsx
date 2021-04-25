import { Form, Input, DatePicker, Select, Modal } from 'antd';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { queryReportDetail } from '@/services/report';
import Constans from '@/constans';
import Constants from '@/constans';
const { TextArea } = Input;

const FormItem = Form.Item;

const EditView = props => {
  const [reportDetailId, setReportDetailId] = useState(null);
  useEffect(() => {
    if (props.visible) {
      if (props.reportId) {
        queryReportDetail(props.reportId).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            if (rsp.data && rsp.data[0]) {
              setReportDetailId(rsp.data[0].id);
              props.form.setFieldsValue({
                content: rsp.data[0].content,
              });
            }
          }
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  const editSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      props.form.resetFields();
      props.onSubmit({ ...fieldsValue, id: reportDetailId, report_id: props.reportId });
      props.onCancel();
    });
  };

  const {
    form: { getFieldDecorator },
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  return (
    <Modal
      destroyOnClose
      title="编辑报表"
      width={800}
      visible={props.visible}
      onOk={editSubmit}
      onCancel={() => props.onCancel()}
    >
      <Form {...formItemLayout}>
        <FormItem label="报表内容">
          {getFieldDecorator(`content`, {
            rules: [{ required: true, message: '不能为空!' }],
          })(<TextArea rows={20} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create()(EditView);
