import request from '@/utils/request';

export async function getToDealList(type) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/toDeal/list/' + hotel_group_id + '/' + hotel_id + '/' + type);
  }
}

export async function deal(type, own_id) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { id: user_id } = currentUser;
    return request.put('/api/toDeal/deal/' + type + '/' + own_id + '/' + user_id);
  }
}
