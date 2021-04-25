import styles from './style.less';
import { useEffect } from 'react';
import Dict from '@/dictionary';
import { useState } from 'react';
import { getMemberCard } from '@/services/member';
import Constants from '@/constans';

const MarketInfo = props => {
  const { orderInfo } = props;

  const [cardNo, setCardNo] = useState(null);
  useEffect(() => {
    if (orderInfo.guest_type_id == Dict.guestType[1].id) {
      getMemberCard({ id: orderInfo.member_card_id }).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          const card_no = data[0] && data[0].card_no;
          setCardNo(card_no);
        }
      });
    }
  }, [orderInfo.member_card_id]);

  return (
    <>
      <div className={styles.infoTitle}>市场营销</div>
      <div className={styles.infoContain}>
        {/* {orderInfo.status == 'I' && ( */}
        {/* <> */}
        <div>
          <span>市&emsp;场：</span>
          <span>{orderInfo.market}</span>
        </div>
        <div>
          <span>来&emsp;源：</span>
          <span>{orderInfo.source}</span>
        </div>
        {/* </> */}
        {/* )} */}
        <div>
          <span>房价码：</span>
          <span>{orderInfo.code_rate_desc}</span>
        </div>
        <div>
          <span>房&emsp;价：</span>
          <span>{orderInfo.room_reality_rate}</span>
        </div>
        <div>
          <span>销售员：</span>
          <span>{orderInfo.sales_man}</span>
        </div>
        {orderInfo.guest_type_id == Dict.guestType[1].id && (
          <div>
            <span>会员卡：</span>
            <span>{cardNo}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default MarketInfo;
