import request from '@/utils/request';

export async function getPrizeRecord(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id } = currentUser;
    return request.get(`/api/luckDraw/prizeRecord/${hotel_group_id}`, { params });
  }
}

export async function usePrize(id) {
  return request.put(`/api/luckDraw/usePrize/${id}`);
}
