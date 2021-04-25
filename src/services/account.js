import request from '@/utils/request';

// 预收款账项代码
export async function getPrePayAccountType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/checkIn/' + hotel_id);
  }
}

// 消费入账账项代码
export async function getConsumeAccountType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/receptionConsume/' + hotel_id);
  }
}

// 付款账项代码
export async function getPayAccountType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/receptionPay/' + hotel_id);
  }
}

// 结账账项代码
export async function getSettleAccountType(type) {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/closeAccount/' + hotel_id + '/' + type);
  }
}

// 挂账账项代码
export async function getOnAccountType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/receptionCredit/' + hotel_id);
  }
}

// 挂S账账项代码
export async function getOnSAccountType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/receptionCreditS/' + hotel_id);
  }
}

// 小商品账项代码
export async function getGoodsAccountType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/goods/' + hotel_id);
  }
}

// 综合结账账项代码
export async function getSynthesizeAccountType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/synthesize/' + hotel_id);
  }
}

// 协议单位/中旅预收账项代码
export async function getReceiveAccountType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/receivable/' + hotel_id);
  }
}

export async function getCompanyCloseType() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/code/account/companyClose/' + hotel_id);
  }
}

// 协议单位/中旅预收
export async function saveTreatyAccount(data) {
  const { account, type } = data || {};
  return request.put('/api/account/treaty', { data: account, params: { i: type } });
}

export async function saveMemberAccount(data) {
  const { account, type } = data || {};
  return request.post('/api/account/member', { data: account, params: { i: type } });
}
export async function getMemberAccount(member_info_id) {
  return request.get('/api/account/member/' + member_info_id);
}

// 综合结账记录列表
export async function getSynthesize() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/account/synthesize/' + hotel_group_id + '/' + hotel_id);
  }
}

// 综合结账
export async function saveGoodsCloseAccount(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.put(
      '/api/account/saveGoodsCloseAccount/' + hotel_group_id + '/' + hotel_id + '/' + id,
      { data: params },
    );
  }
}

// 获取可挂账单位/中旅
export async function getOnCompany() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/branch/company/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getAllCompany() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/branch/company/all/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getCompanyBalanceRecord(params) {
  const { company_id, startRow = 0, pageSize = 10 } = params || {};
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(
      '/api/branch/companyRecord/' + hotel_group_id + '/' + hotel_id + '/' + company_id,
      { params: { startRow, pageSize } },
    );
  }
}

export async function getArAccount(companyId, status) {
  return request.get('/api/account/company/' + companyId, { params: { status } });
}

export async function saveArCloseAccount(data) {
  return request.put('/api/account/company', { data });
}

export async function getJoinAccount(order_Id) {
  return request.get('/api/account/jointAccount/' + order_Id);
}

export async function getCloseSingleAccount(order_Id) {
  return request.get('/api/account/closeSingleAccount/' + order_Id);
}

export async function getCloseJoinAccount(order_Id) {
  return request.get('/api/account/closeJoinAccount/' + order_Id);
}

export async function closeAccountWithExtra(data) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id, shift } = currentUser;
    return request.put('/api/account/closing/' + hotel_group_id + '/' + hotel_id, {
      params: { user_id: id, work_shift: shift },
      data,
    });
  }
}

export async function closeSingleWithExtra(additional_id, data) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id, shift } = currentUser;
    return request.put(`/api/account/closeSingle/${hotel_group_id}/${hotel_id}`, {
      params: { additional_id },
      data,
    });
  }
}

export async function closeJoinWithExtra(data) {
  return request.put(`/api/account/closeJoin`, {
    data,
  });
}

export async function closeJoinTransferWithExtra(data) {
  return request.put(`/api/account/closeJoinTransfer`, {
    data,
  });
}

// 账项代码小类
export async function getAccountDetailType() {
  return request.get('/api/code/account/accountDetailType');
}

// 获取账务锁定状态
export async function getAccountLockState(order_info_id) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.get(`/api/account/unlock/${hotel_group_id}/${hotel_id}/${order_info_id}/${id}`);
  }
}

// 订单账务解锁
export async function unlockOrderAccount(data) {
  return request.post(`/api/account/unlock`, { data });
}
