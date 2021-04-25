import request from '@/utils/request';
import Constans from '@/constans';

export async function getMenus(params) {
  return request.post('/api/system/getMenus', {
    params: params,
  });
}

export async function queryMenus(params) {
  const rsp = await request('/api/system/getMenus', {
    params,
  });

  let dataSource = [];
  if (rsp && rsp.code == Constans.SUCCESS) {
    dataSource = rsp.data.roles;
  }
  const result = {
    data: dataSource,
    total: dataSource.length,
    success: true,
    // pageSize: params.pageSize,
    // current: parseInt(`${params.currentPage}`, 10) || 1,
  };
  return result;
}

export async function getMenuById(params) {
  return request.post('/api/system/getMenuById', {
    params: params,
  });
}

export async function addMenu(params) {
  const rsp = await request.post('/api/system/addMenu', {
    params: params,
  });

  if (rsp && rsp.code === Constans.SUCCESS) {
    return true;
  } else {
    return false;
  }
}

export async function updateMenu(params) {
  const rsp = await request.post('/api/system/addOrUpdateMenu', {
    params: params,
  });

  if (rsp && rsp.code === Constans.SUCCESS) {
    return true;
  } else {
    return false;
  }
}

export async function deleteMenu(params) {
  const rsp = await request.post('/api/system/deleteMenu', {
    params: params,
  });
  if (rsp && rsp.code === Constans.SUCCESS) {
    return true;
  } else {
    return false;
  }
}

export async function deleteMenus(params) {
  return request.post('/api/system/deleteMenus', {
    params: params,
  });
}
