import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request.get('/api/login', {
    params: params
  });
}
export async function fakeCurrentUser(params) {
  return request.get('/api/getCurrentUser', {
    params: params
  });
}

export async function fakeShift() {
  return request.get('/api/sys/shift', {
  });
}
