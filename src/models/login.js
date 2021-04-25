import { stringify } from 'querystring';
import router from 'umi/router';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { Modal, message } from 'antd';
import Constans from '@/constans';
const { confirm } = Modal;

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    currentUser: JSON.parse(sessionStorage.getItem('currentUser')),
    errmessage: undefined,
  },
  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      const responseData = yield call(fakeAccountLogin, payload);
      if (responseData.code === Constans.SUCCESS) {
        const response = responseData.data;
        if (response != undefined) {
          yield put({
            type: 'changeLoginStatus',
            payload: response,
          });
          // Login successfully
          if (response.status === 'ok') {
            if (response.currentUser.user_type === '0') {
              setAuthority('admin');
            }
            response.currentUser.shift = payload.shift;
            response.currentUser.shiftName = payload.shiftName;
            response.currentUser.hotelCode = payload.hotel;
            sessionStorage.setItem('currentUser', JSON.stringify(response.currentUser));
            sessionStorage.setItem('token', response.token);
            const config = {};
            if (Array.isArray(response.config)) {
              response.config.map(item => {
                config[item.name] = item;
              });
            }
            sessionStorage.setItem('config', JSON.stringify(config));
            const urlParams = new URL(window.location.href);
            const params = getPageQuery();
            let { redirect } = params;
            if (redirect) {
              const redirectUrlParams = new URL(redirect);
              if (redirectUrlParams.origin === urlParams.origin) {
                redirect = redirect.substr(urlParams.origin.length);

                if (redirect.match(/^\/.*#/)) {
                  redirect = redirect.substr(redirect.indexOf('#') + 1);
                }
              } else {
                window.location.href = '/';
                return;
              }
            }
            router.replace(redirect || '/');
          }
        } else {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: 'error',
              currentUser: {},
              errmessage: responseData.message,
            },
          });
        }
      } else {
        message.error(responseData.message);
      }
    },

    // 退出登录
    logout() {
      confirm({
        title: '确定退出登录?',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          sessionStorage.removeItem('currentUser');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('config');
          const { redirect } = getPageQuery(); // Note: There may be security issues, please note
          if (window.location.pathname !== '/user/login' && !redirect) {
            router.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: window.location.href,
              }),
            });
          }
        },
        onCancel() {},
      });
    },

    // 获取当前用户
    *fetchCurrent({ payload }, { call, put }) {
      const responseData = yield call(fakeCurrentUser, payload);
      if (responseData.code === Constans.SUCCESS) {
        const response = responseData.data;
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        currentUser: payload.currentUser,
        errmessage: payload.errmessage,
      };
    },
    saveCurrentUser(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, currentUser: payload.currentUser };
    },
  },
};
export default Model;
