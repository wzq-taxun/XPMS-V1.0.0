import { getUsers, updateUser,removeUser } from '@/services/system/userManage';
import { message } from 'antd';
import Constans from '@/constans';

const UserManageModel = {
  namespace: 'userManage',
  state: {
    users: [],
  },
  effects: {
    *getUsers({ payload }, { call, put }) {
      const responseData = yield call(getUsers, payload);
      if (responseData.code === Constans.SUCCESS) {
        const response = responseData.data.users;
        yield put({
          type: 'setUsers',
          payload: response,
        });
      }
    },
    *updateUser({ payload }, { call, put }) {
      const responseData = yield call(updateUser, payload);
      if (responseData.code === Constans.SUCCESS) {
        yield put({
          type: 'getUsers',
          payload: payload,
        });
        message.success('成功');
      }
    },
    *removeUser({ payload }, { call, put }) {
      const responseData = yield call(removeUser, payload);
      if (responseData.code === Constans.SUCCESS) {
        yield put({
          type: 'getUsers',
          payload: payload,
        });
        message.success('成功');
      }
    },
  },
  reducers: {
    setUsers(state, { payload }) {
      return { ...state, users: payload };
    },
  },
};

export default UserManageModel;
