import { GridContent } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import styles from './style.less';
import CodeFloor from './CodeFloor';
import CodeRoomType from './CodeRoomType';
import CodeRoomNo from './CodeRoomNo';
import CodeRoomPrice from './CodeRoomPrice';
import CodeMaintain from './CodeMaintain';
import CodeLock from './CodeLock';
import SalesMan from './SalesMan';
const { TabPane } = Tabs;

const RoomConfig = props => {
  return (
    <GridContent>
      <Tabs defaultActiveKey="FL" className={styles.myTabs}>
        <TabPane tab="楼层" key="FL">
          <CodeFloor />
        </TabPane>
        <TabPane tab="房型" key="FT">
          <CodeRoomType />
        </TabPane>
        <TabPane tab="房号" key="RN">
          <CodeRoomNo />
        </TabPane>
        <TabPane tab="房价" key="RP">
          <CodeRoomPrice />
        </TabPane>
        <TabPane tab="维修原因" key="maintain">
          <CodeMaintain />
        </TabPane>
        <TabPane tab="锁房原因" key="lock">
          <CodeLock />
        </TabPane>
        <TabPane tab="销售员" key="salesMan">
          <SalesMan />
        </TabPane>
      </Tabs>
    </GridContent>
  );
};

export default RoomConfig;
