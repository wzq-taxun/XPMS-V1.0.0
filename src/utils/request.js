/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
// import qs from 'qs';
import Constants from '@/constans';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  // },
});

// request拦截器
request.interceptors.request.use(async (url, options) => {
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  let token = sessionStorage.getItem('token');
  if (currentUser) {
    let params = options.params;

    // if (options.data && typeof options.data == 'object') {
    //   options.data = qs.stringify(options.data);
    // }

    params = {
      token: token,
      hotel_id: currentUser.hotel_id,
      hotelId: currentUser.hotel_id,
      hotel_group_id: currentUser.hotel_group_id,
      hotelGroupId: currentUser.hotel_group_id,
      user_id: currentUser.id,
      // modify_user: currentUser.id,
      ...params,
    };

    if ('get' != options.method) {
      params = {
        modify_user: currentUser.id,
        ...params,
      };
    }

    return {
      url: url,
      options: {
        ...options,
        params,
        // params: {
        //   token: token,
        //   hotel_id: currentUser.hotel_id,
        //   hotelId: currentUser.hotel_id,
        //   hotel_group_id: currentUser.hotel_group_id,
        //   hotelGroupId: currentUser.hotel_group_id,
        //   modify_user: currentUser.id,
        //   ...params,
        // },
      },
    };
  }
});

// response拦截器
request.interceptors.response.use(async response => {
  const data = await response.clone().json();
  if (data.code == Constants.UN_LOGIN || data.code == Constants.MORE_THEN_ONE_LOGIN) {
    // 未登录或多点登录
    message.warn(data.message);
    sessionStorage.removeItem('currentUser');
    window.location.href = '/';
  } else if (data.code !== Constants.SUCCESS) {
    if (data.message) {
      message.error(data.message);
    }
    return response;
  } else {
    return response;
  }
});

export default request;
