import request from '@/utils/request';
// 获取开票信息------------
export async function getQueorderdatahor(data) {
  return request.get(`/api/order/invoice/${data}`);
}
// 录入提交开票数据
export async function loggingdatatijiao(data) {
  return request.put(`/api/order/invoice`, {
    data,
  });
}
// 订单列表
export async function getOrders(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/order/order/' + hotel_group_id + '/' + hotel_id, { params: params });
  }
}

// 账务订单列表
export async function getAccountOrders(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    const { startRow, pageSize } = params;
    return request.get(
      `/api/account/accounts/${hotel_group_id}/${hotel_id}/${startRow}/${pageSize}`,
      { params: params },
    );
  }
}

// 当前挂账
export async function getOnAccoutOrders(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/order/order/onAccount/${hotel_group_id}/${hotel_id}`, {
      params: params,
    });
  }
}

// 订单详情
export async function getOrderById(id) {
  return request.get('/api/order/order_detail/' + id);
}

// 联房订单
export async function getOrderRooms(orderId) {
  return request.get('/api/order/room/get/join_room/' + orderId);
}

// 订单客户列表
export async function getOrderGuest(orderId) {
  return request.get('/api/order/guest/' + orderId);
}

export async function removeOrderGuest(guest_id) {
  return request.post('/api/order/guest/delete/' + guest_id);
}

// 账务列表
export async function getAccount(params) {
  const { orderId, is_close } = params;
  return request.get('/api/account/account/' + orderId + '/' + is_close);
}

export async function getJoinStatistics(params) {
  const { orderId, is_close } = params;
  return request.get(`/api/account/join/statistics/${orderId}/${is_close}`);
}

export async function getJoinAccouts(params) {
  const { orderId, is_close } = params;
  return request.get(`/api/account/join/account/${orderId}/${is_close}`);
}

// 当前订单统计(消费 付款 退款)
export async function getAccountSummary(params) {
  const { orderId, is_close } = params;
  return request.get('/api/account/summary/' + orderId + '/' + is_close);
}

// 联单所有订单统计(消费 付款 退款)
export async function getJoinAccountSummary(params) {
  const { orderId, is_close } = params;
  return request.get(`/api/account/join/summary/${orderId}/${is_close}`);
}

export async function getReserve(params) {
  return request.get('/api/order/getReserve', {
    params: params,
  });
}

export async function checkIn(params) {
  return request.put('/api/order/checkin', {
    data: params,
  });
}

export async function arrange(params) {
  const { order_info_room_id } = params;
  return request.put('/api/room/arrange/' + order_info_room_id, {
    params: params,
  });
}

export async function cancelArrange(order_info_room_id) {
  return request.put('/api/room/cancelArrange/' + order_info_room_id);
}

export async function changeRoom(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put(
      '/api/order/room/put/changeRoom/' + hotel_group_id + '/' + hotel_id + '/' + id,
      {
        data: params,
      },
    );
  }
}

export async function joinRoom(params) {
  return request.put('/api/order/room/put/orderJoin', {
    data: params,
  });
}

export async function unJoinRoom(params) {
  return request.put('/api/order/room/put/orderUnJoin', {
    data: params,
  });
}

export async function getLogs(orderId) {
  return request.get('/api/table/update/get/logs/' + orderId);
}

export async function getAccountType(params) {
  const { account_type, account_detail_type } = params || {};
  return request.get('/api/code/account', { params: { account_type, account_detail_type } });
}

// 入账
export async function saveAccount(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put('/api/account/saveAccount/' + hotel_group_id + '/' + hotel_id + '/' + id, {
      data: params,
    });
  }
}

// 结账
export async function settleAccount(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put('/api/account/closeAccount/' + hotel_group_id + '/' + hotel_id + '/' + id, {
      data: params,
    });
  }
}

// 挂S账
export async function closeSAccount(data) {
  return request.put('/api/account/closeSAccount', {
    data,
  });
}

// 获取可换房间
export async function getAvailableChangeRoom(orderId) {
  return request.get('/api/order/room/get/availableChangeRooms/' + orderId);
}

// 获取可联房房间
export async function getAvailableJoinRoom(orderId) {
  return request.get('/api/order/room/get/availableJoinRooms/' + orderId);
}

// 转账
export async function transferAccount(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put(
      '/api/account/transferAccount/' + hotel_group_id + '/' + hotel_id + '/' + id,
      { data: params },
    );
  }
}

// 冲账
export async function reverseAccount(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put(
      '/api/account/reserveAccount/' + hotel_group_id + '/' + hotel_id + '/' + id,
      { data: params },
    );
  }
}

export async function reverseGoodsAccount(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put(
      '/api/account/reverseGoodsAccount/' + hotel_group_id + '/' + hotel_id + '/' + id,
      { data: params },
    );
  }
}

// 撤销结账
export async function cancelSettle(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put(
      '/api/account/callbackCloseAccount/' + hotel_group_id + '/' + hotel_id + '/' + id,
      { data: params },
    );
  }
}

// 取消预订
export async function cancel(orderId) {
  return request.put('/api/order/cancel/' + orderId);
}

// 退房
export async function checkOut(orderId) {
  return request.get('/api/order/checkout/' + orderId);
}

// 退房
export async function checkOutJoinOrder(data) {
  return request.put('/api/order/checkoutJoin', {
    data,
  });
}

// 发送门锁密码
export async function sendPw(orderId) {
  return request.get('/api/device/door/password/' + orderId);
}

// 商品列表
export async function getGoods(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/goods/inRooms/' + hotel_id, { params });
  }
}

// 保存小商品账务
export async function saveGoodsAccount(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put(
      '/api/account/saveGoodsAccount/' + hotel_group_id + '/' + hotel_id + '/' + id,
      { data: params },
    );
  }
}

export async function getGoodsDetailAccount(accountId) {
  return request.get('/api/account/accountGoodsDetail/' + accountId);
}

// 钟点转全日 全日转钟点
export async function changeOrderType(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { order_info_id, code_room_rate } = params;
    const { id } = currentUser;
    return request.put('/api/order/type/' + order_info_id + '/' + code_room_rate + '/' + id);
  }
}

// 当前订单账务余额统计
export async function getOrderAccountSum(order_info_id) {
  return request.get('/api/order/account/' + order_info_id);
}

export async function settleOrderAccount(data) {
  const { order_info_id, account } = data;
  return request.put('/api/account/order/' + order_info_id, { data: account });
}

// 联单所有订单账务余额统计
export async function getJoinOrderAccountSum(order_info_id) {
  return request.get('/api/order/join/' + order_info_id);
}

export async function settleJoinOrderAccount(data) {
  const { order_info_id, account } = data;
  return request.put('/api/account/join/' + order_info_id, { data: account });
}

export async function getPayMoneyStatistics() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/order/template/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getLatestOrderByRoom(room_no) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/order/room/get/latestOrder/${hotel_group_id}/${hotel_id}/${room_no}`);
  }
}

export async function getLatestOrderByKeyWord(key_word) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(
      `/api/order/room/get/latestOrderByKeyword/${hotel_group_id}/${hotel_id}/${key_word}`,
    );
  }
}

export async function getUnUploadGuest(room_no) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/order/guest/UnUpload/${hotel_group_id}/${hotel_id}`);
  }
}

export async function retryUpload(guest_ids) {
  return request.post(`/api/order/guest/retryUpload`, { data: guest_ids });
}

export async function retryAllUpload() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.post(`/api/order/guest/retryAllUpload/${hotel_group_id}/${hotel_id}`);
  }
}

export async function clearOverdueUpload(day) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put(
      `/api/order/guest/put/dealOverdue/${hotel_group_id}/${hotel_id}/${day}/${id}/`,
    );
  }
}

export async function wechatAliPay(data) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.post(`/ext_inter/pay/unifiedOrder/${hotel_group_id}/${hotel_id}`, { data });
  }
}

export async function getOrderday(params) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/order/orderday/${hotel_group_id}/${hotel_id}`, {
      params,
    });
  }
}

// 制卡
export async function putCardstroy(params) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    console.log({
      ...params,
      hotel_group_id,
      hotel_id,
    });
    return request.put(`/api/order/room/put/writeCard`, {
      data: {
        ...params,
        hotel_group_id,
        hotel_id,
      },
    });
  }
}

// 获取订单可用优惠卷
export async function getOrderCoupons(order_info_id) {
  return request.get(`/api/coupons/order/${order_info_id}`);
}

export async function setMainOrderRoom(order_info_id) {
  return request.put(`/api/order/room/put/join_room/${order_info_id}`);
}
