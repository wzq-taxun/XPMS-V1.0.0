import request from '@/utils/request';

// 获取优惠券赠送配置列表
export async function getcouponsSendConfig(params) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get(`/api/wechat/couponsSendConfig/${hotel_group_id}`, { params });
        // console.log(request.get(`/api/wechat/couponsSendConfig/${hotel_group_id}`, { params }))
    }
}

// 获取可配置优惠卷列表
export async function getcanmembercoupons(params) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get(`/api/member/coupons/${hotel_group_id}`, { params })
    }
}

// 添加优惠卷赠送配置
export async function youhuiquanup(data) {
    return request.post(`/api/wechat/couponsSendConfig`, { data })
}

// 修改优惠卷赠送配置
export async function updatenewfavar(data) {
    return request.put(`/api/wechat/couponsSendConfig`, { data })
}


// 删除优惠卷赠送配置
export async function deletelistmostfa(data) {
    // console.log(data)
    return request.put(`/api/wechat/couponsSendConfig`, { data })
}