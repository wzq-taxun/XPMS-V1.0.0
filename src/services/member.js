import request from '@/utils/request';

export async function getMembers(params) {

    return request.get('/api/people/member', { params });
}

export async function getMemberCard(params) {
    return request.get('/api/people/card', { params });
}

export async function checkMemberCard(params) {
    return request.get('/api/people/cardCheck', { params });
}

export async function getMemberLevel() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get('/api/code/memberlevel/' + hotel_group_id);
    }
}

export async function addMember(data) {
    return request.post('/api/people/member', { data });
}

export async function updateMember(data) {
    return request.put('/api/people/member', { data });
}

export async function getMemberUpConfigs(params) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get('/api/member/upConfigs/' + hotel_group_id);
    }
}

export async function addMemberUpConfigs(data) {
    return request.post('/api/member/upConfigs', { data });
}

export async function updateMemberUpConfigs(data) {
    return request.put('/api/member/upConfigs', { data });
}

export async function getMemberUpRights(up_config_id) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get('/api/member/upRights/' + hotel_group_id + '/' + up_config_id);
    }
}

export async function addMemberUpRights(data) {
    return request.post('/api/member/upRights', { data });
}

export async function updateMemberUpRights(data) {
    return request.put('/api/member/upRights', { data });
}

export async function getMemberUpRightCoupons(up_rights_id) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get('/api/member/upRightCoupons/' + hotel_group_id + '/' + up_rights_id);
    }
}

export async function addMemberUpRightCoupons(data) {
    return request.post('/api/member/upRightCoupons', { data });
}

export async function updateMemberUpRightCoupons(data) {
    return request.put('/api/member/upRightCoupons', { data });
}

export async function getCoupons() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get('/api/member/coupons/' + hotel_group_id);
    }
}

export async function getMemberRechargeRights() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get('/api/member/recharge_rights/' + hotel_group_id);
    }
}

export async function addMemberRechargeRights(data) {
    return request.post('/api/member/recharge_rights', { data });
}

export async function updateMemberRechargeRights(data) {
    return request.put('/api/member/recharge_rights', { data });
}

export async function getMemberRechargeRightCoupons(recharge_rights_id) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id } = currentUser;
        return request.get(
            '/api/member/recharge_rights_coupons/' + hotel_group_id + '/' + recharge_rights_id,
        );
    }
}

export async function addMemberRechargeRightCoupons(data) {
    return request.post('/api/member/recharge_rights_coupons', { data });
}

export async function updateMemberRechargeRightCoupons(data) {
    return request.put('/api/member/recharge_rights_coupons', { data });
}

export async function getMemberAvailableCoupons(memeber_info_id) {
    return request.get(`/api/member/availableCoupons/${memeber_info_id}`);
}

export async function getMemberCouponsStatistics(memeber_info_id) {
  return request.get(`/api/member/couponsStatistics/${memeber_info_id}`);
}

export async function addMemberAvailableCoupons(data) {
    return request.post(`/api/coupons/coupon`, { data });
}