import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import styles from './style.less';
import { useState } from 'react';
import BaseView from './components/BaseView';
import SecurityView from './components/SecurityView';
const { Item } = Menu;

const UserCenter = props => {
  const [selectKey, setSelectKey] = useState('base');

  const renderChildren = () => {
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView />;
      default:
        break;
    }
    return null;
  };

  const menuMap = {
    base: '基本设置',
    security: '安全设置',
  };

  const getMenu = () => {
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  const getRightTitle = () => {
    return menuMap[selectKey];
  };
  return (
    <GridContent>
      <div className={styles.main}>
        <div className={styles.leftMenu}>
          <Menu mode="inline" selectedKeys={[selectKey]} onClick={({ key }) => setSelectKey(key)}>
            {getMenu()}
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>{getRightTitle()}</div>
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  );
};
export default UserCenter;
