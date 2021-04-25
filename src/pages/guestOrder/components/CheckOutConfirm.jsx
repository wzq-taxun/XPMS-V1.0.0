import Constants from '@/constans';
import { checkOutJoinOrder } from '@/services/order';
import { Modal, Checkbox, message } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';

const CheckOutConfirm = props => {
  useEffect(() => {
    if (props.visible) {
      const tempOptions = [];
      const tempCheckList = [];
      props.orders &&
        props.orders.map(item => {
          tempOptions.push({ label: item.room_no || item.order_no, value: item.order_info_id });
          if (item.needSettle) {
            tempCheckList.push(item.order_info_id);
          }
        });

      setOptions(tempOptions);
      setCheckList(tempCheckList);
    }
  }, [props.visible]);

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [checkList, setCheckList] = useState([]);

  const onChange = checkedValues => {
    setCheckList(checkedValues);
  };

  const handleSubmit = () => {
    console.log(checkList);
    if (checkList && checkList.length > 0) {
      const { dispatch } = props;
      if (dispatch) {
        setLoading(true);
        dispatch({
          type: 'global/changeLoading',
          payload: true,
        });
        checkOutJoinOrder(checkList).then(rsp => {
          setLoading(false);
          dispatch({
            type: 'global/changeLoading',
            payload: false,
          });
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '退房成功');
            props.handleCancel();
          }
        });
      }
    }
  };

  return (
    <Modal
      title="退房"
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Checkbox.Group options={options} defaultValue={checkList} onChange={onChange} />
    </Modal>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(CheckOutConfirm);
