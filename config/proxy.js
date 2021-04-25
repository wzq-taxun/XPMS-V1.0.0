const proxy = {
    '/jinglun/ReadMsg': {
        target: 'http://localhost:8989',
        changeOrigin: true,
        secure: false,
        // 不进行证书验证
        pathRewrite: {
            '^/jinglun/ReadMsg': '/api/ReadMsg',
        },
    },
    '/api': {
        // target: 'https://localhost:8082/',
        // target: 'https://www.xpms.cn:8080',
        target: 'https://192.168.1.5:8099',
        changeOrigin: true,
        secure: false,
        // 不进行证书验证
        pathRewrite: {
            '^/api': '/api',
        },
    },
    '/sys': {
        // target: 'https://localhost:8082/',               
        // target: 'https://www.xpms.cn:8080',
        target: 'https://192.168.1.5:8099/',
        changeOrigin: true,
        secure: false,
        // 不进行证书验证
        pathRewrite: {
            '^/sys': '/sys',
        },
    },
    '/ext_inter': {
        // target: 'http://192.168.1.22:8081/',
        target: 'http://www.xpms.cn:8081/',
        changeOrigin: true,
        secure: false,
        // 不进行证书验证
        pathRewrite: {
            '^/ext_inter': '/',
        },
    },
};

export default proxy;