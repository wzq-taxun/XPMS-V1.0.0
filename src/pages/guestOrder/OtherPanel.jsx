import styles from './style.less';
import { useState } from 'react';
import { Row, Col, Modal, message } from 'antd';
import CheckIn from './components/otherInfo/CheckIn';
import LeaveWord from './components/otherInfo/LeaveWord';
import Remark from './components/otherInfo/Remark';
import pfSvg from '@/assets/order/pf.svg';
import rzSvg from '@/assets/order/rz.svg';
import zkxxSvg from '@/assets/order/zkxx.svg';
import lySvg from '@/assets/order/ly.svg';
import lyDisSvg from '@/assets/order/lyDis.svg';
import classNames from 'classnames';
import Logs from './components/otherInfo/Logs';
import ChangeRoom from './components/otherInfo/ChangeRoom';
import { getdoorlockalllist } from '@/services/doorlock';
import { cancel, checkOut, changeOrderType, sendPw, cancelArrange } from '@/services/order';
import Constants from '@/constans';
import { connect } from 'dva';
import JoinRoom from './components/otherInfo/JoinRoom';
const { confirm } = Modal;
import Dict from '@/dictionary';
import moment from 'moment';
import CheckOut from './components/CheckOut';
import Arrange from './components/otherInfo/Arrange';
import { useEffect } from 'react';

import JsonP from 'jsonp'

const OtherPanel = props => {
  const handleCancle = () => {
    setOtherOp(true);
  };

  useEffect(() => {
    setOtherOp(true);

    if (props.orderInfo.status == 'R') {
      if (props.orderInfo.room_no) {
        setArrangeDis(true);
        setCancelArrangeDis(false);
      } else {
        setArrangeDis(false);
        setCancelArrangeDis(true);
      }
    } else {
      setArrangeDis(true);
      setCancelArrangeDis(true);
    }
  }, [props.collapseInit, props.orderInfo && props.orderInfo.room_no]);

  const [otherOp, setOtherOp] = useState(true);
  const [otherCategory, setOtherCategory] = useState('rz');

  const [outVis, setOutVis] = useState(false);
  const [isCardopen, setIsCardopen] = useState(false)
  // -------------------------
  // 首次加载时调用当前的门锁类型接口来判断是否能使用置卡功能
  // ---------------------
  useEffect(() => {
    // 调用当前的门锁类型接口来判断是否能使用置卡功能
    getlockingty();
    // console.log(props.orderInfo)
  }, []);
  // 调用当前的门锁类型接口
  const getlockingty = () => {
    getdoorlockalllist().then(res => {
      console.log(res)
      if (res && res.code !== Constants.SUCCESS) return;
      // message.success('获取成功');
      if (res.data && res.data.type === 'TUYA' || res.data.type === 'HUOHE' || res.data.type === 'NOLOCK') {
        setIsCardopen(false)
      } else {
        setIsCardopen(true)
      }
    })
  }
  // 置卡功能接口
  const resetCardop = () => {
    // console.log('111')
    const { checkin_time, checkout_time, room_no_id } = props.orderInfo
    putCardstroy({ checkin_time, checkout_time, room_no_id: 126, }).then(res => {
      // console.log(res)
      if (res && res.code !== Constants.SUCCESS) return;
      console.log(res.data)
      // 发送制卡接口
      // ------------------------------
      // JsonP的跨域请求
      JsonP(res.data, {
        param: 'call_back'
      }, function (err, result) {
        console.log(err.Error)
        console.log(result)
        if(result === 'undefined') return  message.warning('制卡失败,请重新放入卡机制卡')
        if (result && result.code !== 0 ) return message.warning(result.message || '制卡失败,请重新放入卡机制卡')
        // message.success(result.message || '制卡成功')
      })
    })
  }
  const [arrangeDis, setArrangeDis] = useState(true); // 排房
  const [cancelArrangeDis, setCancelArrangeDis] = useState(true); // 取消排房

  const handleOtherOpClick = (op, dis) => {
    if (dis) return;

    if (op == 'ly') return;

    if (op == 'arrange') {
      if (orderInfo.status != 'R' || orderInfo.room_no) {
        return;
      }
    }

    if (op == 'cancelArrange') {
      cancelArrangeRoom();
      return;
    }

    if (op == 'cancelIn') {
      if (orderInfo.status == 'I') {
        if (props.accountCount < 1) {
          cancelInSubmit();
        }
      }
      return;
    }

    if (op == 'sendPw') {
      if (orderInfo.status == 'I') {
        sendPwMsg();
      }
      return;
    }
    // 开发票-----------------
    if (op == 'sendInvoice') {
      sendInvoicemsg();
      return;
    }
    // 点击置卡
    if (op == 'resetcard') {
      //  发起置卡接口请求
      resetCardop();
      return;
    }
    if (op == 'toHour') {
      if (orderInfo.order_type_id != Dict.hourTypeId) {
        const config = JSON.parse(sessionStorage.getItem('config')) || {};
        const hourStar =
          (config[Dict.hourStartConfCode] && config[Dict.hourStartConfCode].code) || 3;
        if (moment().isBefore(moment(orderInfo.checkin_time).add(parseInt(hourStar), 'hour'))) {
          toHourSubmit();
        }
      }
      return;
    }

    if (op == 'toGeneral') {
      if (orderInfo.order_type_id == Dict.hourTypeId) {
        toGeneralSubmit();
      }
      return;
    }

    if (orderInfo.status == 'R') {
      if (op == 'checkOut') {
        return;
      }
      if (op == 'changeRoom' && !props.orderInfo.room_no) {
        return;
      }
    } else if (orderInfo.status == 'I') {
      if (op == 'rz' || op == 'cancel') {
        return;
      }
    } else if (orderInfo.status == 'RG') {
      if (op != 'cancel' && op != 'log') {
        return;
      }
    } else {
      if (op != 'log' || op == 'bz') {
        return;
      }
    }

    if (op == 'cancel') {
      cancelOrder();
      return;
    } else if (op == 'checkOut') {
      checkOutSubmit();
      return;
    }

    setOtherOp(false);
    setOtherCategory(op);
  };

  // 点击开票出现弹框
  const sendInvoicemsg = () => {
    sethanshu();
  };
  // 取消预订
  const cancelOrder = () => {
    confirm({
      title: '取消订单?',
      content: '确认取消该订单?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          cancel(props.orderInfo.id).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message);
            }
          });
        }
      },
    });
  };

  // 退房
  const checkOutSubmit = () => {
    setOutVis(true);

    // confirm({
    //   title: '退房?',
    //   content: '确认退房?',
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk() {
    //     const { dispatch } = props;
    //     if (dispatch) {
    //       dispatch({
    //         type: 'global/changeLoading',
    //         payload: true,
    //       });
    //       checkOut(props.orderInfo.id).then(rsp => {
    //         dispatch({
    //           type: 'global/changeLoading',
    //           payload: false,
    //         });
    //         if (rsp && rsp.code == Constants.SUCCESS) {
    //           message.success(rsp.message);
    //         }
    //       });
    //     }
    //   },
    // });
  };

  // 取消入住
  const cancelInSubmit = () => {
    confirm({
      title: '取消入住?',
      content: '确认取消入住?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          cancel(props.orderInfo.id).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message);
            }
          });
        }
      },
    });
  };

  // 转钟点
  const toHourSubmit = () => {
    confirm({
      title: '转钟点?',
      content: '确认转钟点房?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          const { id: order_info_id, room_rate_id: code_room_rate } = props.orderInfo;
          changeOrderType({ order_info_id, code_room_rate }).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message);
            }
          });
        }
      },
    });
  };

  // 转普通
  const toGeneralSubmit = () => {
    confirm({
      title: '转普通?',
      content: '确认转普通房?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          const { id: order_info_id, room_rate_id: code_room_rate } = props.orderInfo;
          changeOrderType({ order_info_id, code_room_rate }).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message);
            }
          });
        }
      },
    });
  };

  // 发送门锁密码
  const sendPwMsg = () => {
    confirm({
      title: '发送密码?',
      content: '确认给客户发送门锁密码?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          sendPw(props.orderInfo.id).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message);
            }
          });
        }
      },
    });
  };

  // 取消排房
  const cancelArrangeRoom = () => {
    confirm({
      title: '取消排房?',
      content: '确认取消排房?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          cancelArrange(props.orderInfo.order_info_room_id).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message);
            }
          });
        }
      },
    });
  };

  const { orderInfo, sethanshu } = props;

  // 入住
  let checkInClass = styles.opContain;
  let checkInIcon = rzSvg;

  // 换房
  let changeRoomClass = classNames(styles.opContain, styles.disable);
  let changeRoomIcon = lyDisSvg;

  // 取消预订
  let cancelClass = classNames(styles.opContain, styles.disable);
  let cancelIcon = lyDisSvg;

  // 取消入住
  let cancelInClass = classNames(styles.opContain, styles.disable);
  let cancelInIcon = lyDisSvg;

  // 退房
  let checkOutClass = styles.opContain;
  let checkOutIcon = lySvg;

  // 联房
  let joinClass = styles.opContain;
  let joinIcon = lySvg;

  // 转钟点
  let toHour = styles.opContain;
  let toHourIcon = lySvg;

  // 转普通
  let toGeneral = styles.opContain;
  let toGeneralIcon = lySvg;

  // 备注
  let remarkClass = styles.opContain;
  let remarkIcon = lySvg;

  // 备注
  let sendPwClass = styles.opContain;
  let sendPwIcon = lySvg;

  if (orderInfo.order_type_id == Dict.hourTypeId) {
    toGeneral = styles.opContain;
    toGeneralIcon = lySvg;
    toHour = classNames(styles.opContain, styles.disable);
    toHourIcon = lyDisSvg;
  } else {
    toGeneral = classNames(styles.opContain, styles.disable);
    toGeneralIcon = lyDisSvg;

    const config = JSON.parse(sessionStorage.getItem('config')) || {};
    const hourStar = (config[Dict.hourStartConfCode] && config[Dict.hourStartConfCode].code) || 3;
    if (moment().isBefore(moment(orderInfo.checkin_time).add(parseInt(hourStar), 'hour'))) {
      toHour = styles.opContain;
      toHourIcon = lySvg;
    } else {
      toHour = classNames(styles.opContain, styles.disable);
      toHourIcon = lyDisSvg;
    }
  }

  if (orderInfo.status == 'I') {
    checkInClass = classNames(styles.opContain, styles.disable);
    changeRoomClass = styles.opContain;
    checkInIcon = lyDisSvg;
    changeRoomIcon = pfSvg;
    if (props.accountCount < 1) {
      cancelInClass = styles.opContain;
      cancelInIcon = lySvg;
    }
  } else if (orderInfo.status == 'R') {
    cancelClass = styles.opContain;
    cancelIcon = lySvg;
    checkOutClass = classNames(styles.opContain, styles.disable);
    checkOutIcon = lyDisSvg;
    if (props.orderInfo.room_no) {
      changeRoomClass = styles.opContain;
      changeRoomIcon = pfSvg;
    }
    sendPwClass = classNames(styles.opContain, styles.disable);
    sendPwIcon = lyDisSvg;
  } else {
    checkInClass = classNames(styles.opContain, styles.disable);
    checkInIcon = lyDisSvg;
    changeRoomClass = classNames(styles.opContain, styles.disable);
    changeRoomIcon = lyDisSvg;
    cancelClass = classNames(styles.opContain, styles.disable);
    cancelIcon = lyDisSvg;
    if (orderInfo.status == 'RG') {
      cancelClass = styles.opContain;
      cancelIcon = lySvg;
    }
    checkOutClass = classNames(styles.opContain, styles.disable);
    checkOutIcon = lyDisSvg;
    joinClass = classNames(styles.opContain, styles.disable);
    joinIcon = lyDisSvg;
    toHour = classNames(styles.opContain, styles.disable);
    toHourIcon = lyDisSvg;
    toGeneral = classNames(styles.opContain, styles.disable);
    toGeneralIcon = lyDisSvg;
    remarkClass = classNames(styles.opContain, styles.disable);
    remarkIcon = lyDisSvg;
    sendPwClass = classNames(styles.opContain, styles.disable);
    sendPwIcon = lyDisSvg;
  }

  return (
    <>
      {otherOp && (
        <>
          <Row type="flex" gutter={[16, 16]}>
            <Col
              span={12}
              className={
                arrangeDis ? classNames(styles.opContain, styles.disable) : styles.opContain
              }
              onClick={() => handleOtherOpClick('arrange', arrangeDis)}
            >
              <span>排&emsp;&emsp;房</span>
              <span>
                <img src={arrangeDis ? lyDisSvg : rzSvg} alt="" />
              </span>
            </Col>
            <Col
              span={12}
              className={
                cancelArrangeDis ? classNames(styles.opContain, styles.disable) : styles.opContain
              }
              onClick={() => handleOtherOpClick('cancelArrange', cancelArrangeDis)}
            >
              <span>取消排房</span>
              <span>
                <img src={cancelArrangeDis ? lyDisSvg : rzSvg} alt="" />
              </span>
            </Col>
            <Col span={12} className={checkInClass} onClick={() => handleOtherOpClick('rz')}>
              <span>入&emsp;&emsp;住</span>
              <span>
                <img src={checkInIcon} alt="" />
              </span>
            </Col>
            <Col
              span={12}
              className={changeRoomClass}
              onClick={() => handleOtherOpClick('changeRoom')}
            >
              <span>换&emsp;&emsp;房</span>
              <span>
                <img src={changeRoomIcon} alt="" />
              </span>
            </Col>
            <Col
              span={12}
              className={classNames(styles.opContain, styles.disable)}
              onClick={() => handleOtherOpClick('ly')}
            >
              <span>留&emsp;&emsp;言</span>
              <span>
                <img src={lyDisSvg} alt="" />
              </span>
            </Col>
            <Col span={12} className={remarkClass} onClick={() => handleOtherOpClick('bz')}>
              <span>备&emsp;&emsp;注</span>
              <span>
                <img src={remarkIcon} alt="" />
              </span>
            </Col>
            <Col span={12} className={cancelClass} onClick={() => handleOtherOpClick('cancel')}>
              <span>取&emsp;&emsp;消</span>
              <span>
                <img src={cancelIcon} alt="" />
              </span>
            </Col>
            <Col span={12} className={cancelInClass} onClick={() => handleOtherOpClick('cancelIn')}>
              <span>取消入住</span>
              <span>
                <img src={cancelInIcon} alt="" />
              </span>
            </Col>
            {/* <Col span={12} className={checkOutClass} onClick={() => handleOtherOpClick('checkOut')}>
              <span>退&emsp;&emsp;房</span>
              <span>
                <img src={checkOutIcon} alt="" />
              </span>
            </Col> */}
            <Col span={12} className={joinClass} onClick={() => handleOtherOpClick('joinRoom')}>
              <span>联&emsp;&emsp;房</span>
              <span>
                <img src={joinIcon} alt="" />
              </span>
            </Col>
            <Col span={12} className={styles.opContain} onClick={() => handleOtherOpClick('log')}>
              <span>日&emsp;&emsp;志</span>
              <span>
                <img src={lySvg} alt="" />
              </span>
            </Col>
            <Col span={12} className={toHour} onClick={() => handleOtherOpClick('toHour')}>
              <span>转钟点房</span>
              <span>
                <img src={toHourIcon} alt="" />
              </span>
            </Col>
            <Col span={12} className={toGeneral} onClick={() => handleOtherOpClick('toGeneral')}>
              <span>转普通房</span>
              <span>
                <img src={toGeneralIcon} alt="" />
              </span>
            </Col>
            <Col span={12} className={sendPwClass} onClick={() => handleOtherOpClick('sendPw')}>
              <span>发送密码</span>
              <span>
                <img src={sendPwIcon} alt="" />
              </span>
            </Col>
            <Col
              span={12}
              className={sendPwClass}
              onClick={() => handleOtherOpClick('sendInvoice')}
            >
              <span>发&emsp;&emsp;票</span>
              <span>
                <img src={sendPwIcon} alt="" />
              </span>
            </Col>
            {isCardopen ?
              <Col
                span={12}
                className={sendPwClass}
                onClick={() => handleOtherOpClick('resetcard')}
              >
                <span>制&emsp;&emsp;卡</span>
                <span>
                  <img src={sendPwIcon} alt="" />
                </span>
              </Col> : ""
            }
          </Row>
        </>
      )}
      {!otherOp && otherCategory == 'arrange' && (
        <Arrange {...orderInfo} handleCancle={handleCancle} />
      )}
      {!otherOp && otherCategory == 'rz' && <CheckIn {...orderInfo} handleCancle={handleCancle} />}
      {!otherOp && otherCategory == 'ly' && <LeaveWord handleCancle={handleCancle} />}
      {!otherOp && otherCategory == 'bz' && <Remark handleCancle={handleCancle} {...orderInfo} />}
      {!otherOp && otherCategory == 'log' && <Logs {...orderInfo} handleCancle={handleCancle} />}
      {!otherOp && otherCategory == 'changeRoom' && (
        <ChangeRoom orderInfo={orderInfo} handleCancle={handleCancle} />
      )}
      {!otherOp && otherCategory == 'joinRoom' && (
        <JoinRoom orderInfo={orderInfo} handleCancle={handleCancle} />
      )}
      <CheckOut orderInfo={orderInfo} visible={outVis} handleCancel={() => setOutVis(false)} />
    </>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(OtherPanel);
