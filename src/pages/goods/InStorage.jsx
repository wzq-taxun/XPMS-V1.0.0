import { Row, Form, Select, Table, InputNumber, Input, Col, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import Constants from '@/constans';
import styles from './style.less';
import { getGoods } from '@/services/order';
import { saveGoods } from '@/services/goods';
import { PageLoading } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
const { Option } = Select;

const Instorage = props => {
  const columns = [
    {
      title: '代码',
      dataIndex: 'goods_type',
      key: 'goods_type',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '商品',
      dataIndex: 'goods_info_name',
      key: 'goods_info_name',
      align: 'center',
    },
    {
      title: '简称',
      dataIndex: 'goods_short_name',
      key: 'goods_short_name',
      align: 'center',
    },
    {
      title: '库存',
      dataIndex: 'numbers',
      key: 'numbers',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '售价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      hideInSearch: true,
    },
  ];

  const inColumns = [
    {
      title: '名称',
      dataIndex: 'goods_info_name',
      key: 'goods_info_name',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'numbers',
      key: 'numbers',
      align: 'center',
      render: (text, record, index) => (
        <InputNumber value={text} onChange={value => handelChangeField('numbers', value, index)} />
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'op',
      key: 'op',
      align: 'center',
      render: (text, record, index) => <a onClick={e => handleRemove(index)}>X</a>,
    },
  ];

  const handelChangeField = (field, value, index) => {
    const tempGoods = [...inGoods];
    tempGoods[index][field] = value;
    setInGoods(tempGoods);
  };

  const handleRemove = index => {
    const tempGoods = [...inGoods];
    tempGoods.splice(index, 1);
    setInGoods(tempGoods);
  };

  const [allGoods, setAllGoods] = useState([]);
  // useEffect(() => {
  //   getGoods().then(rsp => {
  //     if (rsp && rsp.code == Constants.SUCCESS) {
  //       const data = rsp.data || [];
  //       setAllGoods(data);
  //     }
  //   });
  // }, []);

  const [inGoods, setInGoods] = useState([]);

  const handleRowClick = record => {
    const tempGoods = [...inGoods];
    let has = false;
    for (let i = 0; i < tempGoods.length; i++) {
      if (tempGoods[i].goods_info_id == record.goods_info_id) {
        tempGoods[i].numbers += 1;
        has = true;
        break;
      }
    }
    if (!has) {
      tempGoods.push({
        goods_info_id: record.goods_info_id,
        goods_info_name: record.goods_info_name,
        goods_type_id: record.goods_type_id,
        price: record.price,
        numbers: 1,
      });
    }
    setInGoods(tempGoods);
  };

  const [loading, setLoading] = useState(false);

  const inStorageSubmit = () => {
    if (inGoods.length < 1) {
      message.error('请至少选择一个商品');
    }

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let goods = [];
    inGoods.map(item => {
      goods.push({
        id: item.goods_info_id,
        hotel_group_id: currentUser.hotel_group_id,
        hotel_id: currentUser.hotel_id,
        type_id: item.goods_type_id,
        name: item.goods_info_name,
        price: item.price,
        numbers: item.numbers,
        create_user: currentUser.id,
        modify_user: currentUser.id,
      });
    });

    console.log(goods);

    setLoading(true);
    saveGoods(goods).then(rsp => {
      setLoading(false);
      if (rsp && rsp.code == Constants.SUCCESS) {
        props.back();
      }
    });
  };

  //   const {
  //     form: { getFieldDecorator },
  //   } = props;

  //   const formItemLayout = {
  //     labelCol: {
  //       xs: { span: 24 },
  //       sm: { span: 6 },
  //     },
  //     wrapperCol: {
  //       xs: { span: 24 },
  //       sm: { span: 18 },
  //     },
  //   };

  return (
    <Row gutter={8}>
      <Col span={16}>
        <ProTable
          columns={columns}
          // dataSource={allGoods}
          className={styles.myProtable}
          request={params => getGoods(params)}
          rowKey="goods_info_id"
          size="middle"
          onRow={record => {
            return {
              onClick: e => {
                handleRowClick(record);
              },
            };
          }}
        />
      </Col>
      <Col span={8}>
        <div style={{ paddingRight: '10px', paddingBottom: '10px' }}>
          <div
            style={{
              height: '35px',
              background: '#2F3754',
              padding: '5px 10px',
              color: '#fff',
              lineHeight: '25px',
            }}
          >
            入库商品
          </div>
          <Table columns={inColumns} dataSource={inGoods} rowKey="goods_info_id" size="small" />
          {/* <div style={{ height: '300px', marginTop: '20px' }}> */}
          {/* <Form {...formItemLayout} style={{ marginTop: '20px' }}>
            <Form.Item label="单号" style={{ marginBottom: '6px' }}>
              {getFieldDecorator('order_no', {})(<Input style={{ width: '80%' }} />)}
            </Form.Item>
            <Form.Item label="备注" style={{ marginBottom: '6px' }}>
              {getFieldDecorator('remark', {})(<Input style={{ width: '80%' }} />)}
            </Form.Item>
          </Form> */}
          <div style={{ textAlign: 'center' }}>
            {loading ? (
              <PageLoading />
            ) : (
              <Button type="primary" onClick={inStorageSubmit}>
                入库
              </Button>
            )}
          </div>
          {/* </div> */}
        </div>
      </Col>
    </Row>
  );
};

// export default Form.create()(Instorage);
export default Instorage;
