import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import logo from '../assets/mcsj.svg';
import styles from './UserLayout.less';
import lfLogo from '@/assets/background_left.png';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.login}>
            <div className={styles.login_left}>
              <img src={lfLogo} />
            </div>
            <div className={styles.login_right}>
              <div className={styles.top}>
                <div className={styles.header}>
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>名巢未来酒店</span>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
