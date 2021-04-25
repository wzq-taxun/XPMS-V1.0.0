import { GridContent } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import styles from './style.less';
import CodeOrder from './CodeOrder';
import CodeGuest from './CodeGuest';
import CodeMarket from './CodeMarket';
import CodeSource from './CodeSource';
import CodeCanal from './CodeCanal';
import CodePreferReason from './CodePreferReason';
import CodePackages from './CodePackages';
import CodeAccount from './CodeAccount';
import CodeRoomRate from './CodeRoomRate';
import CodeMemberLevel from './CodeMemberLevel';

const { TabPane } = Tabs;

const CodeConfig = props => (
  <GridContent>
    <Tabs defaultActiveKey="CIT" className={styles.myTabs}>
      <TabPane tab="入住类型" key="CIT">
        <CodeOrder />
      </TabPane>
      <TabPane tab="客户类型" key="GT">
        <CodeGuest />
      </TabPane>
      <TabPane tab="市场码" key="MT">
        <CodeMarket />
      </TabPane>
      <TabPane tab="来源码" key="ST">
        <CodeSource />
      </TabPane>
      <TabPane tab="渠道码" key="CT">
        <CodeCanal />
      </TabPane>
      <TabPane tab="优惠理由" key="PT">
        <CodePreferReason />
      </TabPane>
      <TabPane tab="包价" key="PKT">
        <CodePackages />
      </TabPane>
      <TabPane tab="账项代码" key="AT">
        <CodeAccount />
      </TabPane>
      <TabPane tab="房价码" key="RR">
        <CodeRoomRate />
      </TabPane>
      <TabPane tab="会员等级" key="MBLEV">
        <CodeMemberLevel />
      </TabPane>
    </Tabs>
  </GridContent>
);

export default CodeConfig;
