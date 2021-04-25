import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';

import routes from './routes';
import proxy from './proxy';

const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
    [
        'umi-plugin-react',
        {
            antd: true,
            dva: {
                hmr: true,
            },
            locale: {
                // default false
                enable: true,
                // default zh-CN
                default: 'zh-CN',
                // default true, when it is true, will use `navigator.language` overwrite default
                baseNavigator: true,
            },
            dynamicImport: {
                loadingComponent: './components/PageLoading/index',
                webpackChunkName: true,
                level: 3,
            },
            pwa: pwa ? {
                workboxPluginMode: 'InjectManifest',
                workboxOptions: {
                    importWorkboxFrom: 'local',
                },
            } : false,
        },
    ],
    [
        'umi-plugin-pro-block',
        {
            moveMock: false,
            moveService: false,
            modifyRequest: true,
            autoAddMenu: true,
        },
    ],
];

if (isAntDesignProPreview) {
    // 针对 preview.pro.ant.design 的 GA 统计代码
    plugins.push([
        'umi-plugin-ga',
        {
            code: 'UA-72788897-6',
        },
    ]);
    plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
    history: 'hash',
    // 默认是 browser
    plugins,
    hash: true,
    targets: {
        ie: 11,
    },
    routes: routes,
    // theme: { 'primary-color': '#E62A42' },
    define: {
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    },
    ignoreMomentLocale: true,
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    disableRedirectHoist: true,
    cssLoaderOptions: {
        modules: true,
        getLocalIdent: (context, _, localName) => {
            if (
                context.resourcePath.includes('node_modules') ||
                context.resourcePath.includes('ant.design.pro.less') ||
                context.resourcePath.includes('global.less')
            ) {
                return localName;
            }

            const match = context.resourcePath.match(/src(.*)/);

            if (match && match[1]) {
                const antdProPath = match[1].replace('.less', '');
                const arr = slash(antdProPath)
                    .split('/')
                    .map(a => a.replace(/([A-Z])/g, '-$1'))
                    .map(a => a.toLowerCase());
                return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
            }
            return localName;
        },
    },

    manifest: {
        basePath: '/',
    },
    proxy: proxy,
    // chainWebpack: webpackPlugin,
    // proxy: {
    //     '/jinglun/ReadMsg': {
    //         target: 'http://localhost:8989',
    //         changeOrigin: true,
    //         secure: false,
    //         // 不进行证书验证
    //         pathRewrite: {
    //             '^/jinglun/ReadMsg': '/api/ReadMsg',
    //         },
    //     },
    //     '/api': {
    //         // target: 'https://localhost:8082/',
    //         // target: 'https://www.xpms.cn:8082',
    //         target: 'https://192.168.1.22:8082',
    //         changeOrigin: true,
    //         secure: false,
    //         // 不进行证书验证
    //         pathRewrite: {
    //             '^/api': '/api',
    //         },
    //     },
    //     '/sys': {
    //         // target: 'http://192.168.1.17:8085/',
    //         target: 'https://192.168.1.22:8082/',
    //         // target: 'https://www.xpms.cn:8082',
    //         changeOrigin: true,
    //         secure: false,
    //         // 不进行证书验证
    //         pathRewrite: {
    //             '^/sys': '/sys',
    //         },
    //     },
    //     '/write': {
    //         target: 'http://192.168.1.17:8085/',
    //         changeOrigin: true,
    //         secure: false,
    //         // 不进行证书验证
    //         pathRewrite: {
    //             '^/write': '/write',
    //         },
    //     },
    //     '/ext_inter': {
    //         // target: 'http://192.168.1.22:8081/',
    //         target: 'http://www.xpms.cn:8081/',
    //         changeOrigin: true,
    //         secure: false,
    //         // 不进行证书验证
    //         pathRewrite: {
    //             '^/ext_inter': '/',
    //         },
    //     },
    // },
};