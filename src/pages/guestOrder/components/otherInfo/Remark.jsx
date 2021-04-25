import styles from '../style.less';
import { Row, Col, Select, Input, Button, message } from 'antd';
import { useState } from 'react';
import { checkInSubmit } from '@/services/checkIn';
import Constants from '@/constans';
import { connect } from 'dva';
const { Option } = Select;
const { TextArea } = Input;

const Remark = props => {
  const [memo, setMemo] = useState(props.order_desc);

  const handleSubmit = () => {
    const order = {
      order_info: {
        id: props.id,
        order_desc: memo,
      },
    };

    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLoading',
        payload: true,
      });
      console.log(order);
      checkInSubmit(order).then(rsp => {
        dispatch({
          type: 'global/changeLoading',
          payload: false,
        });
        if (rsp && rsp.code == Constants.SUCCESS) {
          console.log(rsp);
          message.info('更新成功');
          props.handleCancle();
        }
      });
    }
  };

  return (
    <>
      <Row style={{ marginTop: '10px' }}>
        <Col span={8}>备注：</Col>
        <Col span={16}>
          <TextArea rows={4} value={memo} onChange={e => setMemo(e.target.value)} />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col offset={8}>
          <Button onClick={props.handleCancle}>取消</Button>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => handleSubmit()}>
            确认
          </Button>
        </Col>
      </Row>
    </>
  );
};
export default connect(({ global }) => ({ loading: global.loading }))(Remark);
