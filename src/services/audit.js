import request from '@/utils/request';

export async function getAuditDate() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id } = currentUser;
        return request.get('/api/audit/date/' + hotel_group_id + '/' + hotel_id);
    }
}
export async function getAuditTypes(audit_record_id) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id } = currentUser;
        return request.get(
            '/api/audit/check/' + hotel_group_id + '/' + hotel_id + '/' + audit_record_id,
        );
    }
}

export async function getAuditTableData(param) {
    const { url, id } = param;
    if (!url) return;
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id } = currentUser;
        return request.get(url + '/' + hotel_group_id + '/' + hotel_id + '/' + id);
    }
}
export async function auditCheck() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id, id: userid } = currentUser;
        return request.put('/api/audit/check', { data: { hotel_group_id, hotel_id, userid } });
    }
}

export async function auditStart() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id, id: userid } = currentUser;
        return request.put('/api/audit/start', { data: { hotel_group_id, hotel_id, userid } });
    }
}