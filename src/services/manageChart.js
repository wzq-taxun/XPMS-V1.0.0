import request from '@/utils/request';

export async function getManageChart() {
  return request('/api/getManageChart');
}

export async function getGuestFeature() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get('/api/manager/chart/guestfeature/' + hotel_id);
  }
}

export async function getOrderMarket(params) {
  const { start_date, end_date } = params;
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get(
      '/api/manager/chart/ordermarket/' + hotel_id + '/' + start_date + '/' + end_date,
    );
  }
}

export async function getSaleMarket(params) {
  const { start_date, end_date } = params;
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get(
      '/api/manager/chart/salemarket/' + hotel_id + '/' + start_date + '/' + end_date,
    );
  }
}

export async function getSaleRoomType(params) {
  const { start_date, end_date } = params;
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_id } = currentUser;
    return request.get(
      '/api/manager/chart/saleroomtype/' + hotel_id + '/' + start_date + '/' + end_date,
    );
  }
}
