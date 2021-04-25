const routes = [{
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [{
            name: 'login',
            path: '/user/login',
            component: './user/login',
        }, ],
    },
    {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [{
                path: '/',
                component: '../layouts/BasicLayout',
                authority: ['admin', 'user'],
                routes: [{
                        path: '/',
                        redirect: '/overview',
                    },
                    {
                        name: '首页',
                        path: '/home',
                        component: './home',
                    },
                    {
                        path: '/report',
                        component: './report',
                    },
                    // 新增基础配置页面
                    {
                        path: '/basic/config',
                        component: './system/baseCofig',
                    },
                    // 新增门锁配置页面
                    {
                        path: '/lockconfig',
                        component: './lockconfig',
                    },
                    // 新增设备配置页面
                    {
                        path: '/equipment',
                        component: './equipmentconfig',
                    },
                    // 新增小程序优惠券赠送列表页面
                    {
                        path: '/mostfavorable',
                        component: './mostfavorableprices',
                    },
                    {
                        path: '/overview',
                        component: './overview',
                    },
                    {
                        path: '/guestList',
                        component: './guestList',
                    },
                    {
                        path: '/checkIn',
                        component: './checkIn',
                    },
                    {
                        path: '/reserve',
                        component: './reserve',
                    },
                    {
                        path: '/bill',
                        component: './bill',
                    },
                    {
                        path: '/goodsManage',
                        component: './goods',
                    },
                    {
                        path: '/roomStatus',
                        component: './roomStatus',
                    },
                    {
                        path: '/roomSituation',
                        component: './roomSituation',
                    },
                    {
                        path: '/managerReport',
                        component: './manageChart',
                    },
                    {
                        path: '/orderDetail',
                        component: './guestOrder',
                    },
                    {
                        path: '/userManage',
                        component: './system/userManage',
                    },
                    {
                        path: '/roleManage',
                        component: './system/roleManage',
                    },
                    {
                        path: '/permissionsManage',
                        component: './system/permissionsManage',
                    },
                    {
                        path: '/codeConfig',
                        component: './system/codeConfig',
                    },
                    {
                        path: '/roomConfig',
                        component: './system/roomConfig',
                    },
                    {
                        path: '/companyConfig',
                        component: './system/company',
                    },
                    {
                        path: '/memberConfig',
                        component: './system/member',
                    },
                    {
                        path: '/incomeAndExpenses',
                        component: './incomeAndExpenses',
                    },
                    {
                        path: '/messageList',
                        component: './messageList',
                    },
                    {
                        path: '/audit',
                        component: './audit',
                    },
                    {
                        path: '/hotels',
                        component: './system/hotels',
                    },
                    {
                        path: '/userCenter',
                        component: './user/userCenter',
                    },
                    {
                        path: '/hotel',
                        component: './user/hotelCenter',
                    },
                    {
                        path: '/hotelImgs',
                        component: './system/hotelImgs',
                    },
                    {
                        path: '/wechatAds',
                        component: './system/wechatAds',
                    },
                    {
                        path: '/todo',
                        component: './system/toDo',
                    },
                    {
                        path: '/memberUpConfig',
                        component: './system/memberUpConfig',
                    },
                    {
                        path: '/memberRechargeConfig',
                        component: './system/memberRechargeConfig',
                    },
                    {
                        path: '/guestReUpload',
                        component: './guestReUpload',
                    },
                    {
                        path: '/luckDraw',
                        component: './luckDraw',
                    },
                    {
                        component: './404',
                    },
                ],
            },
            {
                component: './404',
            },
        ],
    },
    {
        component: './404',
    },
];

export default routes;