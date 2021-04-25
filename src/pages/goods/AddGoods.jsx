import { Modal, Form, Select, Input, Row, Col, InputNumber } from 'antd';
import { useEffect } from 'react';
import { getGoodsType, saveGoods } from '@/services/goods';
import { useState } from 'react';
import Constans from '@/constans';
const { Option } = Select;

const AddGoods = props => {
  const [goodsType, setGoodsType] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGoodsType().then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const data = rsp.data || [];
        setGoodsType(data);
      }
    });
  }, []);

  const {
    form: { getFieldDecorator },
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 14, offset: -2 },
    },
  };

  const addGoodsSubmit = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const goods = [
          {
            hotel_group_id: currentUser.hotel_group_id,
            hotel_id: currentUser.hotel_id,
            type_id: values.type_id,
            name: values.name,
            short_name: values.short_name,
            price: values.price,
            numbers: 0,
            memo: values.memo,
            create_user: currentUser.id,
            modify_user: currentUser.id,
          },
        ];
        console.log(goods);

        setLoading(true);
        saveGoods(goods).then(rsp => {
          setLoading(false);
          if (rsp && rsp.code == Constans.SUCCESS) {
            props.cancelAddGoods(true);
          }
        });
      }
    });
  };

  return (
    <Modal
      visible={props.visible}
      title="添加商品"
      onCancel={() => props.cancelAddGoods()}
      onOk={addGoodsSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row type="flex">
          <Col span={12}>
            <Form.Item label="商品类型">
              {getFieldDecorator('type_id', {
                rules: [{ required: true, message: '请选择商品类型' }],
              })(
                <Select>
                  {goodsType.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.type_desc}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="商品名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '商品名称' }],
              })(<Input placeholder="商品名称" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="商品简称">
              {getFieldDecorator('short_name', {})(<Input placeholder="商品简称" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="商品单价">
              {getFieldDecorator('price', {
                rules: [{ required: true, message: '商品单价' }],
              })(<InputNumber placeholder="商品单价" min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="商品描述">
              {getFieldDecorator('memo', {})(<Input placeholder="商品描述" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(AddGoods);
