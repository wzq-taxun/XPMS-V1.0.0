import { Table, Input, Form, Button, DatePicker, Row, Col, Select } from 'antd';
import styles from './style.less';
import { router } from 'umi';
import { useState } from 'react';
import Dict from '@/dictionary';
import { useEffect } from 'react';
import { getCanal, getRoomType } from '@/services/checkIn';
import Constants from '@/constans';
import moment from 'moment';
import { getOrders } from '@/services/order';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OrderHisTable = props => {
  useEffect(() => {
    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setRoomTypes(rsp.data || []);
      }
    });

    getCanal().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setCanals(rsp.data || []);
      }
    });

    handleSearch();
  }, []);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [canals, setCanals] = useState([]);

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
      render: text => <a>{text}</a>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
    },
    {
      title: '订单类型',
      dataIndex: 'order_type_id',
      key: 'order_type_id',
      render: text => {
        const orderTypeArr = Dict.orderType.filter(item => item.id == text);
        return orderTypeArr && orderTypeArr[0] && orderTypeArr[0].name;
      },
    },
    {
      title: '客人类型',
      dataIndex: 'guest_type_id',
      key: 'guest_type_id',
      render: text => {
        const guestTypeArr = Dict.guestType.filter(item => item.id == text);
        return guestTypeArr && guestTypeArr[0] && guestTypeArr[0].name;
      },
    },
    {
      title: '渠道',
      dataIndex: 'canals_id',
      key: 'canals_id',
      render: (text, record) => {
        const canal = canals.filter(item => item.id == record.canals_id);
        return (canal && canal[0] && canal[0].description) || '未知';
      },
    },
    {
      title: '姓名',
      dataIndex: 'reserve_name',
      key: 'reserve_name',
    },
    {
      title: '房型',
      key: 'room_type',
      dataIndex: 'room_type',
    },
    {
      title: '房号',
      key: 'room_no',
      dataIndex: 'room_no',
      sorter: true,
    },
    {
      title: '房价',
      key: 'room_reality_rate',
      dataIndex: 'room_reality_rate',
    },
    {
      title: '联系方式',
      key: 'reserve_tel',
      dataIndex: 'reserve_tel',
    },
    {
      title: '到达时间',
      key: 'checkin_time',
      dataIndex: 'checkin_time',
      sorter: true,
    },
    {
      title: '离店时间',
      key: 'checkout_time',
      dataIndex: 'checkout_time',
      sorter: true,
    },

    // {
    //   title: '保留时间',
    //   key: 'retain_time',
    //   dataIndex: 'retain_time',
    // },
    // {
    //   title: '备注',
    //   key: 'order_desc',
    //   dataIndex: 'order_desc',
    // },
  ];

  const handleReserveClick = record => {
    router.push({ pathname: 'orderDetail', query: { orderId: record.id } });
  };

  const handleSearch = params => {
    const { startRow = 0, pageSize = 10, field, sort } = params || {};
    const formValue = props.form.getFieldsValue();
    const { checkin, checkout } = formValue;

    if (checkin && checkin.length == 2 && checkin[0] && checkin[1]) {
      formValue.checkin_start = checkin[0] && checkin[0].format('YYYY-MM-DD');
      formValue.checkin_end = checkin[1] && checkin[1].format('YYYY-MM-DD');
      delete formValue.checkin;
    }
    if (checkout && checkout.length == 2 && checkout[0] && checkout[1]) {
      formValue.checkout_start = checkout[0] && checkout[0].format('YYYY-MM-DD');
      formValue.checkout_end = checkout[1] && checkout[1].format('YYYY-MM-DD');
      delete formValue.checkout;
    }

    const query = { startRow, pageSize, field, sort, type: 'A', ...formValue };
    console.log(query);

    setLoading(true);
    getOrders(query).then(rsp => {
      setLoading(false);
      if (rsp && rsp.code == Constants.SUCCESS) {
        if (rsp.data) {
          const list = rsp.data.list || [];
          setData(list);
          const count = rsp.data.count || 0;
          setTotal(count);
        } else {
          setData([]);
          setTotal(0);
        }
      } else {
        setData([]);
        setTotal(0);
      }
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

  const {
    form: { getFieldDecorator },
  } = props;

  return (
    <>
      <Form {...formItemLayout} className={styles.searchForm}>
        <Row gutter={24} type="flex">
          <Col span={6}>
            <Form.Item label="订单号">{getFieldDecorator('order_no', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="房型">
              {getFieldDecorator(
                'room_type_id',
                {},
              )(
                <Select>
                  <Option value={0} key={0}>
                    全部
                  </Option>
                  {roomTypes &&
                    roomTypes.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="房号">{getFieldDecorator('room_no', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="订单类型">
              {getFieldDecorator(
                'order_type_id',
                {},
              )(
                <Select>
                  <Option value={0} key={0}>
                    全部
                  </Option>
                  {Dict.orderType.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="到店时间">
              {getFieldDecorator('checkin', { initialValue: [moment().add(-3, 'day'), moment().add(3, 'day')] })(
                <RangePicker />,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="离店时间">
              {getFieldDecorator('checkout', {})(<RangePicker />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="客户类型">
              {getFieldDecorator(
                'guest_type_id',
                {},
              )(
                <Select>
                  <Option value={0} key={0}>
                    全部
                  </Option>
                  {Dict.guestType.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="客户姓名">{getFieldDecorator('guest_name', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="手机号">{getFieldDecorator('phone', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="订单状态">
              {getFieldDecorator(
                'status',
                {},
              )(
                <Select>
                  <Option value="" key="">
                    全部
                  </Option>
                  <Option key="R" value="R">
                    R
                  </Option>
                  <Option key="I" value="I">
                    I
                  </Option>
                  <Option key="O" value="O">
                    O
                  </Option>
                  <Option key="X" value="X">
                    X
                  </Option>
                  <Option key="N" value="N">
                    N
                  </Option>
                  <Option key="RG" value="RG">
                    RG
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="渠道">
              {getFieldDecorator(
                'canals_id',
                {},
              )(
                <Select>
                  <Option value={null}>全部</Option>
                  {canals &&
                    canals.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.description}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={() => handleSearch()}>
                搜索
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className={styles.guestTable}>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          style={{ minHeight: '580px', marginTop: '20px' }}
          size="middle"
          rowKey="id"
          scroll={{ x: 'max-content' }}
          rowClassName={styles.rowSty}
          onRow={record => {
            return {
              onClick: e => {
                handleReserveClick(record);
              },
            };
          }}
          onChange={(pagination, filters, sorter) => {
            const { current, pageSize } = pagination || {};
            let { field, order } = sorter || {};
            if (order) {
              order = order == 'ascend' ? 'asc' : 'desc';
            }
            const param = {
              startRow: (current - 1) * pageSize,
              pageSize: pageSize,
              field,
              sort: order,
            };
            handleSearch(param);
          }}
          pagination={{
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: total => `总计 ${total} 条`,
          }}
        />
      </div>
    </>
  );
};

export default Form.create()(OrderHisTable);
