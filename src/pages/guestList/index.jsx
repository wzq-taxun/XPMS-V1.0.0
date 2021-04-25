import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { Tabs, Table, Input, DatePicker } from 'antd';
import { router } from 'umi';
import { useState, useEffect } from 'react';
import { getOrders } from '@/services/order';
import Constans from '@/constans';
import Dict from '@/dictionary';
import ProTable from '@ant-design/pro-table';
import OrderTable from './OrderTable';
import { getCanal, getRoomType, getSource } from '@/services/checkIn';
import Constants from '@/constans';
import OrderHisTable from './OrderHisTable';
import OnAccountOrder from './OnAccountOrder';
import AccountOrder from './AccountOrder';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const GuestList = props => {
  const [orderTypeEnum, setOrderTypeEnum] = useState({});
  const [guestTypeEnum, setGuestTypeEnum] = useState({});
  const [roomTypeEnum, setRoomTypeEnum] = useState({});
  const [canalsEnum, setCanalsEnum] = useState({});
  const [keyval, setKeyval] = useState('1');

  useEffect(() => {
    let tempOrderTypeEnum = {};
    Dict.orderType.map(item => {
      tempOrderTypeEnum[item.id] = { text: item.name };
    });
    setOrderTypeEnum(tempOrderTypeEnum);

    let tempGuestTypeEnum = {};
    Dict.guestType.map(item => {
      tempGuestTypeEnum[item.id] = { text: item.name };
    });
    setGuestTypeEnum(tempGuestTypeEnum);

    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        let tempRoomTypeEnum = {};
        list.map(item => {
          tempRoomTypeEnum[item.id] = { text: item.name };
        });
        setRoomTypeEnum(tempRoomTypeEnum);
      }
    });

    getCanal().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        let tempCanalsEnum = {};
        list.map(item => {
          tempCanalsEnum[item.id] = { text: item.description };
        });
        setCanalsEnum({ ...tempCanalsEnum, 0: '未知' });
      }
    });
    // 判断
    if (sessionStorage.getItem('activekey')) {
      setKeyval(sessionStorage.getItem('activekey'))
    }
  }, []);

  const columnsBase = [
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
      // hideInSearch: true,
      valueEnum: {
        R: {
          text: 'R',
        },
        I: {
          text: 'I',
        },
        O: {
          text: 'O',
        },
        X: {
          text: 'X',
        },
        RG: {
          text: 'RG',
        },
        N: {
          text: 'N',
        },
      },
    },
    {
      title: '订单类型',
      dataIndex: 'order_type_id',
      key: 'order_type_id',
      valueEnum: orderTypeEnum,
      // render: text => {
      //   const orderTypeArr = Dict.orderType.filter(item => item.id == text);
      //   return orderTypeArr && orderTypeArr[0] && orderTypeArr[0].name;
      // },
    },
    {
      title: '客人类型',
      dataIndex: 'guest_type_id',
      key: 'guest_type_id',
      valueEnum: guestTypeEnum,
      // render: text => {
      //   const guestTypeArr = Dict.guestType.filter(item => item.id == text);
      //   return guestTypeArr && guestTypeArr[0] && guestTypeArr[0].name;
      // },
    },
    {
      title: '渠道',
      dataIndex: 'canals_id',
      key: 'canals_id',
      valueEnum: canalsEnum,
    },
    {
      title: '姓名',
      dataIndex: 'reserve_name',
      key: 'reserve_name',
    },
    {
      title: '房型',
      key: 'room_type_id',
      dataIndex: 'room_type_id',
      sorter: true,
      valueEnum: roomTypeEnum,
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
      hideInSearch: true,
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
      hideInSearch: true,
    },
    {
      title: '到达时间',
      key: 'checkin_range',
      dataIndex: 'checkin_range',
      hideInTable: true,
      valueType: 'dateRange',
      renderFormItem: (item, props, form) => {
        return <RangePicker onChange={props.onChange} />;
      },
    },
    {
      title: '离店时间',
      key: 'checkout_time',
      dataIndex: 'checkout_time',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '离店时间',
      key: 'checkout_range',
      dataIndex: 'checkout_start',
      hideInTable: true,
      valueType: 'dateRange',
      renderFormItem: (item, props, form) => {
        return <RangePicker onChange={props.onChange} />;
      },
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

  const columns = [
    ...columnsBase,
    {
      title: '备注',
      key: 'order_desc',
      dataIndex: 'order_desc',
      hideInSearch: true,
    },
  ];

  const columns1 = [
    ...columnsBase,
    {
      title: '保留时间',
      key: 'retain_time',
      dataIndex: 'retain_time',
      hideInSearch: true,
    },
    {
      title: '备注',
      key: 'order_desc',
      dataIndex: 'order_desc',
      hideInSearch: true,
    },
  ];

  const handleTabsChange = params => {
    const activekey = params.activekey;
    console.log(activekey)
    // let type = 'R';
    // if (activekey == '1') {
    //   // 应到未到
    //   type = 'R';
    // } else if (activekey == '2') {
    //   // 应离未离
    //   type = 'YO';
    // } else if (activekey == '3') {
    //   // 今日已到
    //   type = 'I';
    // } else if (activekey == '4') {
    //   // 今日离店
    //   type = 'O';
    // } else if (activekey == '5') {
    //   // 当前在住
    //   type = 'IN';
    // } else if (activekey == '6') {
    //   // 明日将到
    //   type = 'RY';
    // } else if (activekey == '7') {
    //   // 当前挂账
    //   type = 'S';
    // } else if (activekey == '8') {
    //   // 所有预定
    //   type = 'RA';
    // } else if (activekey == '9') {
    //   // 所有登记
    //   type = 'A';
    // } else if (activekey == '10') {
    //   // 今日欲离
    //   type = 'IR';
    // }
    // // getOrdersDate(type, startRow, pageSize, order_no, room_no, guest_name, reserve_tel);
    // getOrdersDate(type, params);
    setKeyval(activekey)
    sessionStorage.setItem('activekey', activekey)
  };

  return (
    <GridContent>
      <div className={styles.header}>
        宾客列表
        <span className={styles.exit} onClick={() => router.push('overview')}>
          退出
        </span>
      </div>
      <Tabs
        style={{ background: '#fff', padding: '5px 15px' }}
        onChange={activekey => handleTabsChange({ activekey })}
        tabBarGutter={8}
        activeKey={keyval}
      >
        <TabPane tab="今日应到" key="1">
          <OrderTable columns={columns1} type={'R'} />
        </TabPane>
        <TabPane tab="应离未离" key="2">
          <OrderTable columns={columns} type={'YO'} />
        </TabPane>
        <TabPane tab="今日已到" key="3">
          <OrderTable columns={columns} type={'I'} />
        </TabPane>
        <TabPane tab="今日预离" key="10">
          <OrderTable columns={columns} type={'IR'} />
        </TabPane>
        <TabPane tab="今日已离" key="4">
          <OrderTable columns={columns} type={'O'} />
        </TabPane>
        <TabPane tab="当前在住" key="5">
          <OrderTable columns={columns} type={'IN'} />
        </TabPane>
        <TabPane tab="明日将到" key="6">
          <OrderTable columns={columns1} type={'RY'} />
        </TabPane>
        <TabPane tab="当前挂账" key="7">
          <OnAccountOrder />
          {/* <OrderTable columns={columns} type={'S'} /> */}
        </TabPane>
        <TabPane tab="当前预定" key="8">
          <OrderTable columns={columns1} type={'NRA'} />
        </TabPane>
        <TabPane tab="当前登记" key="9">
          <OrderTable columns={columns1} type={'NA'} />
        </TabPane>
        <TabPane tab="所有查询" key="11">
          <OrderHisTable />
        </TabPane>
        <TabPane tab="账务查询" key="12">
          <AccountOrder />
        </TabPane>
      </Tabs>
    </GridContent>
  );
};

export default GuestList;
