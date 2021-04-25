import { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import {
  Row,
  Card,
  Col,
  Icon,
  Tabs,
  Button,
  Table,
  Modal,
  Input,
  Select,
  Menu,
  Dropdown,
  DatePicker,
  Divider,
} from 'antd';
import numeral from 'numeral';
import ChartCard from './ChartCard';
import Field from './Field';
import Trend from './Trend';
import Yuan from './Yuan';
import jdImg from '../../assets/mcsj.svg';
import hotelIcon from '@/assets/hotel.png';
import styles from './style.less';
import classNames from 'classnames';
import { router } from 'umi';
import Pie from './chart/pie';
import Bar from './chart/bar';
import { getOrders, getPayMoneyStatistics } from '@/services/order';
import Constans from '@/constans';
import { getAuditDate } from '@/services/audit';
import moment from 'moment';
import { openPostWindow } from '@/utils/openPost';
import {
  getOverviewRoomStatus,
  getOverviewOrderMarket,
  getOvervieRoomStatis,
} from '@/services/chart';
import StatisticsCard from './components/StatisticsCard';
import cardBg from '@/assets/overview/card.png';
import alipayBg from '@/assets/overview/alipay.png';
import wechatBg from '@/assets/overview/wechat.png';
import moneyBg from '@/assets/overview/money.png';
import otherBg from '@/assets/overview/other.png';
import receiveBg from '@/assets/overview/receive.png';
import { fakeShift } from '@/services/login';
import Dict from '@/dictionary';
const { Option } = Select;

const { TabPane } = Tabs;
const operations = (
  <Button
    onClick={() => {
      router.push('guestList');
    }}
  >
    更多
  </Button>
);

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 8,
  xl: 8,
  style: {
    marginBottom: 18,
  },
};

const columns = [
  {
    title: '订单号',
    dataIndex: 'order_no',
    key: 'order_no',
    render: text => <a>{text}</a>,
  },
  // {
  //   title: '类型',
  //   dataIndex: 'order_type',
  //   key: 'order_type',
  // },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 50,
  },
  {
    title: '订单类型',
    dataIndex: 'order_type_id',
    key: 'order_type_id',
    render: text => {
      const orderTypeArr = Dict.orderType.filter(item => item.id == text);
      return orderTypeArr && orderTypeArr[0] && orderTypeArr[0].name;
    },
    width: 80,
    ellipsis: true,
  },
  {
    title: '客人类型',
    dataIndex: 'guest_type_id',
    key: 'guest_type_id',
    render: text => {
      const guestTypeArr = Dict.guestType.filter(item => item.id == text);
      return guestTypeArr && guestTypeArr[0] && guestTypeArr[0].name;
    },
    width: 100,
    ellipsis: true,
  },
  {
    title: '姓名',
    dataIndex: 'reserve_name',
    key: 'reserve_name',
    width: 120,
    ellipsis: true,
  },
  {
    title: '房型',
    key: 'room_type',
    dataIndex: 'room_type',
    ellipsis: true,
  },
  {
    title: '房号',
    key: 'room_no',
    dataIndex: 'room_no',
    width: 70,
    ellipsis: true,
  },
  // {
  //   title: '房数',
  //   key: 'room_nums',
  //   dataIndex: 'room_nums',
  // },
  {
    title: '房价',
    key: 'room_reality_rate',
    dataIndex: 'room_reality_rate',
    width: 80,
    ellipsis: true,
  },
  {
    title: '联系方式',
    key: 'reserve_tel',
    dataIndex: 'reserve_tel',
  },
  // {
  //   title: '保留时间',
  //   key: 'retain_time',
  //   dataIndex: 'retain_time',
  // },
  // {
  //   title: '备注',
  //   key: 'memo',
  //   dataIndex: 'memo',
  // },
];

const columns1 = [
  ...columns,
  {
    title: '保留时间',
    key: 'retain_time',
    dataIndex: 'retain_time',
    width: 160,
  },
  {
    title: '备注',
    key: 'order_desc',
    dataIndex: 'order_desc',
    ellipsis: true,
  },
];

const columns2 = [
  ...columns,
  {
    title: '到达时间',
    key: 'checkin_time',
    dataIndex: 'checkin_time',
    width: 160,
  },
  {
    title: '备注',
    key: 'order_desc',
    dataIndex: 'order_desc',
    ellipsis: true,
  },
];

const columns3 = [
  ...columns,
  {
    title: '离店时间',
    key: 'checkout_time',
    dataIndex: 'checkout_time',
    width: 160,
  },
  {
    title: '备注',
    key: 'order_desc',
    dataIndex: 'order_desc',
    ellipsis: true,
  },
];

class Overview extends Component {
  state = {
    keyval: '1',
    shiftVis: false,
    shiftData: 'today',
    roomStatusTab: 'chart',
    guestTab: 'chart',
    orders: [],
    tableLoading: false,
    reportCode: 'C001',
    hotelName: '名巢未来酒店',
    audit: '',
    auditText: '',
    roomstatus: [],
    ordermarket: [],
    shiftName: '',
    statistics: {
      cash: { total: 0, sale: 0 },
      alipay: { total: 0, sale: 0 },
      wechat: { total: 0, sale: 0 },
      card: { total: 0, sale: 0 },
      other: { total: 0, sale: 0 },
      receive: { total: 0, sale: 0 },
    },
    roomStatis: [],
    shiftArr: [],
    shiftId: null,
    printShift: null,
  };

  handleIncAndExpCardClick() {
    router.push('incomeAndExpenses');
  }

  handleRowClick(record) {
    router.push({
      pathname: 'orderDetail',
      query: { orderId: record.id },
    });
  }

  componentWillMount() {
    // 添加
    if (sessionStorage.getItem('homkeyactive')) {
      // console.log(sessionStorage.getItem('homkeyactive'))
      // this.setState({ keyval: sessionStorage.getItem('homkeyactive') });
      this.handleTabsChange(sessionStorage.getItem('homkeyactive'))
    }


    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.setState({
      shiftId: currentUser.shift,
      shiftName: currentUser.shiftName,
      hotelName: currentUser.hotel_name,
      printShift: currentUser.shift,
    });

    // this.getOrders('I');
    getAuditDate().then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const data = rsp.data || [];
        if (data[0] && data[0].audit_date) {
          const audit = moment(data[0].audit_date).format('YYYY-MM-DD');
          const auditText = moment(data[0].audit_date).format('YYYY年MM月DD日');
          this.setState({ audit, auditText });
        }
      }
    });
    this.getOverviewRoomStatus();
    this.getOverviewOrderMarket();

    getPayMoneyStatistics().then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const data = rsp.data || [];
        const tempStatistics = this.state.statistics;
        let statistics = { ...tempStatistics };
        data.map(item => {
          if (item.code == 'CASH') {
            statistics.cash = { total: item.charge, sale: item.pud, today: item.today };
          } else if (item.code == 'ALIPAY') {
            statistics.alipay = { total: item.charge, sale: item.pud, today: item.today };
          } else if (item.code == 'WECHAT') {
            statistics.wechat = { total: item.charge, sale: item.pud, today: item.today };
          } else if (item.code == 'BANKCARD') {
            statistics.card = { total: item.charge, sale: item.pud, today: item.today };
          } else if (item.code == 'OTHERS') {
            statistics.receive = { total: item.charge, sale: item.pud, today: item.today };
          } else if (item.code == 'OTHER') {
            statistics.other = { total: item.charge, sale: item.pud, today: item.today };
          }
        });
        this.setState({ statistics });
      }
    });

    getOvervieRoomStatis().then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const list = rsp.data;
        if (!list) return;
        this.setState({ roomStatis: list });
      }
    });

    fakeShift().then(rsp => {
      if (rsp && rsp.code === Constans.SUCCESS) {
        const data = rsp.data || [];
        data.unshift({ id: 0, description: '全部' });
        this.setState({ shiftArr: data });
      }
    });
  }

  /**
   * 获取概览界面房间状态图表数据
   */
  getOverviewRoomStatus = () => {
    getOverviewRoomStatus().then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const list = rsp.data;
        if (!list) return;
        this.setState({ roomstatus: list });
      }
    });
  };

  /**
   * 获取概览界面在住分布图表数据
   */
  getOverviewOrderMarket = () => {
    getOverviewOrderMarket().then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const list = rsp.data;
        if (!list) return;
        this.setState({ ordermarket: list });
      }
    });
  };

  getOrders(type) {
    this.setState({ tableLoading: true });
    getOrders({ type }).then(rsp => {
      this.setState({ tableLoading: false });
      if (rsp && rsp.code == Constans.SUCCESS) {
        const list = (rsp.data && rsp.data.list) || [];
        if (!list) return;
        this.setState({ orders: list });
      }
    });
  }

  handleTabsChange(activekey) {
    this.setState({ orders: [], keyval: activekey });
    let type = 'I';
    if (activekey == '1') {
      // 今日已到
      type = 'I';
    } else if (activekey == '2') {
      // 今日应到
      type = 'R';
    } else if (activekey == '3') {
      // 今日欲离
      type = 'IR';
    } else if (activekey == '4') {
      // 今日已离
      type = 'O';
    } else if (activekey == '5') {
      // 应离未离
      type = 'YO';
    }
    this.getOrders(type);
    sessionStorage.setItem('homkeyactive', activekey)
  }

  handlePrint() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    // window.open(
    //   '/api/report/exportReport/' +
    //     this.state.reportId +
    //     '/pdf/' +
    //     currentUser.id +
    //     '?audit=' +
    //     this.state.audit,
    // );

    let audit = this.state.audit;
    if (this.state.shiftData == 'yesterday') {
      audit = moment(audit, 'YYYY-MM-DD').add(-1, 'days');
      audit = audit.format('YYYY-MM-DD');
    }

    const { hotel_group_id, hotel_id, id } = currentUser;
    openPostWindow(
      'api/report/exportReport/' +
      hotel_group_id +
      '/' +
      hotel_id +
      '/' +
      this.state.reportCode +
      '/' +
      currentUser.id,
      {
        // audit: this.state.audit,
        audit,
        shift_id: this.state.printShift,
        cashier: currentUser.id,
      },
    );
  }

  render() {
    const shiftLabel = {
      span: 6,
      offset: 2,
      style: {
        textAlign: 'right',
        height: '40px',
        padding: '5px',
        lineHeight: '30px',
      },
    };

    const shiftInp = {
      span: 14,
      offset: -2,
      style: {
        textAlign: 'left',
        height: '40px',
        padding: '5px',
        lineHeight: '30px',
      },
    };

    const { roomstatus, ordermarket } = this.state;
    return (
      <GridContent>
        <Row gutter={16} type="flex">
          <Col span={6} style={{ marginBottom: '18px' }}>
            <Card className={styles.shiftCard}>
              <div className={styles.infoCardHeader}>
                <p>当前酒店</p>
              </div>
              <div className={styles.infoCardLogo}>
                <img src={hotelIcon} alt="" />
              </div>
              <div className={styles.infoCardHotel}>
                <p>{this.state.hotelName}</p>
              </div>
              <div className={styles.infoCardJb}>
                <button onClick={() => this.setState({ shiftVis: true })}>交接班次</button>
              </div>
              <Divider className={styles.myDivider} />
              <div className={styles.infoCardDate}>
                <span>{this.state.auditText}</span>
                <span className={styles.shift}>{this.state.shiftName}</span>
              </div>
            </Card>
          </Col>

          <Modal
            className={styles.shiftModal}
            visible={this.state.shiftVis}
            title="交班"
            onCancel={() => this.setState({ shiftVis: false })}
            onOk={() => this.setState({ shiftVis: false })}
            footer={[
              <Button key="print" onClick={() => this.handlePrint()}>
                打印
              </Button>,
              <Button key="back" onClick={() => this.setState({ shiftVis: false })}>
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={() => this.setState({ shiftVis: false })}
              >
                确定
              </Button>,
            ]}
          >
            <Row>
              <Col {...shiftLabel}>报表：</Col>
              <Col {...shiftInp}>
                <Select
                  value={this.state.reportCode}
                  style={{ width: '100%' }}
                  onChange={value => this.setState({ reportCode: value })}
                >
                  <Option value={'C001'}>前台收款汇总表</Option>
                  <Option value={'C002'}>前台收款明细表</Option>
                </Select>
              </Col>
            </Row>
            <Row>
              <Col {...shiftLabel}>班次：</Col>
              <Col {...shiftInp}>
                <Select
                  defaultValue={this.state.shiftId}
                  style={{ width: '100%' }}
                  onChange={value => {
                    this.setState({ printShift: value });
                  }}
                >
                  {this.state.shiftArr.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.description}
                    </Option>
                  ))}
                  {/* <Option value={1}>早班</Option>
                  <Option value={2}>中班</Option>
                  <Option value={3}>晚班</Option> */}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col {...shiftLabel}>日期：</Col>
              <Col {...shiftInp}>
                <button
                  style={{ marginRight: '10px' }}
                  className={classNames(
                    styles.shiftBt,
                    this.state.shiftData == 'today' ? styles.active : null,
                  )}
                  onClick={() => this.setState({ shiftData: 'today' })}
                >
                  今天
                </button>
                <button
                  style={{ marginLeft: '10px' }}
                  className={classNames(
                    styles.shiftBt,
                    this.state.shiftData == 'yesterday' ? styles.active : null,
                  )}
                  onClick={() => this.setState({ shiftData: 'yesterday' })}
                >
                  昨天
                </button>
              </Col>
            </Row>
          </Modal>

          <Col span={18}>
            <Row gutter={18} type="flex">
              <Col {...topColResponsiveProps}>
                <StatisticsCard
                  bg={cardBg}
                  title="信用卡"
                  total={this.state.statistics.card.total}
                  sale={this.state.statistics.card.sale}
                  today={this.state.statistics.card.today}
                />
              </Col>

              <Col {...topColResponsiveProps}>
                <StatisticsCard
                  bg={alipayBg}
                  title="支付宝"
                  total={this.state.statistics.alipay.total}
                  sale={this.state.statistics.alipay.sale}
                  today={this.state.statistics.alipay.today}
                />
              </Col>

              <Col {...topColResponsiveProps}>
                <StatisticsCard
                  bg={wechatBg}
                  title="微信"
                  total={this.state.statistics.wechat.total}
                  sale={this.state.statistics.wechat.sale}
                  today={this.state.statistics.wechat.today}
                />
              </Col>

              <Col {...topColResponsiveProps}>
                <StatisticsCard
                  bg={moneyBg}
                  title="现金"
                  total={this.state.statistics.cash.total}
                  sale={this.state.statistics.cash.sale}
                  today={this.state.statistics.cash.today}
                />
              </Col>

              <Col {...topColResponsiveProps}>
                <StatisticsCard
                  bg={otherBg}
                  title="其他"
                  total={this.state.statistics.other.total}
                  sale={this.state.statistics.other.sale}
                  today={this.state.statistics.other.today}
                />
              </Col>

              <Col {...topColResponsiveProps}>
                <StatisticsCard
                  bg={receiveBg}
                  title="应收"
                  total={this.state.statistics.receive.total}
                  sale={this.state.statistics.receive.sale}
                  today={this.state.statistics.receive.today}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Tabs
          tabBarExtraContent={operations}
          style={{ background: '#fff', padding: '0 10px' }}
          onChange={activekey => this.handleTabsChange(activekey)}
          activeKey={this.state.keyval}
        >
          <TabPane tab="今日已到" key="1" style={{ height: '450px' }}>
            <Table
              columns={columns2}
              dataSource={this.state.orders}
              rowClassName={styles.rowSty}
              rowKey="id"
              size="small"
              loading={this.state.tableLoading}
              pagination={false}
              onRow={record => {
                return {
                  onClick: e => {
                    this.handleRowClick(record);
                  },
                };
              }}
            />
          </TabPane>
          <TabPane tab="今日应到" key="2" style={{ height: '450px' }}>
            <Table
              columns={columns1}
              dataSource={this.state.orders}
              size="small"
              rowClassName={styles.rowSty}
              rowKey="id"
              loading={this.state.tableLoading}
              pagination={false}
              onRow={record => {
                return {
                  onClick: e => {
                    this.handleRowClick(record);
                  },
                };
              }}
            />
          </TabPane>
          <TabPane tab="今日预离" key="3" style={{ height: '450px' }}>
            <Table
              columns={columns3}
              dataSource={this.state.orders}
              rowClassName={styles.rowSty}
              rowKey="id"
              size="small"
              loading={this.state.tableLoading}
              pagination={false}
              onRow={record => {
                return {
                  onClick: e => {
                    this.handleRowClick(record);
                  },
                };
              }}
            />
          </TabPane>
          <TabPane tab="今日已离" key="4" style={{ height: '450px' }}>
            <Table
              columns={columns3}
              dataSource={this.state.orders}
              rowClassName={styles.rowSty}
              rowKey="id"
              size="small"
              loading={this.state.tableLoading}
              pagination={false}
              onRow={record => {
                return {
                  onClick: e => {
                    this.handleRowClick(record);
                  },
                };
              }}
            />
          </TabPane>
          <TabPane tab="应离未离" key="5" style={{ height: '450px' }}>
            <Table
              columns={columns3}
              dataSource={this.state.orders}
              rowClassName={styles.rowSty}
              rowKey="id"
              size="small"
              loading={this.state.tableLoading}
              pagination={false}
              onRow={record => {
                return {
                  onClick: e => {
                    this.handleRowClick(record);
                  },
                };
              }}
            />
          </TabPane>
        </Tabs>

        <Row gutter={12} style={{ marginTop: '10px' }}>
          <Col span={12}>
            <div className={styles.chartCard}>
              <div className={styles.chartCard}>
                <div className={styles.ccTitle}>
                  <span className={styles.title}>客房状态图</span>
                </div>
                <Pie data={roomstatus} subTitle="总数" total="25" />
              </div>

              {/* <div className={styles.ccTitle}>
                <span className={styles.title}>在住分布图</span>
                <DatePicker style={{ float: 'right', marginRight: '10px' }} />
              </div>
              <Bar /> */}
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.chartCard}>
              <div className={styles.ccTitle}>
                <span className={styles.title}>实时客情</span>
              </div>
              <Pie inner={true} data={ordermarket} subTitle="总数" total="25" />
            </div>
          </Col>
        </Row>
        {/* <Row style={{ marginTop: '10px' }}>
          <Col span={24}>
            <div className={styles.chartCard}>
              <div className={styles.ccTitle}>
                <span className={styles.title}>在住分布图</span>
              </div>
              <Bar data={this.state.roomStatis} />
            </div>
          </Col>
        </Row> */}
        {/* <DatePicker style={{ float: 'right', marginRight: '10px' }} /> */}
      </GridContent>
    );
  }
}

export default Overview;
