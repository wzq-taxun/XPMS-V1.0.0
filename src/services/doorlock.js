import request from '@/utils/request';

export async function getdoorlockalllist() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/device/door/lock/config/${hotel_group_id}/${hotel_id}`);
  }
}
// 提交修改门所配置
export async function putupdatedoorlock(data) {
  return request.put(`/api/device/door/lock`, {
    data: data,
  });
}

// 获取门锁类型接口
export async function getdoorlocktypeobj() {
  return request.get(`/api/device/door/lock/type`);
}

// 获取涂鸦门锁详情
export async function getTuyaLockDetailByRoom(lock_id) {
  return request.get(`/api/device/door/lock/detail/TUYA/${lock_id}`);
}

// 获取火河门锁详情
export async function getHuoheLockDetailByRoom(lock_id) {
  return request.get(`/api/device/door/lock/detail/HUOHE/${lock_id}`);
}

// 添加涂鸦门锁
export async function addTuyaLock(data) {
  return request.post(`/api/device/door/lock/TUYA`, { data });
}

// 修改涂鸦门锁
export async function updateTuyaLock(data) {
  return request.put(`/api/device/door/lock/TUYA`, { data });
}

// 添加火河门锁
export async function addHuoheLock(data) {
  return request.post(`/api/device/door/lock/HUOHE/`, { data });
}

// 修改火河门锁
export async function updateHuoheLock(data) {
  return request.put(`/api/device/door/lock/HUOHE`, { data });
}

// 同步门锁
export async function synchronizationLock() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/device/door/lock/synchronization/${hotel_group_id}/${hotel_id}`);
  }
}
