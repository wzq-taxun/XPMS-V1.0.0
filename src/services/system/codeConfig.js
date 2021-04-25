import request from '@/utils/request';

// 添加优惠理由
export async function addPreferReason(data) {
  return request.post('/api/code/preferReason', {
    data: data,
  });
}

// 修改优惠理由
export async function updatePreferReason(data) {
  return request.put('/api/code/preferReason', {
    data: data,
  });
}

// 查询房号
export async function queryRoomNo(params) {
  return request.post('/sys/code/getRoomNo', {
    params: params,
  });
}

// 添加市场
export async function saveMarket(data) {
  return request.post('/api/code/market', {
    data: data,
  });
}

// 修改市场
export async function updateMarket(data) {
  return request.put('/api/code/market', {
    data: data,
  });
}

// 添加来源
export async function saveSource(data) {
  return request.post('/api/code/source', {
    data: data,
  });
}

// 修改来源
export async function updateSource(data) {
  return request.put('/api/code/source', {
    data: data,
  });
}

// 添加渠道
export async function saveCanal(data) {
  return request.post('/api/code/canal', {
    data: data,
  });
}

// 修改渠道
export async function updateCanal(data) {
  return request.put('/api/code/canal', {
    data: data,
  });
}

// 查询房价码
export async function queryRoomRate(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/code/roomRate/' + hotel_group_id + '/' + hotel_id);
  }
}

// 添加包价
export async function savePackages(data) {
  return request.post('/api/code/packages', {
    data: data,
  });
}

// 修改包价
export async function updatePackages(data) {
  return request.put('/api/code/packages', {
    data: data,
  });
}

// 添加房价码
export async function saveRoomRate(data) {
  return request.post('/api/code/rate', {
    data: data,
  });
}

// 修改房价码
export async function updateRoomRate(data) {
  return request.put('/api/code/rate', {
    data: data,
  });
}

// 添加账项代码
export async function saveCodeAccount(data) {
  return request.post('/api/code/account', {
    data: data,
  });
}

// 修改账项代码
export async function updateCodeAccount(data) {
  return request.put('/api/code/account', {
    data: data,
  });
}

// 添加会员等级
export async function saveMemberLevel(data) {
  return request.post('/api/code/memberlevel', {
    data: data,
  });
}

// 修改会员等级
export async function updateMemberLevel(data) {
  return request.put('/api/code/memberlevel', {
    data: data,
  });
}

// 添加销售员
export async function saveSalesMan(data) {
  return request.post('/api/people/sales_man', {
    data: data,
  });
}

// 修改销售员
export async function updateSalesMan(data) {
  return request.put('/api/people/sales_man', {
    data: data,
  });
}
