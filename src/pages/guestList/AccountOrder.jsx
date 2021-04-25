import { Table, Input, Form, Button, DatePicker, Row, Col, Select } from 'antd';
import styles from './style.less';
import { router } from 'umi';
import { useState } from 'react';
import Dict from '@/dictionary';
import { useEffect } from 'react';
import { getRoomType } from '@/services/checkIn';
import Constants from '@/constans';
import moment from 'moment';
import { getAccountOrders } from '@/services/order';

const { Option } = Select;

const AccountOrder = props => {
  useEffect(() => {
    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setRoomTypes(rsp.data || []);
      }
    });

    handleSearch();
  }, []);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);

  const columns = [
    {
      title: '账务单号',
      dataIndex: 'account_no',
      key: 'account_no',
      // render: text => <a>{text}</a>,
    },
    {
      title: '账务状态',
      dataIndex: 'status',
      key: 'status',
      render: text => {
        if (text == '1') {
          return '正常';
        } else if (text == '2') {
          return '结账';
        } else if (text == '3') {
          return '挂账';
        } else if (text == '4') {
          return '冲账';
        } else if (text == '5') {
          return '锁定';
        } else if (text == '6') {
          return '挂S账';
        } else {
          return text;
        }
      },
      hideInSearch: true,
    },
    {
      title: '账项编码',
      key: 'account_code',
      dataIndex: 'account_code',
    },
    {
      title: '账项描述',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: '金额',
      key: 'charge',
      dataIndex: 'charge',
    },
    {
      title: '发生时间',
      key: 'generate_time',
      dataIndex: 'generate_time',
    },
    {
      title: '订单号',
      key: 'order_no',
      dataIndex: 'order_no',
    },
    {
      title: '房号',
      key: 'room_no',
      dataIndex: 'room_no',
    },
    {
      title: '姓名',
      dataIndex: 'guest_name',
      key: 'guest_name',
    },
    {
      title: '房型',
      key: 'room_name',
      dataIndex: 'room_name',
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
    // {
    //   title: '联系方式',
    //   key: 'reserve_tel',
    //   dataIndex: 'reserve_tel',
    // },
  ];

  const handleReserveClick = record => {
    router.push({ pathname: 'orderDetail', query: { orderId: record.order_info_id } });
  };

  const handleSearch = params => {
    const { startRow = 0, pageSize = 10, field, sort } = params || {};
    const formValue = props.form.getFieldsValue();

    formValue.start_time =
      formValue.start_time && formValue.start_time.format('YYYY-MM-DD HH:mm:ss');
    formValue.end_time = formValue.end_time && formValue.end_time.format('YYYY-MM-DD HH:mm:ss');

    const query = { startRow, pageSize, field, sort, ...formValue };
    console.log(query);

    setLoading(true);
    getAccountOrders(query).then(rsp => {
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
            <Form.Item label="账务单号">{getFieldDecorator('account_no', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="账务状态">
              {getFieldDecorator(
                'status',
                {},
              )(
                <Select>
                  <Option value="" key="">
                    全部
                  </Option>
                  <Option key="1" value="1">
                    正常
                  </Option>
                  <Option key="2" value="2">
                    结账
                  </Option>
                  <Option key="3" value="3">
                    挂账
                  </Option>
                  <Option key="4" value="4">
                    冲账
                  </Option>
                  <Option key="5" value="5">
                    锁定
                  </Option>
                  <Option key="6" value="6">
                    挂S账
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="起始时间">
              {getFieldDecorator('start_time', {
                initialValue: moment().add(-3, 'day'),
              })(<DatePicker showTime />)}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="截止时间">
              {getFieldDecorator('end_time', {})(<DatePicker showTime />)}
            </Form.Item>
          </Col>
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

export default Form.create()(AccountOrder);
