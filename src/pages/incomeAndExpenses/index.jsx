import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { DatePicker, Divider, Col, Row, Icon, Table } from 'antd';
import { router } from 'umi';
import StatisticsCard from './statisticsCard';

const IncomeAndExpenses = props => {
  const dividerSty = {
    display: 'inline-block',
    width: '20px',
    background: '#333',
    margin: 'auto 10px',
    minWidth: 'inherit',
  };

  const columns = [
    {
      title: '账号',
      dataIndex: 'zh',
      key: 'zh',
    },
    {
      title: '房号',
      dataIndex: 'fh',
      key: 'fh',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '入账日期',
      dataIndex: 'rzsj',
      key: 'rzsj',
      width: 160,
    },
    {
      title: '单号',
      dataIndex: 'dh',
      key: 'dh',
    },
    {
      title: '摘要',
      dataIndex: 'zy',
      key: 'zy',
    },
    {
      title: '金额',
      dataIndex: 'je',
      key: 'je',
    },
    {
      title: '收银员',
      dataIndex: 'syy',
      key: 'syy',
    },
  ];

  const data = [
    {
      key: '1',
      zh: '8301',
      fh: '8301',
      name: '阿凡达',
      rzsj: '2020-02-02 02:02:02',
      dh: '19121907',
      zy: '再要',
      je: '100.00',
      syy: '张三',
    },
    {
      key: '2',
      zh: '8301',
      fh: '8302',
      name: '大宝',
      rzsj: '2020-02-02 02:02:02',
      dh: '19121907',
      zy: '再要',
      je: '130.00',
      syy: '张三',
    },
    {
      key: '3',
      zh: '8301',
      fh: '8303',
      name: '高富帅',
      rzsj: '2020-02-02 02:02:02',
      dh: '19121907',
      zy: '再要',
      je: '50.00',
      syy: '张三',
    },
    {
      key: '4',
      zh: '8301',
      fh: '8303',
      name: '高富帅',
      rzsj: '2020-02-02 02:02:02',
      dh: '19121907',
      zy: '再要',
      je: '50.00',
      syy: '张三',
    },
    {
      key: '5',
      zh: '8301',
      fh: '8303',
      name: '高富帅',
      rzsj: '2020-02-02 02:02:02',
      dh: '19121907',
      zy: '再要',
      je: '50.00',
      syy: '张三',
    },
    {
      key: '6',
      zh: '8301',
      fh: '8303',
      name: '高富帅',
      rzsj: '2020-02-02 02:02:02',
      dh: '19121907',
      zy: '再要',
      je: '50.00',
      syy: '张三',
    },
  ];

  const handleExit = () => {
    router.push('overview');
  };

  const rowOption = { style: { marginBottom: '10px' }, gutter: 18 };

  return (
    <GridContent>
      <div className={styles.header}>
        <DatePicker format="YYYY-MM-DD" />
        <Divider type="horizontal" style={dividerSty} />
        <DatePicker format="YYYY-MM-DD" />
        <span className={styles.quickDate} style={{ marginLeft: '30px' }}>
          今日
        </span>
        <span className={styles.quickDate}>昨日</span>
        <span className={styles.quickDate}>本月</span>
        <span className={styles.quickDate}>上月</span>
        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => handleExit()}>
          退出
        </span>
      </div>
      <div className={styles.content}>
        <Row {...rowOption}>
          <Col span={4}>
            <StatisticsCard
              avatarBg="#FFB346"
              avatar={
                <Icon
                  type="credit-card"
                  theme="filled"
                  style={{ color: '#fff', fontSize: '20px' }}
                />
              }
              category="信用卡"
              total="126,560"
              rate="15.36%"
              flag="up"
            />
          </Col>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              style={{ height: '160px' }}
              pagination={false}
              scroll={{ y: 120 }}
            />
          </Col>
        </Row>

        <Row {...rowOption}>
          <Col span={4}>
            <StatisticsCard
              avatar={
                <Icon
                  type="pay-circle"
                  theme="filled"
                  style={{ color: '#FF0000', fontSize: '40px' }}
                />
              }
              category="现金"
              total="81,220"
              rate="2.06%"
              flag="up"
            />
          </Col>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              style={{ height: '160px' }}
              pagination={false}
              scroll={{ y: 120 }}
            />
          </Col>
        </Row>

        <Row {...rowOption}>
          <Col span={4}>
            <StatisticsCard
              avatar={
                <Icon
                  type="alipay-circle"
                  theme="filled"
                  style={{ color: '#00A0E9', fontSize: '40px' }}
                />
              }
              category="支付宝"
              total="92,320"
              rate="15.36%"
              flag="down"
            />
          </Col>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              style={{ height: '160px' }}
              pagination={false}
              scroll={{ y: 120 }}
            />
          </Col>
        </Row>

        <Row {...rowOption}>
          <Col span={4}>
            <StatisticsCard
              avatarBg="#1BB723"
              avatar={<Icon type="wechat" style={{ color: '#fff', fontSize: '20px' }} />}
              category="微信"
              total="236,000"
              rate="5.36%"
              flag="up"
            />
          </Col>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              style={{ height: '160px' }}
              pagination={false}
              scroll={{ y: 120 }}
            />
          </Col>
        </Row>

        <Row {...rowOption}>
          <Col span={4}>
            <StatisticsCard
              avatarBg="#949494"
              avatar={<Icon type="ellipsis" style={{ color: '#fff', fontSize: '20px' }} />}
              category="其他"
              total="76,560"
              rate="15.36%"
              flag="down"
            />
          </Col>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              style={{ height: '160px' }}
              pagination={false}
              scroll={{ y: 120 }}
            />
          </Col>
        </Row>

        <Row {...rowOption}>
          <Col span={4}>
            <StatisticsCard
              avatar={
                <Icon
                  type="money-collect"
                  theme="filled"
                  style={{ color: '#79A1FE', fontSize: '40px' }}
                />
              }
              category="应收"
              total="136,210"
              rate="25.36%"
              flag="up"
            />
          </Col>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              style={{ height: '160px' }}
              pagination={false}
              scroll={{ y: 120 }}
            />
          </Col>
        </Row>
      </div>
    </GridContent>
  );
};

export default IncomeAndExpenses;
