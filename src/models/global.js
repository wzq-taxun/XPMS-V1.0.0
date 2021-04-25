import { queryNotices, readNotice } from '@/services/notices';
import { getDict, getDynamicDict } from '@/services/global';
import Constants from '@/constans';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    loading: false,
    notices: [],
    unreadCount: 0,
    auditRefush: false,
  },
  effects: {
    *fetchNotices(_, { call, put }) {
      const rsp = yield call(queryNotices);
      if (rsp && rsp.code == Constants.SUCCESS) {
        // 第一次获取的消息内容及条数
        const data = rsp.data || [];

        yield put({
          type: 'saveNotices',
          payload: data,
        });
        yield put({
          type: 'saveNoticesCount',
          payload: data.length,
        });
      }
    },

    /**
     * 查询字典项
     * @param {*} param0
     * @param {*} param1
     */
    *fetchDict({ payload, callback }, { call, put }) {
      const response = yield call(getDict, payload);
      if (response && response.code == Constants.SUCCESS) {
        // 点击哪个table栏 后请求结果
        let dicttype = payload.dicttype;
        payload[dicttype] = response.data;
        yield put({
          type: 'show',
          payload,
        });
        if (callback) callback(responseData);
      }
    },

    /**
     * 查询动态字典项
     * @param {*} param0
     * @param {*} param1
     */
    *fetchDynamicDict({ payload, callback }, { call, put }) {
      const response = yield call(getDynamicDict, payload);
      if (response && response.code == Constants.SUCCESS) {
        let configid = payload.configid;
        payload[configid] = response.data;
        yield put({
          type: 'show',
          payload,
        });
        if (callback) callback(responseData);
      }
    },

    *clearNotices({ payload }, { put, select }) {
      // 清空通知 清空的是 哪个内容  通知  消息  代办
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      // const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => item.is_read != '1').length,
      );
      yield put({
        type: 'saveNoticesCount',
        payload: unreadCount,
      });
    },
    // 查看完消息后 之后 所剩下的 消息条数  及内容 阅读完之后的 数量
    *changeNoticeReadState({ payload }, { put, select }) {
      const rsp = yield readNotice(payload);
      if (rsp && rsp.code == Constants.SUCCESS) {
        // 点击每条后所 返回的数据
        let readCount = 0;
        const notices = yield select(state =>
          state.global.notices.map(item => {
            const notice = { ...item };

            if (notice.id === payload) {
              notice.read = true;
              readCount += 1;
            }

            return notice;
          }),
        );
        yield put({
          type: 'saveNotices',
          payload: notices,
        });
        yield put({
          type: 'saveNoticesCount',
          payload: notices.length - readCount,
        });
      }
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, loading: payload };
    },

    changeLoading(state, { payload }) {
      return { ...state, loading: payload };
    },

    changeAuditRefush(state, { payload }) {
      const refush = !state.auditRefush;
      return { ...state, auditRefush: refush };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveNoticesCount(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        unreadCount: payload,
      };
    },

    addNotices(state, { payload }) {
      if (payload) {
        const notices = state.notices || [];
        notices.push(payload);
        let unreadCount = state.unreadCount || 0;
        unreadCount += 1;
        return {
          collapsed: false,
          ...state,
          notices,
          unreadCount,
        };
      }
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.message_type !== payload),
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },

  show(state, { payload }) {
    return {
      ...state,
      ...payload,
    };
  },
};
export default GlobalModel;
