import request from '@/utils/request';
// 获取接口
export async function getequipmentconfiglist() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id } = currentUser;
        return request.get(`/api/senseTime/device/configs/${hotel_group_id}/${hotel_id}`)
        // console.log(request.get(`/api/senseTime/device/configs/${hotel_group_id}/${hotel_id}`))
    }
}
// 新建提交
export async function addequipmentconfiglist(data) {
    console.log(data)
    return request.post(`/api/senseTime/device/configs/`, {
        data,
    })
}
// 修改确认接口
export async function updateequipmentconfig(data) {
    console.log(data)
    return request.put(`/api/senseTime/device/configs`, {
        data,
    })
}

// 删除接口
export async function deleteequipment(data) {
    console.log(data)
    return request.put(`/api/senseTime/device/configs`, {
        data,
    })
}