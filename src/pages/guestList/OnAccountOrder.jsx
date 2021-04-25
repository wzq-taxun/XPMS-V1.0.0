import styles from './style.less';
import { router } from 'umi';
import { useEffect, useState } from 'react';
import { getOnAccoutOrders, getOrders } from '@/services/order';
import ProTable from '@ant-design/pro-table';
import Dict from '@/dictionary';
import { getCanal, getRoomType } from '@/services/checkIn';
import Constants from '@/constans';

const OnAccountOrder = props => {
  const handleReserveClick = record => {
    router.push({ pathname: 'orderDetail', query: { orderId: record.id } });
  };

  const [orderTypeEnum, setOrderTypeEnum] = useState({});
  const [guestTypeEnum, setGuestTypeEnum] = useState({});
  const [roomTypeEnum, setRoomTypeEnum] = useState({});
  const [canalsEnum, setCanalsEnum] = useState({});

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
  }, []);

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
    },
    {
      title: '客人类型',
      dataIndex: 'guest_type_id',
      key: 'guest_type_id',
      valueEnum: guestTypeEnum,
    },
    {
      title: '渠道',
      dataIndex: 'canals_id',
      key: 'canals_id',
      valueEnum: canalsEnum,
    },
    {
      title: '客户',
      dataIndex: 'guest_name',
      key: 'guest_name',
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
      title: '挂账金额',
      key: 'charge',
      dataIndex: 'charge',
      hideInSearch: true,
    },
    {
      title: '到达时间',
      key: 'checkin_time',
      dataIndex: 'checkin_time',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '离店时间',
      key: 'checkout_time',
      dataIndex: 'checkout_time',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '备注',
      key: 'order_desc',
      dataIndex: 'order_desc',
    },
  ];

  const [total, setTotal] = useState(0);

  return (
    <ProTable
      rowKey="id"
      scroll={{ x: 'max-content' }}
      rowClassName={styles.rowSty}
      className={styles.mytable}
      columns={columns}
      request={(params, sort) => {
        const query = { ...params };
        if (sort) {
          Object.keys(sort).forEach(key => {
            query.field = key;
          });
          query.sort = sort[query.field] == 'ascend' ? 'asc' : 'desc';
        }
        return getOnAccoutOrders(query);
      }}
      postData={data => {
        setTotal(data.count);
        return data.list;
      }}
      pagination={{ total: total, defaultPageSize: 10 }}
      onRow={record => {
        return {
          onClick: e => {
            handleReserveClick(record);
          },
        };
      }}
    />
  );
};

export default OnAccountOrder;
