import request from '@/utils/request';

export async function getMenuData(userid) {
  return request.get('/api/getMenuByLoginId?userid='+ userid);
}

