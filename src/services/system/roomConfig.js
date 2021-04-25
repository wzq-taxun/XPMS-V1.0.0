import request from '@/utils/request';
export async function addFloor(data) {
  return request.post('/api/room/flool', {
    data: data,
  });
}

export async function updateFloor(data) {
  return request.put('/api/room/flool', {
    data: data,
  });
}

export async function queryRoomNos() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/room/roomNo/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getBedType() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/room/bed/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function addRoom(data) {
  return request.post('/api/room/no', {
    data: data,
  });
}

export async function updateRoom(data) {
  return request.put('/api/room/no', {
    data: data,
  });
}

export async function addRoomType(data) {
  return request.post('/api/room/type', {
    data: data,
  });
}

export async function updateRoomType(data) {
  return request.put('/api/room/type', {
    data: data,
  });
}

export async function queryRoomPrice(param) {
  const { room_type_id = 0, code_room_rate_id = 0, startRow = 0, pageSize = 10 } = param || {};
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(
      'api/room/roomRate/' +
        hotel_group_id +
        '/' +
        hotel_id +
        '/' +
        room_type_id +
        '/' +
        code_room_rate_id,
      {
        params: {
          startRow,
          pageSize,
        },
      },
    );
  }
}

export async function addRoomPrice(data) {
  return request.post('/api/room/roomRate', {
    data: data,
  });
}

export async function updateRoomPrice(data) {
  return request.put('/api/room/roomRate', {
    data: data,
  });
}

export async function getRoomTypeImages(room_type_id) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(
      '/api/room/roomTypeImage/' + hotel_group_id + '/' + hotel_id + '/' + room_type_id,
    );
  }
}

export async function updateRoomTypeImages(data) {
  return request.put('/api/room/roomTypeImage', {
    data,
  });
}
