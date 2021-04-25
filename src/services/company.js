import request from '@/utils/request';

export async function addCompany(data) {
  return request.post('/api/branch/treaty', {
    data,
  });
}

export async function updateCompany(data) {
  return request.put('/api/branch/treaty', {
    data,
  });
}
