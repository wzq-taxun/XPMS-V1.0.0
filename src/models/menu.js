import { getMenuData } from '@/services/menu'; // 通过后台返回特定的数组json或者mock模拟数据
import Constans from '@/constans';

const MenuModel = {
    namespace: 'menu',
    state: {
        menuData: [],
        authRouters: [],
    },
    effects: {
        * getMenuData({ payload, callback }, { call, put }) {
            const response = yield call(getMenuData, payload);
            console.log(response)
            if (Constans.SUCCESS == response.code) {
                // const repData = response.data.menu;
                const repData = response.data;
                yield put({
                    type: 'save',
                    payload: repData,
                });
            }
        },
    },

    reducers: {
        save(state, action) {
            const { menu, authRouters } = action.payload;
            return {
                ...state,
                // menuData: [...action.payload] || [],
                menuData: [...menu] || [],
                authRouters: [...authRouters] || [],
            };
        },
    },
};
export default MenuModel;