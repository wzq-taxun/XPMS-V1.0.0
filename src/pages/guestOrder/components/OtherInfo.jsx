import styles from './style.less';

const OtherInfo = props => {
  const { orderInfo } = props;
  return (
    <>
      <div className={styles.infoTitle}>其他信息</div>
      <div className={styles.infoContain}>
        <div>
          <span>订&ensp;单&ensp;号：</span>
          <span>{orderInfo.order_no}</span>
        </div>
        <div>
          <span>备&emsp;&emsp;注：</span>
          <span>{orderInfo.order_desc}</span>
        </div>
        <div>
          <span>下单时间：</span>
          <span>{orderInfo.create_time}</span>
        </div>
        <div>
          <span>创&ensp;建&ensp;人：</span>
          <span>{orderInfo.operator}</span>
        </div>
      </div>
    </>
  );
};

export default OtherInfo;
