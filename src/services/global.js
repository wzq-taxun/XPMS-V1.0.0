import request from '@/utils/request';

/**
 * 查询动态字典信息
 * @param {*} params
 */
export async function getDynamicDict(params) {
  return request.post('/api/common/getDynamicDicts', {
    params,
  });
}

/**
 * 查询静态字典
 * @param {*} params
 */
export async function getDict(params) {
  return request.get('/api/common/getDicts/' + params.dicttype);
}

export async function getSenseTimeDevice(ip) {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser && ip) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get(
      '/api/senseTime/device/config/' + hotel_group_id + '/' + hotel_id + '/' + ip,
    );
  }
}

export async function getWechatAds() {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    const { hotel_group_id, hotel_id } = currentUser;
    return request.get('/api/wechat/bannerAds/' + hotel_group_id);
  }
}

export async function addWechatAds(data) {
  return request.post('/api/wechat/bannerAd', {
    data: data,
  });
}

export async function updateWechatAds(data) {
  return request.put('/api/wechat/bannerAd', {
    data: data,
  });
}
