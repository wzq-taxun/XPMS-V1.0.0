import styles from './style.less';
import { router } from 'umi';

const SubHeader = props => {
  return (
    <div style={{ padding: '8px' }}>
      您共有{props.count > 0 ? props.count - 1 : props.count}个联房信息
      {/* <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => router.push('roomStatus')}>
        退出
      </span> */}
    </div>
  );
};

export default SubHeader;
