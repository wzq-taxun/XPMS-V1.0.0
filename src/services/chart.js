import request from '@/utils/request';

export async function getOverviewRoomStatus() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/overview/roomstatus/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getOverviewOrderMarket() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/overview/ordermarket/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function getOvervieRoomStatis() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/room/template/' + hotel_group_id + '/' + hotel_id);
  }
}
