const getRoomsRet = {
  code: '1',
  data: [
    {
      key: '1',
      roomNo: '3002',
      roomState: 1,
      occupie: true,
      roomType: '商务大床房',
    },
    {
      key: '2',
      roomNo: '3003',
      roomState: 2,
      occupie: false,
      roomType: '商务大床房',
    },
    {
      key: '3',
      roomNo: '3004',
      roomState: 3,
      occupie: true,
      roomType: '商务大床房',
    },
  ],
};

const getOrderRet = {
  code: '1',
  data: {
    reserve_name: '张测试',
    reserve_tel: '15288886666',
    days_num: 1,
    room_no: '1002',
    room_type: '豪华商务双床间',
    guest_type: 'GT001',
    linkNum: 0,
    order_type: 'TOO001',
    checkin_time: '2020-02-02 10:50:50',
    checkout_time: '2020-02-02 10:50:50',
    room_num: 4,
  },
};

const getReserveRet = {
  code: '1',
  data: [
    {
      id: 1,
      room_type_id: 1,
      room_type_name: '商务大床房',
      code: 'SWDCF',
      price: '198.00',
      ydpf: '1/0',
      checkin_time: '2020-02-06',
      checkout_time: '2020-02-09',
      days_num: '1',
      order_type: 1,
    },
    {
      id: 2,
      room_type_id: 1,
      room_type_name: '商务双床房',
      code: 'SB',
      price: '198.00',
      ydpf: '1/0',
      checkin_time: '2020-02-06',
      checkout_time: '2020-02-09',
      days_num: '3',
      order_type: 1,
    },
  ],
};

export default {
  'GET /api/getRooms': getRoomsRet,
  'GET /api/order/getOrder': getOrderRet,
  'GET /api/order/getReserve': getReserveRet,
};
