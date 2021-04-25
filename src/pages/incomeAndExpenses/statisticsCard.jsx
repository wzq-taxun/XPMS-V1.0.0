import styles from './style.less';
import { Divider, Icon } from 'antd';

const StatisticsCard = props => {
  const dividerSty = { margin: '10px 5px', minWidth: 'inherit', width: 'calc(100% - 10px)' };

  const { flag } = props;

  return (
    <>
      <div className={styles.leftCard}>
        <div className={styles.top}>
          <div
            className={styles.avatar}
            style={{
              background: props.avatarBg || 'inherit',
            }}
          >
            {props.avatar}
          </div>
          <span>{props.category}</span>
        </div>

        <p>￥{props.total}</p>
        <Divider style={dividerSty} />
        <div className={styles.floor}>
          <span>较昨日</span>
          <span>{props.rate}</span>
          {flag && (
            <span className={styles[flag]}>
              <Icon type={`arrow-${flag}`} />
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default StatisticsCard;
