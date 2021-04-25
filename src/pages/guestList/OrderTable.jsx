import styles from './style.less';
import { router } from 'umi';
import { useState } from 'react';
import { getOrders } from '@/services/order';
import ProTable from '@ant-design/pro-table';

const OrderTable = props => {
  const handleReserveClick = record => {
    router.push({ pathname: 'orderDetail', query: { orderId: record.id } });
  };

  const [total, setTotal] = useState(0);

  return (
    <ProTable
      // search={{
      //   collapseRender: (collapsed, showCollapseButton) => {
      //     document.getElementsByClassName('ant-pro-table-form-search').style.height = "60px"
      //   }
      // }}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      rowClassName={styles.rowSty}
      className={styles.mytable}
      columns={props.columns}
      request={(params, sort) => {
        const { checkin_range, checkout_range, ...rest } = params || {};
        let query = rest || {};
        if (checkin_range && checkin_range.length == 2) {
          query.checkin_start = checkin_range[0];
          query.checkin_end = checkin_range[1];
        }
        if (checkout_range && checkout_range.length == 2) {
          query.checkout_start = checkout_range[0];
          query.checkout_end = checkout_range[1];
        }
        query.type = props.type;
        if (sort) {
          Object.keys(sort).forEach(key => {
            query.field = key;
          });
          query.sort = sort[query.field] == 'ascend' ? 'asc' : 'desc';
        }
        return getOrders(query);
      }}
      postData={data => {
        setTotal(data.count);
        return data.list;
      }}
      pagination={{ total: total, defaultPageSize: 20 }}
      onRow={record => {
        return {
          onClick: e => {
            handleReserveClick(record);
          },
        };
      }}
    />
  );
};

export default OrderTable;
