import styles from './style.less';

const PrePayInfo = props => {
  const { orderInfo } = props;
  return (
    <>
      <div className={styles.infoTitle}>预收款信息</div>
      <div className={styles.infoContain}>
        <div>
          <span>预收款：</span>
          <span>0笔</span>
          <span style={{ marginLeft: '10px' }}>0.00</span>
        </div>
        <div>
          <span>余&emsp;额：</span>
          <span></span>
          <span style={{ marginLeft: '10px' }}>0.00</span>
        </div>
      </div>
    </>
  );
};

export default PrePayInfo;
