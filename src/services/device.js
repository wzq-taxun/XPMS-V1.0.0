import request from '@/utils/request';

// 获取房间小度配置
export async function getRoomDueros(room_id) {
  return request.get(`/api/dueros/device_config/room/${room_id}`);
}

// 添加房间小度配置
export async function addRoomDueros(data) {
  return request.post(`/api/dueros/device_config`, { data });
}

// 修改房间小度配置
export async function updateRoomDueros(data) {
  return request.put(`/api/dueros/device_config`, { data });
}
