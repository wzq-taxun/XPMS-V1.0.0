import { GridContent } from '@ant-design/pro-layout';
import { Row, Col, Dropdown, Icon, Menu, Tabs, Select } from 'antd';
import StatisticsCard from './components/StatisticsCard';
// import star from '@/assets/star.svg';
// import zhifeiji from '@/assets/zhifeiji.svg';
// import shoutibao from '@/assets/shoutibao.svg';
// import baozhi from '@/assets/baozhi.svg';
import { Suspense, useState } from 'react';
import PageLoading from './components/PageLoading';
// import { connect } from 'dva';
import { useEffect } from 'react';
import { getTimeDistance } from './utils/utils';
import styles from './style.less';
import huiyuan from '@/assets/manageChart/huiyuan.png';
import daichuli from '@/assets/manageChart/daichuli.png';
import shouzhi from '@/assets/manageChart/shouzhi.png';
import xiaoshou from '@/assets/manageChart/xiaoshou.png';
import ruzhu from '@/assets/manageChart/ruzhu.png';
import yunying from '@/assets/manageChart/yunying.png';
import { getGuestFeature, getOrderMarket } from '@/services/manageChart';
import Constants from '@/constans';
import OrderMarketCard from './components/OrderMarketCard';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const UserPortrait = React.lazy(() => import('./components/UserPortrait'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const SalesDistribution = React.lazy(() => import('./components/SalesDistribution'));
const { TabPane } = Tabs;
const { Option } = Select;

const ManageChart = props => {
  // let reqRef = 0;

  useEffect(() => {
    // const { dispatch } = props;
    // reqRef = requestAnimationFrame(() => {
    // dispatch({
    //   type: 'manageChart/fetch',
    // });

    getGuestFeature().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setGuestFeature(list);
      }
    });

    getOrderMarket({ start_date: '2020-01-01', end_date: '2020-12-31' }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setOrderMarket(list);
      }
    });
    // });
    // return () => {
    //   dispatch({
    //     type: 'manageChart/clear',
    //   });
    //   cancelAnimationFrame(reqRef);
    // };
  }, []);

  const [guestFeature, setGuestFeature] = useState([]);
  const [orderMarket, setOrderMarket] = useState([]);

  const handleRangePickerChange = rangePickerValue => {
    // const { dispatch } = props;
    setRangePickerValue(rangePickerValue);
    // dispatch({
    //   type: 'manageChart/fetchSalesData',
    // });
  };

  const selectDate = type => {
    // const { dispatch } = props;
    setRangePickerValue(getTimeDistance(type));
    // dispatch({
    //   type: 'manageChart/fetchSalesData',
    // });
  };

  const isActive = type => {
    const value = getTimeDistance(type);

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  const handleChangeSalesType = e => {
    setSalesType(e.target.value);
  };

  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('year'));
  const [currentTabKey, setCurrentTabKey] = useState('');
  const [salesType, setSalesType] = useState('all');

  // const { manageChart } = props;
  // const {
  //   // visitData,
  //   salesData,
  //   userData,
  //   salesTypeData,
  //   salesTypeDataOnline,
  //   salesTypeDataOffline,
  //   offlineData,
  //   offlineChartData,
  // } = manageChart;

  // console.log(manageChart);

  // let salesPieData;

  // if (salesType === 'all') {
  //   salesPieData = salesTypeData;
  // } else {
  //   salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
  // }

  return (
    <GridContent>
      <Row gutter={[18, 18]} style={{ marginBottom: '15px' }}>
        <Col span={8}>
          <StatisticsCard
            title="会员信息"
            category="新会员"
            num="849"
            img={huiyuan}
          ></StatisticsCard>
        </Col>
        <Col span={8}>
          <StatisticsCard
            title="待理事项"
            category="新回复"
            num="200"
            img={daichuli}
          ></StatisticsCard>
        </Col>
        <Col span={8}>
          <StatisticsCard
            title="收支明细"
            category="今日收入"
            num="4590.00"
            img={shouzhi}
          ></StatisticsCard>
        </Col>
        <Col span={8}>
          <StatisticsCard
            title="总销售额"
            category="销售额"
            num="50000.00"
            img={xiaoshou}
          ></StatisticsCard>
        </Col>
        <Col span={8}>
          <StatisticsCard
            title="年入住量"
            category="入住量"
            num="50000.00"
            img={ruzhu}
          ></StatisticsCard>
        </Col>
        <Col span={8}>
          <StatisticsCard
            title="运营活动效果"
            category="活动效果"
            num="78%"
            img={yunying}
          ></StatisticsCard>
        </Col>
      </Row>
      <div className={styles.tabmain}>
        <Tabs tabPosition={"top"} type="card">
          <TabPane tab="订单市场" key="1">
            <Suspense fallback={null}>
              <OrderMarketCard />
            </Suspense>
          </TabPane>
          <TabPane tab="销售额" key="2">
            <Suspense fallback={null}>
              <div>
                <SalesCard
                  rangePickerValue={rangePickerValue}
                  salesData={orderMarket}
                  isActive={isActive}
                  handleRangePickerChange={handleRangePickerChange}
                  // loading={loading}
                  selectDate={selectDate}
                  title="销售额"
                />
              </div>

              {/* <SalesDistribution
          loading={loading}
          offlineData={offlineData}
          offlineChartData={offlineChartData}
        /> */}
            </Suspense>
          </TabPane>
        </Tabs>
      </div>

      <Row
        gutter={24}
        type="flex"
        style={{
          marginTop: 24,
        }}
      >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <UserPortrait userData={guestFeature} geomLabel={true} />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <ProportionSales
              salesType={salesType}
              // loading={loading}
              // salesPieData={salesPieData}
              handleChangeSalesType={handleChangeSalesType}
            />
          </Suspense>
        </Col>
      </Row>


    </GridContent>
  );
};

// export default connect(({ manageChart, loading }) => ({
//   manageChart,
//   // loading: loading.effects['manageChart/fetch'],
// }))(ManageChart);

export default ManageChart;
