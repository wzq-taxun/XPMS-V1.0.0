import request from '@/utils/request';
export async function getHotels() {
  return request.get('/api/hotel/hotels');
}

export async function getHotelByCode(code) {
  return request.get('/api/hotel/hotel/code/' + code);
}

export async function getHotelGroups() {
  return request.get('/api/hotel/hotelGroups');
}

export async function getAreaCode(pid) {
  return request.get('/api/hotel/division/' + pid);
}

export async function getOtaCitiesByName(name) {
  return request.get('/api/hotel/otaCities/name/' + name);
}

export async function getOtaCitiesById(id) {
  return request.get('/api/hotel/otaCities/id/' + id);
}

export async function getLocation(address) {
  return request.get('/api/hotel/location/' + address);
}

export async function addHotel(data) {
  return request.post('/api/hotel/hotel', { data });
}

export async function updateHotel(data) {
  return request.put('/api/hotel/hotel', { data });
}

export async function getHotelImages() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/hotel/hotelImages/' + hotel_group_id + '/' + hotel_id);
  }
}

export async function updateHotelImags(data) {
  return request.put('/api/hotel/hotelImages', { data });
}

export async function getMessage(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id, id } = currentUser;
    return request.get('/api/message/' + hotel_group_id + '/' + hotel_id, {
      params: { ...params, receive_man: id },
    });
  }
}
