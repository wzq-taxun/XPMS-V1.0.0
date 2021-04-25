const Dict = {
  orderType: [
    { id: 40, code: 'YD001', name: '全日房' },
    { id: 41, code: 'YD002', name: '钟点房' },
    { id: 43, code: 'YD004', name: '长包房' },
    { id: 42, code: 'YD003', name: '长租房' },
  ],
  hourTypeId: 41,
  guestType: [
    { id: 36, code: 'FIT', name: '散客' },
    { id: 37, code: 'MEM', name: '会员' },
    { id: 38, code: 'COR', name: '协议公司' },
    { id: 39, code: 'GT004', name: '中介/旅行社' },
  ],
  accountType: [
    { code: 'XF', name: '消费', credit_debit: '2' }, //2.借方 1.贷方
    { code: 'FK', name: '付款', credit_debit: '1' },
    { code: 'TK', name: '退款', credit_debit: '1' },
    { code: 'YS', name: '应收', credit_debit: '1' },
  ],
  accountCode: {
    XF: 'XF', //消费
    FK: 'FK', //付款
    TK: 'TK', //退款
    YS: 'YS', //应收
    XSP: 'GOODS', //小商品
    AR: 'AR', //挂AR账
    S: 'S', //挂S账,
    member: 'MEMBERCARD', //会员卡
    wechat: 'WECHAT',
    aliPay: 'ALIPAY',
    coupon: 'COUPON', //优惠卷
  },
  hourStartConfCode: 'HOUR_ROOM', //钟点房起步时长
  checkOutConfCode: 'CHECK_OUT', //默认退房时间
  checkInConfCode: 'CHECK_IN', //默认预定到店时间
  scanCardConfCode: 'READ_CARD_TYPE', //读卡器类型
  cardScan: 'ERDAIZHENG', //二代证
  peopleCard: 'SENSETIME', //人证合一
};

export default Dict;
