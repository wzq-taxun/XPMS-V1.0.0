import request from '@/utils/request';

export async function getGoodsType() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/goods/type/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function saveGoods(data) {
  return request.post('/api/goods/num', { data: data });
}

export async function updateGoods(data) {
  return request.put('/api/goods/num', { data: data });
}

export async function getGoodsRecord() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/goods/sale/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getStorage() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/goods/stock/' + hotel_group_id + '/' + hotel_id);
  }
}
