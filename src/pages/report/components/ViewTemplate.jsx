import { Form, Input, DatePicker, Select, Modal } from 'antd';
import React, { useRef } from 'react';
import moment, { now } from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDictList, getDynamicDicts } from '@/services/report';
import Constans from '@/constans';
const { RangePicker } = DatePicker;
const { Option } = Select;

const FormItem = Form.Item;

const ViewTemplate = props => {
  useEffect(() => {
    let params = props.record && props.record.param_form;
    if (params) {
      params = JSON.parse(params);
      setParams(params);

      let tempDateList = [];
      let tempSelectDatas = {};
      params.map(item => {
        if (item.type == 'dict') {
          getDictList(item.dicttype).then(rsp => {
            if (rsp && rsp.code && rsp.code == Constans.SUCCESS) {
              // let selectDatas = { ...selectDatas };
              // selectDatas[item.name] = rsp.data || [];
              // console.log(item.dicttype);
              // if (item.dicttype == 'SHIFT') {
              //   selectDatas[item.name].unshift({ id: 0, description: '全部' });
              // }
              // setSelectDatas(selectDatas);

              tempSelectDatas[item.name] = rsp.data || [];
              if (item.dicttype == 'SHIFT') {
                tempSelectDatas[item.name].unshift({ id: 0, description: '全部' });
              }
            }
          });
        } else if (item.type == 'dynamic_dict') {
          let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
          const { hotel_group_id, hotel_id } = currentUser || {};
          getDynamicDicts({
            configid: item.dynamic_dict_id,
            params: JSON.stringify({ hotel_group_id, hotel_id }),
          }).then(rsp => {
            if (rsp && rsp.code && rsp.code == Constans.SUCCESS) {
              // let selectDatas = { ...selectDatas };
              // selectDatas[item.name] = rsp.data || [];
              // setSelectDatas(selectDatas);
              tempSelectDatas[item.name] = rsp.data || [];
              if (item.name == 'cashier') {
                tempSelectDatas[item.name].unshift({ id: 0, description: '全部' });
              }
            }
          });
        } else if (item.type == 'date') {
          // setDateList([...dateList, item.name]);
          tempDateList.push(item.name);
        }
      });
      setDateList(tempDateList);
      setSelectDatas(tempSelectDatas);
    } else {
      setParams([]);
      setSelectDatas({});
      setDateList([]);
    }
  }, [props.record]);

  const [params, setParams] = useState([]);
  const [selectDatas, setSelectDatas] = useState({});
  const [dateList, setDateList] = useState([]);

  const { modalVisible, form, onSubmit: handleView, onCancel, record } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // console.log(fieldsValue);
      for (const key in fieldsValue) {
        if (typeof fieldsValue[key] == 'object') {
          if (dateList.includes(key)) {
            fieldsValue[key] = fieldsValue[key].format('YYYY-MM-DD');
          } else {
            fieldsValue[key] = fieldsValue[key].format('YYYY-MM-DD HH:mm:ss');
          }
        }
      }
      form.resetFields();
      handleView(fieldsValue);
    });
  };

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
      title="参数设置"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form {...formItemLayout}>
        {params.map((item, inde) => {
          if (item.type == 'input') {
            return (
              <FormItem label={item.label} key={inde}>
                {form.getFieldDecorator(`${item.name}`, {
                  rules: [{ required: true, message: '不能为空!' }],
                })(<Input />)}
              </FormItem>
            );
          } else if (item.type == 'date') {
            return (
              <FormItem label={item.label} key={inde}>
                {form.getFieldDecorator(`${item.name}`, {
                  rules: [{ required: true, message: '不能为空!' }],
                })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
              </FormItem>
            );
          } else if (item.type == 'dateTime') {
            return (
              <FormItem label={item.label} key={inde}>
                {form.getFieldDecorator(`${item.name}`, {
                  rules: [{ required: true, message: '不能为空!' }],
                })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '100%' }} />)}
              </FormItem>
            );
          } else if (item.type == 'dict' || item.type == 'dynamic_dict') {
            return (
              <FormItem label={item.label} key={inde}>
                {form.getFieldDecorator(`${item.name}`, {
                  rules: [{ required: true, message: '不能为空!' }],
                })(
                  <Select style={{ width: '100%' }}>
                    {selectDatas &&
                      selectDatas[item.name] &&
                      selectDatas[item.name].map(value => (
                        <Option key={value.id} value={value.id}>
                          {value.description}
                        </Option>
                      ))}
                  </Select>,
                )}
              </FormItem>
            );
          }
        })}
      </Form>
    </Modal>
  );
};

export default Form.create()(ViewTemplate);
