import request from '@/utils/request';

export async function queryReports(params) {
    console.log(params)
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id } = currentUser;
        return request.get('/api/report/reports/' + hotel_group_id + '/' + hotel_id, { params });
    }
}

export async function getDictList(dicttype) {
    return request.get('/api/common/getDicts?dicttype=' + dicttype);
}

export async function getDynamicDicts(params) {
    return request.post('/api/common/getDynamicDicts', {
        params,
    });
}

export async function queryReportTypes(params) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const { hotel_group_id, hotel_id } = currentUser;
        return request.get('/api/report/reportTypes/' + hotel_group_id + '/' + hotel_id);
    }
}

export async function queryReportDetail(report_id) {
  return request.get(`/api/report/report/${report_id}`);
}

export async function saveReport(data) {
  return request.put(`/api/report/report`, { data });
}

export async function queryRule(params) {
    const rsp = await request('/api/report/list', {
        params,
    });

    const dataSource = rsp.data;
    const result = {
        data: dataSource,
        total: dataSource.length,
        success: true,
        pageSize: params.pageSize,
        current: parseInt(`${params.currentPage}`, 10) || 1,
    };
    return result;
}
export async function removeRule(params) {
    return request('/api/rule', {
        method: 'POST',
        data: {
            ...params,
            method: 'delete',
        },
    });
}
export async function addRule(params) {
    return request('/api/rule', {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}
export async function updateRule(params) {
    return request('/api/rule', {
        method: 'POST',
        data: {
            ...params,
            method: 'update',
        },
    });
}