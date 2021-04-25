import request from '@/utils/request';

export async function getHotelConfig() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/branch/hotelConfig/' + hotel_group_id + '/' + hotel_id);
  }
}

// 获取离店时间配置
export async function getCheckOutTimeConfig() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/branch/checkOut/' + hotel_group_id + '/' + hotel_id);
  }
}

// 获取订单类型 全日 钟点 长包 长租
export async function getOrderType() {
  return request.get('/api/common/getDicts?dicttype=ORDERTYPE');
}

// 获取顾客类型
export async function getGuestType() {
  return request.get('/api/common/getDicts?dicttype=GUESTTYPE');
}

// 获取协议公司
export async function getCompanyInfo(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/branch/treaty/' + hotel_group_id + '/' + hotel_id + '/' + 38);
  }
}

// 获取中介旅行社
export async function getMedium(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/branch/medium/' + hotel_group_id + '/' + hotel_id + '/' + 39);
  }
}

// 获取市场(散客)
export async function getMarket(params) {
  const { guest_type_id = 0 } = params || {};
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('api/code/market/' + hotel_group_id + '/' + hotel_id + '/' + guest_type_id);
  }
}

// 获取市场(会员)
export async function getMemberMarket(card_no) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('api/code/market/' + hotel_group_id + '/' + hotel_id, {
      params: { card_no },
    });
  }
}

// 获取市场(协议单位 中/旅)
export async function getCompanyMarket(company_info_id) {
  return request.get('api/code/market/' + company_info_id);
}

// 获取来源
export async function getSource(code_market_id) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    code_market_id = code_market_id || 0;
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(
      '/api/code/source/' + hotel_group_id + '/' + hotel_id + '/' + code_market_id,
    );
  }
}

// 获取渠道
export async function getCanal(code_soure_id) {
  // return request.post('/api/check/canal', {
  //   params,
  // });
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    code_soure_id = code_soure_id || 0;
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/code/canal/' + hotel_group_id + '/' + hotel_id + '/' + code_soure_id);
  }
}

// 房型
export async function getRoomType(params) {
  // return request.post('/api/check/roomType', {
  //   params: params,
  // });
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/room/type/' + hotel_group_id + '/' + hotel_id);
  }
}

// 房号
export async function getRoomNo(params) {
  const { room_type_id, checkin_time, checkout_time, room_type_same } = params;

  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/room/roomNo/' + hotel_group_id + '/' + hotel_id + '/' + room_type_id, {
      params: { checkin_time, checkout_time, room_type_same },
    });
  }
}

// 获取当前空净房价
export async function getVCRoomNo(room_type_id) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/room/roomNo/now/${hotel_group_id}/${hotel_id}/${room_type_id}`);
  }
}

// 获取当前空净空脏房价
export async function getVacantRoomNo(room_type_id) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/room/roomNo/vacant/now/${hotel_group_id}/${hotel_id}/${room_type_id}`);
  }
}

// 房价码
export async function getRoomRateCode(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    const { market_id = 0, order_type_id = 0, guest_type_id = 0 } = params;

    return request.get(
      'api/code/roomRate/' +
        hotel_group_id +
        '/' +
        hotel_id +
        '/' +
        market_id +
        '/' +
        order_type_id +
        '/' +
        guest_type_id,
    );
  }
}

// 房价
export async function getRoomRate(params) {
  const { room_type_id, code_room_rate_id, date_start_end, date_end_sta } = params;

  return request.get('/api/room/rate/' + room_type_id + '/' + code_room_rate_id, {
    params: {
      date_start_end,
      date_end_sta,
    },
  });
}

// 销售员
export async function getSalesMan() {
  // return request.post('/api/check/salesMan');
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/people/sales_man/' + hotel_group_id + '/' + hotel_id);
  }
}

// 活动码
export async function getActivity() {
  return request.post('/api/check/codeActivity');
}

export async function getPreferReason() {
  // return request.post('/api/check/canal', {
  //   params,
  // });
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/code/preferReason/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getPackages() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/code/packages/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function checkInSubmit(params) {
  return request.put('/api/order/infoCi', {
    data: params,
  });
}

export async function reserveSubmit(params) {
  return request.put('/api/order/info', {
    data: params,
  });
}

export async function scanCard(params) {
  return request.get('/jinglun/ReadMsg');
}

export async function uploadBaseImg(params) {
  return request.post('/api/common/uploadFileBase64', {
    data: params,
  });
}

export async function upGuestBase(data) {
  return request.post('/api/people/guest', {
    data: data,
  });
}

export async function getFreeRoomCount(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    const { room_type_id, checkin_time, checkout_time } = params;
    return request.get(
      '/api/room/freeRoomNoNum/' + hotel_group_id + '/' + hotel_id + '/' + room_type_id,
      {
        params: {
          checkin_time,
          checkout_time,
        },
      },
    );
  }
}
