import { Component } from 'react';
import {
  Tabs,
  Icon,
  Card,
  Form,
  Radio,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  InputNumber,
  message,
  Spin,
  Modal,
  Button,
  Switch,
} from 'antd';
import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import TableForm from './TableForm';
import moment from 'moment';
import {
  getCompanyInfo,
  getMedium,
  getRoomType,
  getRoomNo,
  checkInSubmit,
  getMarket,
  getSource,
  getCanal,
  getRoomRateCode,
  getRoomRate,
  getSalesMan,
  getActivity,
  getPreferReason,
  getPackages,
  getMemberMarket,
  getCompanyMarket,
} from '@/services/checkIn';
import Constans from '@/constans';
import { router } from 'umi';
import Dict from '@/dictionary';
import { getPrePayAccountType } from '@/services/account';
import { getMemberCard } from '@/services/member';
import { openPostWindow } from '@/utils/openPost';
import Constants from '@/constans';
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

class CheckIn extends Component {
  state = {
    loading: false,
    current: 'day', //当前入住类型 day全日房 hour钟点房  hire长包房 rent长租房
    userType: 1,
    tabs: 1,
    orderTypeObj: {},
    orderTypeIds: [], //订单类型  全日 钟点 长包 长租
    guestTypeObj: {},
    guestTypeIds: [], //顾客类型 散客 会员 协议公司 中介/旅行社 依次ID 用于其他接口使用
    marketArr: [], //市场
    marketObj: {},
    market: '', //市场码
    sourceArr: [], //来源
    sourceObj: {},
    canalsArr: [], //渠道
    canalsObj: {},
    reserveTypeArr: [], //预定类型
    salesManArr: [], //销售员
    roomType: [], //房型
    rooms: [], //房价
    roomNo: null,
    roomPriceCode: [], //房价码
    activityArr: [], //活动
    activityCode: '', //活动码
    roomRateCode: null,
    roomRateDesc: null,
    preferReasonArr: [], //优惠理由
    preferReasonObj: {},
    packagesArr: [], //包价
    packagesObj: {},
    xygs: [], //协议公司
    initCompanyId: null,
    travelAgencyArr: [], //中介旅行社
    initTravelId: null,
    member_card_id: null,
    member_card_no: null,
    member_balance: 0,
    payTypeArr: [],
    hourStar: 1,
    latestLeave: ['14', '00', '00'], // 最晚离店 时 分 秒
    memberAccount: null,
    isMember: false,
    memberCardId: null,
    isWechat: false,
    isScan: false,
    wechatAccount: null,
  };

  componentDidMount() {
    this.getHourConfig();
    this.getLatestCheckOut();

    this.getOrderType();
    this.getGuestType();

    this.getSource();

    this.getCanal();

    this.getCompanyInfo();

    this.getTravelAgency();

    this.getSalesMan();

    this.getRoomType();

    this.getPreferReason();

    this.getPackages();

    this.getPayWays();
  }

  // 钟点房默认起步时间
  getHourConfig = () => {
    const config = JSON.parse(sessionStorage.getItem('config')) || {};
    const hourStar = (config[Dict.hourStartConfCode] && config[Dict.hourStartConfCode].code) || 1;
    this.setState({ hourStar });
  };

  // 默认退房时间
  getLatestCheckOut = () => {
    const config = JSON.parse(sessionStorage.getItem('config')) || {};
    const checkOutConf = config[Dict.checkOutConfCode] && config[Dict.checkOutConfCode].code;
    if (checkOutConf) {
      const latestLeave = checkOutConf.split(':');
      if (latestLeave.length == 3) {
        this.setState({ latestLeave });
      }
    }
  };

  // 订单类型 全日 钟点 长包 长租
  getOrderType = () => {
    const data = Dict.orderType;
    if (data && data instanceof Array) {
      const orderTypeObj = {};
      const orderTypeIds = [];
      data.map(item => {
        if (item.code == 'YD001') {
          // 全日
          orderTypeIds[0] = item.id;
        } else if (item.code == 'YD002') {
          // 钟点
          orderTypeIds[1] = item.id;
        } else if (item.code == 'YD004') {
          // 长包
          orderTypeIds[2] = item.id;
        } else if (item.code == 'YD003') {
          // 长租
          orderTypeIds[3] = item.id;
        }
        orderTypeObj[item.id] = item;
      });
      this.setState({ orderTypeObj, orderTypeIds });
    }
  };

  // 客人类型 散客 会员 协议 中旅
  getGuestType = () => {
    const data = Dict.guestType;

    if (data && data instanceof Array) {
      const guestTypeObj = {};
      const guestTypeIds = [];
      data.map(item => {
        if (item.code == 'FIT') {
          guestTypeIds[0] = item.id;
        } else if (item.code == 'MEM') {
          guestTypeIds[1] = item.id;
        } else if (item.code == 'COR') {
          guestTypeIds[2] = item.id;
        } else if (item.code == 'GT004') {
          guestTypeIds[3] = item.id;
        }
        guestTypeObj[item.id] = item;
      });
      this.setState({ guestTypeObj, guestTypeIds });

      this.getMarket(guestTypeIds[0]);
    }
  };

  // 获取支付方式
  getPayWays = () => {
    getPrePayAccountType().then(rsp => {
      const data = rsp.data || [];
      this.setState({ payTypeArr: data });

      const memberArr = data.filter(item => item.account_detail_type == Dict.accountCode.member);
      if (memberArr && memberArr.length > 0) {
        this.setState({ memberAccount: memberArr[0] });
      }

      const scanAccountArr = data.filter(
        item => item.account_detail_type == Dict.accountCode.wechat,
      );
      if (scanAccountArr && scanAccountArr.length > 0) {
        this.setState({ wechatAccount: scanAccountArr[0] });
      }

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        payWay: data[0] && data[0].id,
      });
    });
  };

  // 获取协议公司
  getCompanyInfo = () => {
    getCompanyInfo().then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const data = rsp.data;
        this.setState({ xygs: data || [] });
      }
    });
  };

  // 获取中介旅行社
  getTravelAgency = () => {
    getMedium().then(rsp => {
      const data = rsp.data;
      this.setState({ travelAgencyArr: data || [] });
    });
  };

  //获取市场
  getMarket = (guest_type_id, company_id) => {
    if (!guest_type_id) {
      const guestTypeIds = this.state.guestTypeIds;
      guest_type_id = guestTypeIds[this.state.userType - 1];
    }

    const param = { guest_type_id, company_id };
    getMarket(param).then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const data = rsp.data || [];

        const latestLeaveStr = (data[0] && data[0].default_checkout_time) || '14:00:00';
        let latestLeave = latestLeaveStr.split(':');
        if (latestLeave.length != 3) {
          latestLeave = ['14', '00', '00'];
        }

        this.setState({
          marketArr: data,
          market: data[0] && data[0].code,
          latestLeave,
        });

        const {
          form: { getFieldValue, setFieldsValue },
        } = this.props;

        const checkOutTime = getFieldValue('checkout_time');
        if (checkOutTime) {
          if (this.state.current == 'hour') {
            const checkInTime = getFieldValue('checkin_time');
            checkOutTime
              .hour(parseInt(checkInTime.hour()) + parseInt(this.state.hourStar))
              .minute(checkInTime.minute())
              .second(checkInTime.second());
          } else {
            checkOutTime
              .hour(latestLeave[0])
              .minute(latestLeave[1])
              .second(latestLeave[2]);
          }

          setFieldsValue({
            checkout_time: checkOutTime,
          });
        }

        setFieldsValue({
          market_id: data[0] && data[0].id,
          // checkout_time: checkOutTime,
        });

        this.getRoomRateCode(data[0] && data[0].id);
      }
    });
  };

  getMemberMarkData = card_no => {
    getMemberMarket(card_no).then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const data = rsp.data || [];

        const latestLeaveStr = (data[0] && data[0].default_checkout_time) || '14:00:00';
        let latestLeave = latestLeaveStr.split(':');
        if (latestLeave.length != 3) {
          latestLeave = ['14', '00', '00'];
        }

        this.setState({
          marketArr: data,
          market: data[0] && data[0].code,
          latestLeave,
        });

        const {
          form: { getFieldValue, setFieldsValue },
        } = this.props;

        const checkOutTime = getFieldValue('checkout_time');
        if (checkOutTime) {
          if (this.state.current == 'hour') {
            const checkInTime = getFieldValue('checkin_time');
            checkOutTime
              .hour(parseInt(checkInTime.hour()) + parseInt(this.state.hourStar))
              .minute(checkInTime.minute())
              .second(checkInTime.second());
          } else {
            checkOutTime
              .hour(latestLeave[0])
              .minute(latestLeave[1])
              .second(latestLeave[2]);
          }

          setFieldsValue({
            checkout_time: checkOutTime,
          });
        }

        setFieldsValue({
          market_id: data[0] && data[0].id,
          // checkout_time: checkOutTime,
        });

        this.getRoomRateCode(data[0] && data[0].id);
      }
    });
  };

  getCompanyMarkData = company_info_id => {
    getCompanyMarket(company_info_id).then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const data = rsp.data || [];

        const latestLeaveStr = (data[0] && data[0].default_checkout_time) || '14:00:00';
        let latestLeave = latestLeaveStr.split(':');
        if (latestLeave.length != 3) {
          latestLeave = ['14', '00', '00'];
        }

        this.setState({
          marketArr: data,
          market: data[0] && data[0].code,
          latestLeave,
        });

        const {
          form: { getFieldValue, setFieldsValue },
        } = this.props;

        const checkOutTime = getFieldValue('checkout_time');
        if (checkOutTime) {
          if (this.state.current == 'hour') {
            const checkInTime = getFieldValue('checkin_time');
            checkOutTime
              .hour(parseInt(checkInTime.hour()) + parseInt(this.state.hourStar))
              .minute(checkInTime.minute())
              .second(checkInTime.second());
          } else {
            checkOutTime
              .hour(latestLeave[0])
              .minute(latestLeave[1])
              .second(latestLeave[2]);
          }

          setFieldsValue({
            checkout_time: checkOutTime,
          });
        }

        setFieldsValue({
          market_id: data[0] && data[0].id,
          // checkout_time: checkOutTime,
        });

        this.getRoomRateCode(data[0] && data[0].id);
      }
    });
  };

  //获取来源
  getSource = () => {
    getSource().then(rsp => {
      const data = rsp.data;
      if (!data) return;
      const sourceObj = {};
      if (data instanceof Array) {
        data.map(source => {
          sourceObj[source.id] = source;
        });
      }

      this.setState({
        sourceArr: data || [], //来源
        sourceObj,
      });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        source_id: data[0] && data[0].id,
      });
    });
  };

  //获取渠道
  getCanal = () => {
    getCanal().then(rsp => {
      const data = rsp.data;
      if (!data) return;
      const canalsObj = {};
      if (data instanceof Array) {
        data.map(canals => {
          canalsObj[canals.id] = canals;
        });
      }

      this.setState({
        canalsArr: data || [], //渠道
        canalsObj,
      });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        canals_id: data[0] && data[0].id,
      });
    });
  };

  // 获取房型
  getRoomType = () => {
    getRoomType().then(rsp => {
      const data = rsp.data || [];
      this.setState({ roomType: data || [] });
      const {
        form: { setFieldsValue },
      } = this.props;
      const roomTypeId =
        (this.props.location.state && this.props.location.state.room_type_id) ||
        (data[0] && data[0].id);

      setFieldsValue({
        room_type_id: roomTypeId,
      });

      this.getRoomNo(roomTypeId);
      this.getRoomRate(data[0] && data[0].id, null, null, null);
    });
  };

  // 获取房号
  getRoomNo = (roomTypeId, checkin_time, checkout_time) => {
    const {
      form: { getFieldValue },
    } = this.props;
    roomTypeId = roomTypeId || getFieldValue('room_type_id');
    checkin_time = checkin_time || getFieldValue('checkin_time');
    checkout_time = checkout_time || getFieldValue('checkout_time');
    if (!roomTypeId || !roomTypeId || !checkout_time) {
      return;
    }

    getRoomNo({
      room_type_id: roomTypeId,
      checkin_time: checkin_time.format('YYYY-MM-DD HH:mm:ss'),
      checkout_time: checkout_time.format('YYYY-MM-DD HH:mm:ss'),
    }).then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const rooms = rsp.data;
        this.setState({ rooms, room_no: rooms && rooms[0] && rooms[0].room_no });
        const {
          form: { setFieldsValue },
        } = this.props;
        const room_no_id =
          (this.props.location.state && this.props.location.state.room_no_id) ||
          (rooms[0] && rooms[0].id);
        setFieldsValue({
          room_no_id: room_no_id,
        });
      }
    });
  };

  // 获取房价码
  getRoomRateCode = (market_id, order_type_id, guest_type_id) => {
    if (!market_id) {
      const {
        form: { getFieldValue },
      } = this.props;
      market_id = getFieldValue('market_id');
    }

    if (!order_type_id) {
      const { current, orderTypeIds } = this.state;
      if (current == 'day') {
        order_type_id = orderTypeIds[0];
      } else if (current == 'hour') {
        order_type_id = orderTypeIds[1];
      } else if (current == 'hire') {
        order_type_id = orderTypeIds[2];
      } else if (current == 'rent') {
        order_type_id = orderTypeIds[3];
      }
    }

    if (!guest_type_id) {
      const { userType, guestTypeIds } = this.state;
      guest_type_id = guestTypeIds[userType - 1];
    }

    const param = { market_id, order_type_id, guest_type_id };
    getRoomRateCode(param).then(rsp => {
      const {
        form: { setFieldsValue },
      } = this.props;
      if (rsp && rsp.code === Constans.SUCCESS) {
        const priceCode = rsp.data;
        this.setState({
          roomPriceCode: priceCode || [],
          roomRateCode: priceCode[0] && priceCode[0].code,
          roomRateDesc: priceCode[0] && priceCode[0].description,
        });

        const roomRateId = priceCode && priceCode[0] && priceCode[0].id;
        setFieldsValue({
          room_rate_code: roomRateId,
        });

        this.getRoomRate(null, roomRateId, null, null);
      } else {
        setFieldsValue({
          room_rate_code: null,
          room_reality_rate: null,
          room_rate: null,
        });
      }
    });
  };

  // 获取房价
  getRoomRate = (room_type_id, code_room_rate_id, date_start_end, date_end_sta) => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    room_type_id = room_type_id || getFieldValue('room_type_id');
    code_room_rate_id = code_room_rate_id || getFieldValue('room_rate_code');
    date_start_end = date_start_end || getFieldValue('checkin_time');
    date_end_sta = date_end_sta || getFieldValue('checkout_time');
    if (!room_type_id || !code_room_rate_id) {
      setFieldsValue({
        room_reality_rate: null,
        room_rate: null,
      });
      return;
    }
    const param = {
      room_type_id,
      code_room_rate_id,
      date_start_end: date_start_end.format('YYYY-MM-DD HH:mm:ss'),
      date_end_sta: date_end_sta.format('YYYY-MM-DD HH:mm:ss'),
    };
    getRoomRate(param).then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const {
          form: { setFieldsValue },
        } = this.props;
        const data = rsp.data;
        setFieldsValue({
          room_reality_rate: data,
          room_rate: data,
        });
      } else {
        setFieldsValue({
          room_reality_rate: null,
          room_rate: null,
        });
      }
    });
  };

  // 获取活动码
  getActivity = () => {
    getActivity().then(rsp => {
      const activitys = rsp.data;
      this.setState({
        activityArr: activitys || [],
        activityCode: activitys[0] && activitys[0].code,
      });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        activity_code: activitys[0] && activitys[0].id,
      });
    });
  };

  // 获取销售员
  getSalesMan = () => {
    getSalesMan().then(rsp => {
      const salesMans = rsp.data || [];
      this.setState({ salesManArr: salesMans });
      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({ sales_man_id: salesMans[0] && salesMans[0].id });
    });
  };

  getPreferReason = () => {
    getPreferReason().then(rsp => {
      this.setState({
        preferReasonArr: rsp.data || [],
      });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        prefer_reason_id: rsp.data && rsp.data[0] && rsp.data[0].id,
      });
    });
  };

  getPackages = () => {
    getPackages().then(rsp => {
      this.setState({
        packagesArr: rsp.data || [], //包价
      });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        packages_id: rsp.data && rsp.data[0] && rsp.data[0].id,
      });
    });
  };

  // 客户类型选择事件
  handRadioChange = e => {
    const userType = e.target.value;
    let company_id = 0;

    this.setState({
      userType: userType,
    });

    if (userType == 2) {
      this.setState({
        marketArr: [],
        market: null,
        roomPriceCode: [],
        roomRateCode: null,
        roomRateDesc: null,
      });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        market_id: null,
        room_rate_code: null,
        room_reality_rate: null,
        room_rate: null,
      });
    } else if (userType == 3) {
      company_id = this.state.xygs[0] && this.state.xygs[0].id;
      this.setState({ initCompanyId: company_id });
      this.props.form.setFieldsValue({ company_info_id: company_id });
      this.getCompanyMarkData(company_id);
    } else if (userType == 4) {
      company_id = this.state.travelAgencyArr[0] && this.state.travelAgencyArr[0].id;
      this.setState({ initTravelId: company_id });
      this.props.form.setFieldsValue({ company_info_id: company_id });
      this.getCompanyMarkData(company_id);
    } else {
      const guest_type_id = this.state.guestTypeIds[userType - 1];
      this.getMarket(guest_type_id, company_id);
    }
  };

  // 数字输入框两侧添加减小按钮
  handDaysInputNumChange = type => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const days = getFieldValue('days');
    if (days == 1 && type == 'subtract') return;
    const arriveTime = getFieldValue('checkin_time');
    setFieldsValue({ checkin_time: arriveTime });
    const leaveTime = getFieldValue('checkout_time');
    let newLeaveTime = leaveTime;
    if ('add' == type) {
      setFieldsValue({ days: days + 1 });
      if (this.state.current == 'hour') {
        newLeaveTime = leaveTime.add(1, 'hour');
      } else {
        newLeaveTime = leaveTime
          .add(1, 'day')
          .hour(this.state.latestLeave[0])
          .minute(this.state.latestLeave[1])
          .second(this.state.latestLeave[2]);
        // .hour(14)
        // .startOf('hour');
      }
    } else if ('subtract' == type) {
      setFieldsValue({ days: days - 1 });
      if (this.state.current == 'hour') {
        newLeaveTime = leaveTime.add(-1, 'hour');
      } else {
        newLeaveTime = leaveTime
          .add(-1, 'day')
          .hour(this.state.latestLeave[0])
          .minute(this.state.latestLeave[1])
          .second(this.state.latestLeave[2]);
        // .hour(14)
        // .startOf('hour');
      }
    }
    setFieldsValue({ checkout_time: newLeaveTime });
  };

  // 天数输入更改离店时间
  handChangeDays = value => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const arriveTime = getFieldValue('checkin_time');
    setFieldsValue({ checkin_time: arriveTime });
    const temp = moment(arriveTime);
    if (this.state.current == 'hour') {
      setFieldsValue({ checkout_time: temp.add(value, 'h') });
    } else {
      setFieldsValue({
        checkout_time: temp
          .add(value, 'd')
          .hour(this.state.latestLeave[0])
          .minute(this.state.latestLeave[1])
          .second(this.state.latestLeave[2]),
        // .hour(14)
        // .startOf('hour'),
      });
    }
  };

  // 到达时间调整天数
  handChangeArrive = date => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const leaveTime = getFieldValue('checkout_time');
    setFieldsValue({ checkout_time: leaveTime });
    const tempLeave = moment(leaveTime);
    const tempArrive = moment(date);
    if (this.state.current == 'hour') {
      //钟点房
      const count = tempLeave.startOf('hour').diff(tempArrive.startOf('hour'), 'hour');
      setFieldsValue({ days: count });
    } else {
      const count = tempLeave.startOf('day').diff(tempArrive.startOf('day'), 'day');
      setFieldsValue({ days: count });
    }

    this.getRoomRate(null, null, date, null);
  };

  // 离店时间调整天数
  handChangeLeave = date => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const arriveTime = getFieldValue('checkin_time');
    setFieldsValue({ checkin_time: arriveTime });
    const tempArrive = moment(arriveTime);
    const tempLeave = moment(date);
    if (this.state.current == 'hour') {
      //钟点房
      const count = tempLeave.startOf('hour').diff(tempArrive.startOf('hour'), 'hour');
      setFieldsValue({ days: count });
    } else {
      const count = tempLeave.startOf('day').diff(tempArrive.startOf('day'), 'day');
      setFieldsValue({ days: count });
    }

    this.getRoomRate(null, null, null, date);
  };

  disabledDate = current => {
    if (current) {
      const tempCurrent = moment()
        .year(current.year())
        .month(current.month())
        .date(current.date());
      return tempCurrent.endOf('date') < moment().endOf('date');
    } else {
      return false;
    }
    // return current && current.endOf('day') < moment().endOf('day');
  };

  // 提交
  handleSubmit = () => {
    const {
      form: { getFieldValue, getFieldsValue },
    } = this.props;

    const formValues = getFieldsValue();
    const days = getFieldValue('days');
    const guestsTemp = getFieldValue('guests');
    const guests = guestsTemp.filter(
      guest => guest.guest_base_id && guest.name && guest.credential_no && guest.name.length <= 20,
    );

    if (guests.length < 1) {
      message.error('有效住客信息为空');
      return;
    }
    let checkGuest = true;
    guests.map(item => {
      const idCardNoReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (idCardNoReg.test(item.credential_no) === false) {
        message.error('身份证格式不正确');
        checkGuest = false;
      }
      // const phoneReg = /(^\d{11}$)/;
      // if (phoneReg.test(item.phone_number) === false) {
      //   message.error('电话格式不正确');
      //   checkGuest = false;
      // }
      if (!item.sex) {
        const sexStr = item.credential_no.charAt(item.credential_no.length - 2);
        if (parseInt(sexStr) % 2 == 0) {
          item.sex = '2';
        } else {
          item.sex = '1';
        }
      }
      if (!item.birthday) {
        const birth = item.credential_no.substring(6, 14);
        item.birthday = moment(birth).format('YYYY-MM-DD HH:mm:ss');
      }
    });
    if (!checkGuest) {
      return;
    }
    if (!formValues.room_rate_code) {
      message.error('房价码不能为空');
      return;
    }
    if (!formValues.room_no_id) {
      message.error('房号不能为空');
      return;
    }
    if (
      formValues.room_reality_rate == null ||
      formValues.room_reality_rate == undefined ||
      formValues.room_rate == null ||
      formValues.room_rate == undefined
    ) {
      message.error('房价不能为空');
      return;
    }

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    let days_num = 0;
    let hours_num = 0;

    const { guestTypeIds, userType, orderTypeIds, current } = this.state;
    let order_type_id = 0;
    if (current == 'day') {
      order_type_id = orderTypeIds[0];
      days_num = days;
    } else if (current == 'hour') {
      order_type_id = orderTypeIds[1];
      hours_num = days;
    } else if (current == 'hire') {
      order_type_id = orderTypeIds[2];
      days_num = days;
    } else if (current == 'rent') {
      order_type_id = orderTypeIds[3];
      days_num = days;
    }
    const orderInfo = {
      company_info_id: formValues.company_info_id || 0, //协议单位ID
      create_user: currentUser.id,
      guest_type_id: (guestTypeIds && guestTypeIds[userType - 1]) || 0, //客户类型
      hotel_group_id: currentUser.hotel_group_id,
      hotel_id: currentUser.hotel_id,
      market_id: formValues.market_id,
      member_id: 0,
      order_desc: formValues.order_desc,
      order_no: '0',
      order_price: 0,
      order_type_id,
      prefer_reason_id: formValues.prefer_reason_id, //优惠理由
      reserve_name: guests[0].name,
      reserve_tel: guests[0].phone_number,
      retain_time: formValues.checkout_time.format('YYYY-MM-DD HH:mm:ss'),
      room_nums: 1,
      sales_man_id: formValues.sales_man_id,
      source_id: formValues.source_id,
      canals_id: formValues.canals_id, //渠道码
      status: 'I',
    };

    if (userType == 2) {
      orderInfo.member_card_id = this.state.member_card_id;
    }

    const room = {
      checkin_time: formValues.checkin_time.format('YYYY-MM-DD HH:mm:ss'), //入住时间
      checkout_time: formValues.checkout_time.format('YYYY-MM-DD HH:mm:ss'), //离店时间
      hotel_group_id: currentUser.hotel_group_id,
      hotel_id: currentUser.hotel_id,
      prefer_reason_id: formValues.prefer_reason_id, //优惠理由
      room_no_id: formValues.room_no_id,
      room_rate: formValues.room_rate,
      room_rate_id: formValues.room_rate_code,
      room_reality_rate: formValues.room_reality_rate,
      room_type_id: formValues.room_type_id,
      days_num,
      hours_num,
    };

    let packages = [];
    const packagesArr = formValues.packages_id;
    if (packagesArr instanceof Array) {
      packagesArr.map(item => {
        let temp = {
          packages_id: item,
          room_no_id: formValues.room_no_id,
        };
        packages.push(temp);
      });
    } else {
      packages = [
        {
          packages_id: packagesArr,
          room_no_id: formValues.room_no_id,
        },
      ];
    }

    let account_detail_type = '';
    let account_code = '';
    let description = '';
    const payTypeArr = this.state.payTypeArr;
    payTypeArr &&
      payTypeArr.map(item => {
        if (item.id == formValues.payWay) {
          account_detail_type = item.account_detail_type;
          account_code = item.account_code;
          description = item.description;
        }
      });

    let pay_account_no = formValues.pay_account_no;
    if (this.state.isWechat && this.state.isScan) {
      pay_account_no = 'PayCode-' + pay_account_no;
    }

    const account = {
      account_code_id: formValues.payWay,
      account_detail_type,
      account_code,
      description,
      audit_date: formValues.checkout_time.format('YYYY-MM-DD HH:mm:ss'),
      charge: formValues.money || 0,
      company_id: 0, //?
      credit_charge: formValues.money || 0,
      debit_charge: 0,
      goods_type_id: 0,
      hotel_group_id: currentUser.hotel_group_id,
      hotel_id: currentUser.hotel_id,
      lock_user: 0,
      member_card_id: 0,
      operate_user: currentUser.id,
      price: 0,
      quantity: 0,
      room_no_id: formValues.room_no_id,
      status: '1',
      summary: '',
      work_shift: currentUser.shift,
      pay_account_no,
      // create_user: currentUser.id,
      // modify_user: currentUser.id,
      // account_code_id: formValues.payWay,
    };

    if (account_detail_type == Dict.accountCode.member) {
      if (formValues.money > 0 && formValues.balance < formValues.money) {
        message.error('会员卡余额不足');
        return;
      }
      let memberCardId = this.state.memberCardId;
      if (!memberCardId) {
        if (formValues.pay_card_no == formValues.card_no) {
          memberCardId = this.state.member_card_id;
        } else {
          message.error('请正确填写会员卡');
          return;
        }
      }
      account.member_card_id = memberCardId;
    }

    const param = {
      account,
      orderInfoGuest: guests,
      order_info: orderInfo,
      order_info_package: packages,
      rooms: room,
    };
    console.log(param);

    this.setState({ loading: true });
    checkInSubmit(param).then(rsp => {
      this.setState({ loading: false });
      if (rsp && rsp.code == Constans.SUCCESS) {
        if (rsp.data) {
          // Modal.confirm({
          //   title: '打印登记单',
          //   content: '是否打印登记单?',
          //   okText: '确认',
          //   cancelText: '取消',
          //   onOk: () => {
          let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
          const { hotel_group_id, hotel_id, id } = currentUser;
          openPostWindow(
            'api/report/exportReport/' +
              hotel_group_id +
              '/' +
              hotel_id +
              '/R001/' +
              currentUser.id,
            {
              order_id: rsp.data,
            },
          );
          router.push({ pathname: 'orderDetail', query: { orderId: rsp.data } });
          // },
          // onCancel: () => {
          //   router.push({ pathname: 'orderDetail', query: { orderId: rsp.data } });
          // },
          // });
        }
      }
    });
  };

  // 订单类型改变事件
  handleTabsChange = activeKey => {
    // this.setState({ current: activeKey });
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const arriveTime = getFieldValue('checkin_time');
    const temp = moment(arriveTime);
    let days = 1;
    let checkout_time = null;
    let index = 0;
    if (activeKey == 'day') {
      days = 1;
      checkout_time = temp
        .add(1, 'd')
        .hour(this.state.latestLeave[0])
        .minute(this.state.latestLeave[1])
        .second(this.state.latestLeave[2]);
      // .startOf('hour');
      index = 0;
    } else if (activeKey == 'hour') {
      days = this.state.hourStar;
      checkout_time = temp.add(this.state.hourStar, 'h');
      index = 1;
    } else if (activeKey == 'hire' || activeKey == 'rent') {
      if (activeKey == 'hire') {
        index = 2;
      } else {
        index = 3;
      }
      days = 30;
      checkout_time = temp
        .add(30, 'd')
        .hour(this.state.latestLeave[0])
        .minute(this.state.latestLeave[1])
        .second(this.state.latestLeave[2]);
      // .hour(14)
      // .startOf('hour');
    }
    this.setState({ current: activeKey });
    setFieldsValue({
      days: days,
      checkin_time: arriveTime,
      checkout_time,
    });

    const orderTypeIds = this.state.orderTypeIds;

    this.getRoomRateCode(null, orderTypeIds[index], null);
  };

  // 房型改变事件
  handleRoomTypeChange = value => {
    this.getRoomNo(value);
    this.getRoomRate(value, null, null, null);
  };

  // 房号改变事件
  handleRoomNoChange = value => {
    this.state.rooms.map(room => {
      if (room.id == value) {
        this.setState({ roomNo: room.room_no });
      }
    });
  };

  // 房价码改变事件
  handleRoomRateChange = value => {
    this.state.roomPriceCode.map(item => {
      if (item.id == value) {
        this.setState({ roomRateCode: item.code, roomRateDesc: item.description });
      }
    });
    this.getRoomRate(null, value, null, null);
  };

  // 市场选择事件
  handleScChange = value => {
    this.state.marketArr.map(item => {
      if (item.id == value) {
        const latestLeaveStr = item.default_checkout_time || '14:00:00';
        let latestLeave = latestLeaveStr.split(':');
        if (latestLeave.length != 3) {
          latestLeave = ['14', '00', '00'];
        }
        this.setState({ market: item.code, latestLeave });

        const {
          form: { getFieldValue, setFieldsValue },
        } = this.props;
        const checkOutTime = getFieldValue('checkout_time');
        if (checkOutTime) {
          checkOutTime
            .hour(latestLeave[0])
            .minute(latestLeave[1])
            .second(latestLeave[2]);
          setFieldsValue({ checkout_time: checkOutTime });
        }
      }
    });
    this.getRoomRateCode(value);
  };

  //活动码
  handleHdChange = value => {
    // this.state.yh.map(item => {
    //   if (item.id == value) {
    //     this.setState({ activityCode: item.code });
    //   }
    // });
  };

  handleCompanyCg = value => {
    this.getCompanyMarkData(value);
  };

  handleCardNoBlur = () => {
    const cardNo = this.props.form.getFieldValue('card_no');
    if (cardNo) {
      getMemberCard({ card_no: cardNo }).then(rsp => {
        if (rsp && rsp.code == Constans.SUCCESS) {
          const data = rsp.data || [];
          this.setState({
            member_card_id: data[0] && data[0].id,
            member_card_no: data[0] && data[0].card_no,
            member_balance: data[0] && data[0].balance,
          });
        }
      });
      this.getMemberMarkData(cardNo);
    }
  };

  handleAccountCg = value => {
    const { memberAccount, wechatAccount } = this.state;
    if (value == (memberAccount && memberAccount.id)) {
      this.setState({ isMember: true, isWechat: false });
    } else if (value == (wechatAccount && wechatAccount.id)) {
      this.setState({ isMember: false, isWechat: true });
    } else {
      this.setState({ isMember: false, isWechat: false });
    }
  };

  handlePayCardNoBlur = () => {
    const cardNo = this.props.form.getFieldValue('pay_card_no');
    if (cardNo) {
      getMemberCard({ card_no: cardNo }).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          if (data[0]) {
            this.setState({ memberCardId: data[0].id });
            this.props.form.setFieldsValue({ balance: data[0].balance });
          }
        } else {
          this.setState({ memberCardId: null });
          this.props.form.setFieldsValue({ balance: 0 });
        }
      });
    } else {
      this.setState({ memberCardId: null });
      this.props.form.setFieldsValue({ balance: 0 });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const updownStyle = {
      fontSize: '25px',
      height: '30px',
      lineHeight: '30px',
      verticalAlign: 'middle',
      width: '30%',
      textAlign: 'center',
      display: 'inline-block',
      cursor: 'pointer',
    };

    let ddsjLabel = '到达时间';
    let tfsjLabel = '离开时间';
    let xyjgLabel = '协议价格';
    if (this.state.current == 'hour') {
      ddsjLabel = '入住时间';
      tfsjLabel = '退房时间';
    } else if (this.state.current == 'rent') {
      xyjgLabel = '协议月租';
    }

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const tableData = [
      {
        key: '0',
        name: '',
        credential_type: '1',
        credential_no: '',
        phone_number: '',
        member_no: '',
        memberLevel: 0,
        // editable: true,
        // isNew: true,
        hotel_id: currentUser.hotel_id,
        hotel_group_id: currentUser.hotel_group_id,
        create_user: currentUser.id,
        modify_user: currentUser.id,
      },
    ];

    return (
      <Spin spinning={this.state.loading}>
        <GridContent>
          {/* <i className={styles.leftIcon}>I</i> */}
          <div>
            <Tabs
              defaultActiveKey={this.state.current}
              tabBarStyle={{ borderBottom: 0, margin: '0 0 10px 10px' }}
              style={{ background: '#fff' }}
              onChange={activeKey => this.handleTabsChange(activeKey)}
            >
              <TabPane tab={<span style={{ fontSize: '16px' }}>全日房</span>} key="day"></TabPane>
              <TabPane tab={<span style={{ fontSize: '16px' }}>钟点房</span>} key="hour"></TabPane>
              <TabPane tab={<span style={{ fontSize: '16px' }}>长包房</span>} key="hire"></TabPane>
              <TabPane tab={<span style={{ fontSize: '16px' }}>长租房</span>} key="rent"></TabPane>
            </Tabs>

            <Card
              title={
                <>
                  <Icon type="idcard" />
                  <span style={{ marginLeft: '10px' }}>住客信息</span>
                </>
              }
              style={{ marginTop: '10px' }}
              bodyStyle={{ padding: '5px 24px' }}
            >
              {getFieldDecorator('guests', {
                initialValue: tableData,
              })(<TableForm />)}

              <div
                style={{
                  height: '30px',
                  lineHeight: '30px',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                  margin: '4px auto',
                }}
              >
                <Radio.Group onChange={e => this.handRadioChange(e)} value={this.state.userType}>
                  <Radio value={1}>散客</Radio>
                  <Radio value={2} style={{ marginLeft: '20px' }}>
                    会员
                  </Radio>
                  {/* {this.state.current == 'day' ? (
                    <> */}
                  <Radio value={3} style={{ marginLeft: '20px' }}>
                    协议公司
                  </Radio>
                  <Radio value={4} style={{ marginLeft: '20px' }}>
                    中介/旅行社
                  </Radio>
                  {/* </>
                  ) : null} */}
                </Radio.Group>
                {this.state.userType == 2 && (
                  <>
                    <span>会员卡号:</span>
                    {getFieldDecorator(
                      'card_no',
                      {},
                    )(
                      <Input
                        onBlur={() => this.handleCardNoBlur()}
                        style={{ width: '120px', marginLeft: '10px' }}
                      />,
                    )}
                  </>
                )}
                {this.state.userType == 3 && (
                  <>
                    <span>协议公司:</span>
                    {getFieldDecorator('company_info_id', {
                      initialValue: this.state.initCompanyId,
                    })(
                      <Select
                        placeholder="协议公司"
                        style={{ width: '120px', marginLeft: '10px' }}
                        onChange={value => this.handleCompanyCg(value)}
                      >
                        {this.state.xygs.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </>
                )}
                {this.state.userType == 4 && (
                  <>
                    <span>中介/旅行社:</span>
                    {getFieldDecorator('company_info_id', {
                      initialValue: this.state.initTravelId,
                    })(
                      <Select
                        placeholder="协议公司"
                        style={{ width: '120px', marginLeft: '10px' }}
                        onChange={value => this.handleCompanyCg(value)}
                      >
                        {this.state.travelAgencyArr.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </>
                )}
              </div>
            </Card>

            <Card
              title={
                <>
                  <Icon type="container" />
                  <span style={{ marginLeft: '10px' }}>主单信息</span>
                </>
              }
              style={{ marginTop: '20px' }}
            >
              <Row>
                <Col span={16}>
                  <table className={styles.infoTable}>
                    <tbody>
                      <tr>
                        <td className={styles.infoTableLabel}>{ddsjLabel}</td>
                        <td className={styles.infoTableInp}>
                          {getFieldDecorator('checkin_time', {
                            rules: [{ type: 'object', required: true, message: '请选时间' }],
                            initialValue: moment(),
                          })(
                            <DatePicker
                              showTime
                              style={{ width: '100%' }}
                              format="YYYY-MM-DD HH:mm:ss"
                              onChange={date => this.handChangeArrive(date)}
                            />,
                          )}
                        </td>
                        <td className={styles.infoTableLabel}>房&emsp;&emsp;型</td>
                        <td>
                          {getFieldDecorator('room_type_id', {
                            rules: [{ required: true, message: '请选房型' }],
                          })(
                            <Select
                              placeholder="请选房型"
                              style={{ width: '100%' }}
                              onChange={value => this.handleRoomTypeChange(value)}
                            >
                              {this.state.roomType.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                      </tr>
                      <tr>
                        {this.state.current == 'hour' ? (
                          <td className={styles.infoTableLabel}>小&emsp;&emsp;时</td>
                        ) : (
                          <td className={styles.infoTableLabel}>天&emsp;&emsp;数</td>
                        )}
                        {/* <td className={styles.infoTableLabel}>{tsLabel}</td> */}
                        <td>
                          <Icon
                            type="caret-down"
                            style={{ ...updownStyle, color: '#EA5A6C' }}
                            onClick={() => this.handDaysInputNumChange('subtract')}
                          />
                          {getFieldDecorator('days', { initialValue: 1 })(
                            <InputNumber
                              style={{ width: '40%' }}
                              onChange={value => this.handChangeDays(value)}
                              min={1}
                            />,
                          )}
                          <Icon
                            type="caret-up"
                            style={{ ...updownStyle, color: '#37C5A6' }}
                            onClick={() => this.handDaysInputNumChange('add')}
                          />
                        </td>
                        <td className={styles.infoTableLabel}>房&emsp;&emsp;号</td>
                        <td>
                          {getFieldDecorator(
                            'room_no_id',
                            {},
                          )(
                            <Select
                              placeholder="请选房号"
                              style={{ width: '100%' }}
                              onChange={value => this.handleRoomNoChange(value)}
                            >
                              {this.state.rooms.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.room_no}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.infoTableLabel}>{tfsjLabel}</td>
                        <td>
                          {getFieldDecorator('checkout_time', {
                            rules: [{ type: 'object', required: true, message: '请选时间' }],
                            initialValue: moment()
                              .add(1, 'd')
                              .hour(parseInt(this.state.latestLeave[0]))
                              .minute(parseInt(this.state.latestLeave[1]))
                              .second(parseInt(this.state.latestLeave[2])),
                          })(
                            <DatePicker
                              showTime
                              style={{ width: '100%' }}
                              format="YYYY-MM-DD HH:mm:ss"
                              onChange={date => this.handChangeLeave(date)}
                              disabledDate={this.disabledDate}
                            />,
                          )}
                        </td>
                        <td className={styles.infoTableLabel}>房&ensp;价&ensp;码</td>
                        <td>
                          {getFieldDecorator(
                            'room_rate_code',
                            {},
                          )(
                            <Select
                              placeholder="请选房价码"
                              style={{ width: '100%' }}
                              onChange={value => this.handleRoomRateChange(value)}
                            >
                              {this.state.roomPriceCode.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.description}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.infoTableLabel}>市&emsp;&emsp;场</td>
                        <td>
                          {getFieldDecorator('market_id', {
                            rules: [
                              {
                                required: true,
                                message: '请输入市场',
                              },
                            ],
                            initialValue: this.state.initMarket,
                          })(
                            <Select
                              placeholder="请选市场"
                              style={{ width: '100%' }}
                              onChange={value => this.handleScChange(value)}
                            >
                              {this.state.marketArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.description}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                        <td className={styles.infoTableLabel}>优惠理由</td>
                        <td>
                          {getFieldDecorator('prefer_reason_id', {
                            rules: [{ required: true, message: '请选优惠理由' }],
                          })(
                            <Select placeholder="请选优惠理由" style={{ width: '100%' }}>
                              {this.state.preferReasonArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.description}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.infoTableLabel}>来&emsp;&emsp;源</td>
                        <td>
                          {getFieldDecorator('source_id', {
                            rules: [{ required: true, message: '请选来源' }],
                          })(
                            <Select placeholder="请选来源" style={{ width: '100%' }}>
                              {this.state.sourceArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.description}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                        <td className={styles.infoTableLabel}>{xyjgLabel}</td>
                        <td>
                          {getFieldDecorator('room_rate', {
                            rules: [
                              {
                                required: true,
                                message: '请输入协议价格',
                              },
                            ],
                          })(<Input placeholder="请输入协议价格" disabled />)}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.infoTableLabel}>渠&emsp;&emsp;道</td>
                        <td>
                          {getFieldDecorator('canals_id', {
                            rules: [{ required: true, message: '请选渠道' }],
                            initialValue: this.state.initCanal,
                          })(
                            <Select
                              placeholder="请选渠道"
                              style={{ width: '100%' }}
                              // onChange={value => this.handleQdChange(value)}
                            >
                              {this.state.canalsArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.description}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                        {this.state.current == 'rent' ? (
                          <td className={styles.infoTableLabel}>月&emsp;&emsp;租</td>
                        ) : (
                          <td className={styles.infoTableLabel}>价&emsp;&emsp;格</td>
                        )}
                        {/* <td className={styles.infoTableLabel}>{jgLabel}</td> */}
                        <td>
                          {getFieldDecorator('room_reality_rate', {
                            rules: [
                              {
                                required: true,
                                message: '请输入房价',
                              },
                            ],
                          })(<Input placeholder="请输入房价" />)}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.infoTableLabel}>销&ensp;售&ensp;员</td>
                        <td>
                          {getFieldDecorator('sales_man_id', {
                            rules: [{ required: true, message: '请选销售员由' }],
                            initialValue: this.state.initSalesMan,
                          })(
                            <Select placeholder="请选销售员" style={{ width: '100%' }}>
                              {this.state.salesManArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                        <td className={styles.infoTableLabel}>包&emsp;&emsp;价</td>
                        <td>
                          {getFieldDecorator('packages_id', {
                            rules: [{ required: true, message: '请选包价' }],
                          })(
                            <Select
                              placeholder="请选包价"
                              style={{ width: '100%' }}
                              mode="multiple"
                            >
                              {this.state.packagesArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.description}
                                  {item.is_charge == '1' && (
                                    <>
                                      <span style={{ marginLeft: '10px' }}>收费</span>
                                      <span style={{ marginLeft: '10px' }}>{item.price}</span>
                                    </>
                                  )}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.infoTableLabel}>备&emsp;&emsp;注</td>
                        <td colSpan={3}>
                          {getFieldDecorator('order_desc', {
                            rules: [
                              {
                                required: true,
                                message: '请输入',
                              },
                            ],
                          })(<Input placeholder="请输入" />)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col span={8}>
                  <div className={styles.mytabs}>
                    <div className={styles.header}>
                      <button
                        className={this.state.tabs == 1 ? styles.active : null}
                        onClick={() => {
                          this.setState({ tabs: 1 });
                        }}
                      >
                        预收款
                      </button>
                      {/* <button
                      className={this.state.tabs == 2 ? styles.active : null}
                      onClick={() => {
                        this.setState({ tabs: 2 });
                      }}
                    >
                      预授权
                    </button> */}
                    </div>
                    <div className={styles.tabContent}>
                      {this.state.tabs == 1 ? (
                        <>
                          <Row>
                            <Col span={8}>金&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额：</Col>
                            <Col span={16}>
                              {getFieldDecorator('money', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入',
                                  },
                                ],
                              })(<Input placeholder="请输入" />)}
                            </Col>
                          </Row>
                          <Row style={{ marginTop: '10px' }}>
                            <Col span={8}>付款方式：</Col>
                            <Col span={16}>
                              {getFieldDecorator('payWay', {
                                rules: [{ required: true, message: '请选付款方式' }],
                              })(
                                <Select
                                  placeholder="请选付款方式"
                                  style={{ width: '100%' }}
                                  // onChange={this.handleSelectChange}
                                  onChange={value => this.handleAccountCg(value)}
                                >
                                  {this.state.payTypeArr.map(pay => (
                                    <Option value={pay.id} key={pay.id}>
                                      {pay.description}
                                    </Option>
                                  ))}
                                </Select>,
                              )}
                            </Col>
                          </Row>
                          {this.state.isMember && (
                            <>
                              <Row style={{ marginTop: '10px' }}>
                                <Col span={8}>会员卡号：</Col>
                                <Col span={16}>
                                  {getFieldDecorator('pay_card_no', {
                                    initialValue: this.state.member_card_no,
                                  })(<Input onBlur={() => this.handlePayCardNoBlur()} />)}
                                </Col>
                              </Row>
                              <Row style={{ marginTop: '10px' }}>
                                <Col span={8}>会员余额：</Col>
                                <Col span={16}>
                                  {getFieldDecorator('balance', {
                                    initialValue: this.state.member_balance,
                                  })(<Input disabled />)}
                                </Col>
                              </Row>
                            </>
                          )}
                          {this.state.isWechat && (
                            <Row style={{ marginTop: '10px' }}>
                              <Col span={8}>支付方式：</Col>
                              <Col span={16}>
                                <Switch
                                  checkedChildren="扫码"
                                  unCheckedChildren="手动"
                                  defaultChecked={false}
                                  onChange={check => {
                                    this.setState({ isScan: check });
                                    if (check) {
                                      message.info(
                                        '扫码付款时请鼠标点击条形码输入框,待条形码输入框接收到用户条形码后方可提交',
                                        5,
                                      );
                                    }
                                  }}
                                />
                              </Col>
                            </Row>
                          )}
                          <Row style={{ marginTop: '10px' }}>
                            {this.state.isWechat && this.state.isScan ? (
                              <Col span={8}>条&ensp;形&ensp;码：</Col>
                            ) : (
                              <Col span={8}>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</Col>
                            )}
                            <Col span={16}>
                              {getFieldDecorator('pay_account_no', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入',
                                  },
                                ],
                              })(<Input placeholder="请输入" />)}
                            </Col>
                          </Row>
                          {/* <Row style={{ marginTop: '10px' }}>
                            <Col span={8}>打印份数：</Col>
                            <Col span={12}>
                              {getFieldDecorator('dyfs', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入',
                                  },
                                ],
                              })(<InputNumber style={{ width: '100%' }} />)}
                            </Col>
                            <Col span={4}>
                              <Icon
                                type="printer"
                                style={{ fontSize: '20px', lineHeight: '34px', cursor: 'pointer' }}
                              />
                            </Col>
                          </Row> */}
                        </>
                      ) : null}

                      {this.state.tabs == 2 ? (
                        <>
                          <Row>
                            <Col span={8}>金&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额：</Col>
                            <Col span={16}>
                              {getFieldDecorator('money2', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入',
                                  },
                                ],
                              })(<Input placeholder="请输入" />)}
                            </Col>
                          </Row>
                          <Row style={{ marginTop: '10px' }}>
                            <Col span={8}>付款方式：</Col>
                            <Col span={16}>
                              {getFieldDecorator('fkfs', {
                                rules: [{ required: true, message: '请选付款方式' }],
                              })(
                                <Select
                                  placeholder="请选付款方式"
                                  style={{ width: '100%' }}
                                  // onChange={this.handleSelectChange}
                                >
                                  <Option value="1">现金</Option>
                                  <Option value="2">微信</Option>
                                </Select>,
                              )}
                            </Col>
                          </Row>
                          <Row style={{ marginTop: '10px' }}>
                            <Col span={8}>卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</Col>
                            <Col span={16}>
                              {getFieldDecorator('kh', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入',
                                  },
                                ],
                              })(<Input placeholder="请输入" />)}
                            </Col>
                          </Row>
                          <Row style={{ marginTop: '10px' }}>
                            <Col span={8}>预授权号：</Col>
                            <Col span={16}>
                              {getFieldDecorator('ysqh', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入',
                                  },
                                ],
                              })(<Input placeholder="请输入" />)}
                            </Col>
                          </Row>
                          <Row style={{ marginTop: '10px' }}>
                            <Col span={8}>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</Col>
                            <Col span={16}>
                              {getFieldDecorator('dh', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入',
                                  },
                                ],
                              })(<Input placeholder="请输入" />)}
                            </Col>
                          </Row>
                        </>
                      ) : null}
                      {/* </div> */}
                    </div>
                  </div>
                </Col>
              </Row>

              <div className={styles.footer}>
                <Button type="primary" className={styles.submit} onClick={this.handleSubmit}>
                  确认
                </Button>
              </div>
            </Card>
          </div>
        </GridContent>
      </Spin>
    );
  }
}

export default Form.create()(CheckIn);
