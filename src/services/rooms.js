import request from '@/utils/request';

export async function getRoomStatusColor() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/room/getRoomsStatusColor/' + hotel_id);
  }
}

export async function getFloors() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/room/getFloors/' + hotel_id);
  }
}

export async function getRooms(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    // {
    //   "hotel_id": 1,
    //   "order_status": "1",
    //   "room_floor_id": 1,
    //   "room_status": "1",
    //   "room_type_id": 1,
    //   "source_id": 1
    // }
    // const data = { ...param, hotel_id };
    // return request.put('/api/room/getRooms', {
    //   data: data,
    // });

    return request.get('/api/room/rooms/' + hotel_group_id + '/' + hotel_id, { params });
  }
}

export async function getRoomStatusCount() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/room/typeNum/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getRoomsStatistics() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/room/roomsStatistics/${hotel_group_id}/${hotel_id}`);
  }
}

export async function updateRoomStatus(param) {
  return request.put('/api/room/status', { data: param });
}

export async function getRoomsByStatus(status) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(`/api/room/rooms/${hotel_group_id}/${hotel_id}/${status}`);
  }
}

export async function getRepairReason(param) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/code/maintain/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function repairRoom(data) {
  return request.put('/api/room/maintain', { data: data });
}

export async function getLockReason(param) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/code/lock/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function lockRoom(data) {
  return request.put('/api/room/lock', { data: data });
}

export async function getMaintain() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/code/maintain/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function addMaintain(data) {
  return request.post('/api/code/maintain', { data: data });
}

export async function updateMaintain(data) {
  return request.put('/api/code/maintain', { data: data });
}

export async function getLock() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/code/lock/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function addLock(data) {
  return request.post('/api/code/lock', { data: data });
}

export async function updateLock(data) {
  return request.put('/api/code/lock', { data: data });
}

export async function getRoomSituation(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/room/usability/' + hotel_group_id + '/' + hotel_id, { params });
  }
}

export async function getRoomMaintainDetail(room_no_id) {
  return request.get(`/api/room/maintain/${room_no_id}`);
}

export async function getRoomLockDetail(room_no_id) {
  return request.get(`/api/room/lock/${room_no_id}`);
}
