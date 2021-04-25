import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryWechatUsers(nick_name) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id } = currentUser;
    return request(`/api/people/wechatUser/${hotel_group_id}/${nick_name}`);
  }
}
