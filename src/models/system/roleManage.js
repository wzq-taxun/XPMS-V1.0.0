import { getRoles, saveRole, deleteRole } from '@/services/system/roleManage';
import { message } from 'antd';
import Constans from '@/constans';

const RoleManageModel = {
  namespace: 'roleManage',
  state: {
    roles: [],
    totalCount: undefined
  },
  effects: {
    /**
     * 获取角色
     * @param {*} param0 
     * @param {*} param1 
     */
    *getRoles({ payload, callback }, { call, put }) {
      const responseData = yield call(getRoles, payload);
      if (responseData.code === Constans.SUCCESS) {
        const response = responseData.data;
        yield put({
          type: 'setRoles',
          payload: response,
        });
      } else {
        message.error(responseData.message);
      }
      if (callback) callback(responseData);
    },
    
    /**
     * 保存角色
     * @param {*} param0 
     * @param {*} param1 
     */
    *saveRole({ payload, callback }, { call, put }) {
      const responseData = yield call(saveRole, payload);
      if (responseData.code === Constans.SUCCESS) {
        message.success(responseData.message);
      } else {
          message.error(responseData.message);
      }
      if (callback) callback(responseData);
    },

    /**
     * 删除角色
     * @param {*} param0 
     * @param {*} param1 
     */
    *deleteRole({ payload, callback }, { call, put }) {
      const responseData = yield call(deleteRole, payload);
      if (responseData.code === Constans.SUCCESS) {
        message.success(responseData.message);
      } else {
        message.error(responseData.message);
      }
      if (callback) callback(responseData);
    },
  },
  reducers: {
    setRoles(state, { payload }) {
      return { ...state, roles: payload.roles, totalCount: payload.count  };
    },
  },
};

export default RoleManageModel;
