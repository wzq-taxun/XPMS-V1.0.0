import request from '@/utils/request';

export async function getUsers(params) {
  // return request.post('/api/system/user/queryUsers', {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/sys/users/' + hotel_group_id + '/' + hotel_id, {
      params: params,
    });
  }
}

export async function getAllRoles(params) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/sys/roles/' + hotel_group_id + '/' + hotel_id, {
      params: params,
    });
  }
}

export async function getUserRoles(userId) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/sys/roles/' + hotel_group_id + '/' + hotel_id + '/' + userId);
  }
}

export async function updateUserRoles(params) {
  return request.post('/api/sys/userRoles', { params });
}

export async function updateUser(params) {
  return request.post('/api/system/user/saveUser', {
    params: params,
  });
}

export async function deleteUser(params) {
  return request.post('/api/system/user/deleteUser', {
    params: params,
  });
}

export async function addUser(params) {
  // return request.post('/api/system/user/saveUser', {
  return request.post('/api/sys/user', {
    params: params,
  });
}

export async function setPassword(params) {
  return request.post('/api/system/user/setPassword', {
    params: params,
  });
}
