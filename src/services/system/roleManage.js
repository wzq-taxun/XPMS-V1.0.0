import request from '@/utils/request';

/**
 * 获取所有角色
 * @param {*} params
 */
export async function getRoles(params) {
  return request.get('/api/system/role/queryRoles', {
    params: params,
  });
}

/**
 * 保存角色：包括修改和新增
 * @param {*} params
 */
export async function saveRole(params) {
  return request.post('/api/system/role/saveRole', {
    params: params,
  });
}

/**
 * 删除角色
 * @param {*} params
 */
export async function deleteRole(params) {
  return request.post('/api/system/role/deleteRole', {
    params: params,
  });
}

export async function getRoleRights(roleId) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/sys/roleRights/' + hotel_group_id + '/' + hotel_id + '/' + roleId);
  }
}

export async function updateRoleRights(params) {
  return request.post('/api/sys/roleRights', { params });
}
