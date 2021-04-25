import request from '@/utils/request';
export async function queryNotices() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    return request('/api/notReadMessages/' + currentUser.id);
  }
}

export async function readNotice(id) {
  return request('/api/readMessage/' + id);
}
