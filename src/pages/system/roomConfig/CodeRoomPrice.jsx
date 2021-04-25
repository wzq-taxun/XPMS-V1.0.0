import ProTable from '@ant-design/pro-table';
import { useState, useRef } from 'react';
import { updateRoomPrice } from '@/services/system/roomConfig';
import { Button, message, Divider, Popconfirm, Select, Form } from 'antd';
import Constants from '@/constans';
import { queryRoomPrice } from '@/services/system/roomConfig';
import { useEffect } from 'react';
import moment from 'moment';
import { getRoomType, getMarket, getRoomRateCode } from '@/services/checkIn';
import Dict from '@/dictionary';
import RoomPriceModal from './RoomPriceModal';

const { Option } = Select;

const CodeRoomPrice = props => {
  const columns = [
    {
      title: '房型',
      dataIndex: 'room_type_name',
      key: 'room_type_name',
    },
    {
      title: '房价码',
      dataIndex: 'rate_code',
      key: 'rate_code',
    },
    {
      title: '房价码名称',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '房价',
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: '周一房价',
      dataIndex: 'rate_monday',
      key: 'rate_monday',
    },
    {
      title: '周二房价',
      dataIndex: 'rate_tuesday',
      key: 'rate_tuesday',
    },
    {
      title: '周三房价',
      dataIndex: 'rate_wednesday',
      key: 'rate_wednesday',
    },
    {
      title: '周四房价',
      dataIndex: 'rate_thursday',
      key: 'rate_thursday',
    },
    {
      title: '周五房价',
      dataIndex: 'rate_friday',
      key: 'rate_friday',
    },
    {
      title: '周六房价',
      dataIndex: 'rate_saturday',
      key: 'rate_saturday',
    },
    {
      title: '周日房价',
      dataIndex: 'rate_sunday',
      key: 'rate_sunday',
    },
    {
      title: '优先级',
      dataIndex: 'rate_priority',
      key: 'rate_priority',
      valueEnum: {
        1: {
          text: '标准房价',
        },
        2: {
          text: '每周房价',
        },
      },
    },
    {
      title: '逾期房费',
      dataIndex: 'rate_overdue',
      key: 'rate_overdue',
    },
    {
      title: '开始',
      dataIndex: 'date_start',
      key: 'date_start',
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '截止',
      dataIndex: 'date_end',
      key: 'date_end',
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '有效',
      dataIndex: 'valid',
      key: 'valid',
      valueEnum: {
        '0': {
          text: '无效',
        },
        '1': {
          text: '有效',
        },
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleUpdateRow(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => handleDeleteRow(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const [modalVis, setModalVis] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [add, setAdd] = useState(true);
  // const actionRef = useRef();

  const handleAdd = () => {
    setFormValues(null);
    setAdd(true);
    setModalVis(true);
  };

  const handleUpdateRow = record => {
    setFormValues(record);
    setAdd(false);
    setModalVis(true);
  };

  const handleDeleteRow = record => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    updateRoomPrice([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        getTableData();
        // if (actionRef.current) {
        //   actionRef.current.reload();
        // }
      }
    });
  };

  const handleCancel = refush => {
    setModalVis(false);
    if (refush) {
      getTableData();
      // if (actionRef.current) {
      //   actionRef.current.reload();
      // }
    }
  };

  useEffect(() => {
    getTableData();

    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data;
        setRoomTypes(list);
      }
    });

    getMarket().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data;
        setMarkets(list);
      }
    });

    getRoomRateData();
  }, []);

  const [total, setTotal] = useState(0);

  const getTableData = (room_type_id, code_room_rate_id, startRow, pageSize) => {
    queryRoomPrice({ room_type_id, code_room_rate_id, startRow, pageSize }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data;
        setList(data && data.result);
        setTotal(data && data.count);
      }
    });
  };

  const getRoomRateData = (market_id, order_type_id) => {
    market_id = market_id || marketId;
    order_type_id = order_type_id || orderTypeId;
    getRoomRateCode({ market_id, order_type_id }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data;
        setRoomRates(list);
      }
    });
  };

  const [roomTypeId, setRoomTypeId] = useState(0);
  const [roomRateId, setRoomRateId] = useState(0);

  const [orderTypeId, setOrderTypeId] = useState(0);
  const [marketId, setMarketId] = useState(0);

  const [list, setList] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [roomRates, setRoomRates] = useState([]);

  const handleSearch = () => {
    getTableData(roomTypeId, roomRateId);
  };

  const handleOrderTypeChange = value => {
    setOrderTypeId(value);
    getRoomRateData(null, value);
  };

  const handleMarketChange = value => {
    setMarketId(value);
    getRoomRateData(value);
  };

  return (
    <>
      <Form layout="inline" style={{ marginLeft: '20px' }}>
        <Form.Item label="房型">
          <Select
            style={{ minWidth: '100px' }}
            onChange={value => setRoomTypeId(value)}
            defaultValue={0}
          >
            <Option key={0} value={0}>
              全部
            </Option>
            {roomTypes.map(item => (
              <Option style={{ width: '100%' }} key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="订单类型">
          <Select
            style={{ minWidth: '100px' }}
            onChange={value => handleOrderTypeChange(value)}
            defaultValue={0}
          >
            <Option key={0} value={0}>
              全部
            </Option>
            {Dict.orderType.map(item => (
              <Option style={{ width: '100%' }} key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="市场">
          <Select
            style={{ minWidth: '100px' }}
            onChange={value => handleMarketChange(value)}
            defaultValue={0}
          >
            <Option key={0} value={0}>
              全部
            </Option>
            {markets.map(item => (
              <Option style={{ width: '100%' }} key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="房价码">
          <Select
            style={{ minWidth: '100px' }}
            onChange={value => setRoomRateId(value)}
            defaultValue={0}
          >
            <Option key={0} value={0}>
              全部
            </Option>
            {roomRates.map(item => (
              <Option style={{ width: '100%' }} key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => handleSearch()}>
            搜索
          </Button>
        </Form.Item>
      </Form>
      <ProTable
        columns={columns}
        search={false}
        // actionRef={actionRef}
        dataSource={list}
        options={{ density: true, fullScreen: true, reload: false, setting: true }}
        pagination={{
          total: total,
          onChange: (page, pageSize) => {
            getTableData(roomTypeId, roomRateId, (page - 1) * pageSize, pageSize);
          },
          showSizeChanger: true,
          onShowSizeChange: (page, pageSize) => {
            getTableData(roomTypeId, roomRateId, (page - 1) * pageSize, pageSize);
          },
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: total => `总计 ${total} 条`,
        }}
        // request={() => queryRoomPrice()}
        rowKey="id"
        style={{ minHeight: '650px' }}
        scroll={{ x: 'max-content' }}
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />
      <RoomPriceModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />
    </>
  );
};

export default CodeRoomPrice;
