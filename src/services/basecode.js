import request from '@/utils/request';

export async function getbasesall(params) {
    console.log(params)
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id } = currentUser;
        return request.get('/api/hotel/config/' + hotel_group_id + '/' + hotel_id, { params });
    }
}

export async function uptadebasesall(data) {
    return request.put('/api/hotel/config', { data });
}

// export async function checkMemberCard(params) {
//   return request.get('/api/people/cardCheck', { params });
// }