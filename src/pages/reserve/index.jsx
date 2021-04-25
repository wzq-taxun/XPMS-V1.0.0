import { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Table,
  InputNumber,
  message,
  Spin,
  Button,
} from 'antd';
import styles from './style.less';
import {
  getCompanyInfo,
  getMedium,
  getSalesMan,
  getRoomType,
  getRoomRate,
  getRoomRateCode,
  reserveSubmit,
  getPreferReason,
  getPackages,
  getMarket,
  getFreeRoomCount,
  getMemberMarket,
  getCompanyMarket,
  getRoomNo,
} from '@/services/checkIn';
import moment from 'moment';
import { router } from 'umi';
import Constans from '@/constans';
import Dict from '@/dictionary';
import { getMemberCard } from '@/services/member';
const { Option } = Select;

const columns = [
  {
    title: '到达时间',
    dataIndex: 'checkin_time',
    key: 'checkin_time',
    render: (text, record) =>
      record.checkin_time && moment(record.checkin_time).format('MM-DD HH:mm'),
  },
  {
    title: '离开时间',
    dataIndex: 'checkout_time',
    key: 'checkout_time',
    render: (text, record) =>
      record.checkin_time && moment(record.checkout_time).format('MM-DD HH:mm'),
  },
  {
    title: '房型',
    dataIndex: 'room_type_id',
    key: 'room_type_id',
    render: (text, record) => record.roomTypeName,
  },
  {
    title: '房价码',
    key: 'roomPriceCode',
    dataIndex: 'roomPriceCode',
    render: (text, record) => record.priceCodeName,
  },
  {
    title: '包价',
    key: 'packages',
    dataIndex: 'packages',
    render: (text, record) => record.packagesName,
  },
  {
    title: '协议价',
    key: 'roomRate',
    dataIndex: 'roomRate',
  },
  {
    title: '首日价',
    key: 'room_reality_rate',
    dataIndex: 'room_reality_rate',
  },
  {
    title: '优惠理由',
    key: 'preferReason',
    dataIndex: 'preferReason',
    render: (text, record) => record.preferReasonName,
  },
  {
    title: '房间数',
    key: 'room_nums',
    dataIndex: 'room_nums',
  },
  {
    title: '房号',
    key: 'room_no',
    dataIndex: 'room_no',
  },
  {
    title: '剩余可用',
    key: 'room_nums_has',
    dataIndex: 'room_nums_has',
  },
];

class Reserve extends Component {
  state = {
    currentTime: moment()
      .hour(12)
      .minute(0)
      .second(0),
    current: 'sk',
    guestType: 1,
    orderTypeObj: {},
    orderTypeIds: [],
    guestTypeObj: {},
    guestTypeIds: [],
    reserveType: [], //预定类型
    initReserveType: null,
    salesMans: [], //销售员
    initSalesMan: null,
    roomTypes: [], //房间类型
    initRoomType: null,
    roomPriceCodes: [], //房价码
    initRoomPriceCode: null,
    packages: [], //包价
    initPackage: null,
    preferReason: [], //优惠理由
    initPreferReason: null,
    reserves: [],
    key: 0,
    selectRows: [],
    xygs: [],
    initXygs: null,
    travelAgencyArr: [],
    initAgency: null,
    loading: false,
    orderType: Dict.orderType,
    guestTypeArr: Dict.guestType,
    marketArr: [],
    latestLeave: ['14', '00', '00'], // 最晚离店 时 分 秒
    roomNumsObj: {}, // {roomTypeId:num}
    roomNumHasObj: {},
    roomNums: 0,
    member_card_id: 0,
    arrange: !!this.props.location.state ? 1 : 0,
  };

  componentDidMount = () => {
    // this.getLatestCheckOut();
    this.getDefaultCheckIn();
    this.getGuestType();
    this.getCompanyInfo();
    this.getTravelAgency();
    this.getSalesMan();
    this.getRoomType();
    this.getPreferReason();
    this.getPackages();
    this.getMarketData(Dict.guestType[0] && Dict.guestType[0].id);
  };

  // 默认到店时间
  getDefaultCheckIn = () => {
    const config = JSON.parse(sessionStorage.getItem('config')) || {};
    const checkInConf = config[Dict.checkInConfCode] && config[Dict.checkInConfCode].code;
    if (checkInConf) {
      const arriveArr = checkInConf.split(':');
      if (arriveArr && arriveArr.length > 0) {
        this.setState({
          currentTime: moment()
            .hour(arriveArr[0])
            .minute(arriveArr[1] || 0)
            .second(0),
        });
      }
    }
  };

  // 默认最晚保留
  getLatestCheckOut = () => {
    const config = JSON.parse(sessionStorage.getItem('config')) || {};
    const checkOutConf = config[Dict.checkOutConfCode] && config[Dict.checkOutConfCode].code;
    if (checkOutConf) {
      const latestLeave = checkOutConf.split(':');
      if (latestLeave.length == 3) {
        this.setState({ latestLeave });

        let retain_time = moment()
          .hour(parseInt(latestLeave[0]))
          .minute(parseInt(latestLeave[1]))
          .second(parseInt(latestLeave[2]));
        if (retain_time.isBefore(moment())) {
          retain_time.add(1, 'day');
        }
        const {
          form: { setFieldsValue },
        } = this.props;
        setFieldsValue({ retain_time });
      }
    }
  };

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

      this.getRoomRateCode(null, null, guestTypeIds[0]);
    }
  };

  // 获取散客市场
  getMarketData = (guest_type_id, company_id) => {
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

        this.setState({ marketArr: data, latestLeave });

        const {
          form: { getFieldValue, setFieldsValue },
        } = this.props;

        const checkOutTime = getFieldValue('checkout_time');
        if (checkOutTime) {
          let order_type_id = getFieldValue('order_type_id');
          if (order_type_id == Dict.hourTypeId) {
            const checkInTime = getFieldValue('checkin_time');
            const config = JSON.parse(sessionStorage.getItem('config')) || {};
            const hourStar =
              (config[Dict.hourStartConfCode] && config[Dict.hourStartConfCode].code) || 3;
            checkOutTime
              .hour(parseInt(checkInTime.hour()) + parseInt(hourStar))
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

        this.getRoomRateCode(data[0] && data[0].id, null, guest_type_id);
      }
    });
  };

  // 获取会员市场
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
          latestLeave,
        });

        const {
          form: { getFieldValue, setFieldsValue },
        } = this.props;

        const checkOutTime = getFieldValue('checkout_time');
        if (checkOutTime) {
          let order_type_id = getFieldValue('order_type_id');
          if (order_type_id == Dict.hourTypeId) {
            const checkInTime = getFieldValue('checkin_time');
            const config = JSON.parse(sessionStorage.getItem('config')) || {};
            const hourStar =
              (config[Dict.hourStartConfCode] && config[Dict.hourStartConfCode].code) || 3;
            checkOutTime
              .hour(parseInt(checkInTime.hour()) + parseInt(hourStar))
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

  // 获取协议/中介市场
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
          latestLeave,
        });

        const {
          form: { getFieldValue, setFieldsValue },
        } = this.props;

        const checkOutTime = getFieldValue('checkout_time');
        if (checkOutTime) {
          let order_type_id = getFieldValue('order_type_id');
          if (order_type_id == Dict.hourTypeId) {
            const checkInTime = getFieldValue('checkin_time');
            const config = JSON.parse(sessionStorage.getItem('config')) || {};
            const hourStar =
              (config[Dict.hourStartConfCode] && config[Dict.hourStartConfCode].code) || 3;
            checkOutTime
              .hour(parseInt(checkInTime.hour()) + parseInt(hourStar))
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

  // 获取协议公司
  getCompanyInfo = () => {
    getCompanyInfo().then(rsp => {
      const data = rsp.data || [];
      this.setState({ xygs: data, initXygs: data[0] && data[0].id });
    });
  };

  // 获取中介旅行社
  getTravelAgency = () => {
    getMedium().then(rsp => {
      const data = rsp.data || [];
      this.setState({ travelAgencyArr: data, initAgency: data[0] && data[0].id });
    });
  };

  // 获取销售员
  getSalesMan = () => {
    getSalesMan().then(rsp => {
      const salesMans = rsp.data;
      this.setState({
        salesMans: salesMans || [],
        initSalesMan: salesMans[0] && salesMans[0].id,
      });
    });
  };

  // 获取房型
  getRoomType = () => {
    getRoomType().then(rsp => {
      const data = rsp.data;

      const roomTypeId =
        (this.props.location.state && this.props.location.state.room_type_id) ||
        (data[0] && data[0].id);

      this.setState({ roomTypes: data || [], initRoomType: roomTypeId });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        room_type_id: roomTypeId,
      });
      this.getRoomRate(roomTypeId, null);

      this.getFreeRoomNums(roomTypeId);

      if (this.state.arrange) {
        this.getRoomNoData(roomTypeId);
      }
    });
  };

  // 获取空闲房间数
  getFreeRoomNums = (room_type_id, checkin_time, checkout_time) => {
    const {
      form: { getFieldValue },
    } = this.props;
    room_type_id = room_type_id || getFieldValue('room_type_id');
    checkin_time = checkin_time || getFieldValue('checkin_time');
    checkout_time = checkout_time || getFieldValue('checkout_time');

    getFreeRoomCount({
      room_type_id,
      checkin_time: checkin_time && checkin_time.format('YYYY-MM-DD HH:mm:ss'),
      checkout_time: checkout_time && checkout_time.format('YYYY-MM-DD HH:mm:ss'),
    }).then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const count = rsp.data || 0;
        if (count < 1) {
          message.error('没有空闲房间');
        }
        const obj = { ...this.state.roomNumsObj, [room_type_id]: count };
        // this.setState({ roomNumsObj: obj, roomNums: count });
        const hasRoomNum = this.state.roomNumHasObj[room_type_id] || count;
        this.setState({ roomNumsObj: obj, roomNums: hasRoomNum });
        const {
          form: { setFieldsValue },
        } = this.props;
        setFieldsValue({ room_nums: count > 0 ? 1 : 0 });
      }
    });
  };

  // 获取房号
  getRoomNoData = (roomTypeId, checkin_time, checkout_time) => {
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
          room_no_id: [room_no_id],
        });
      }
    });
  };

  // 获取房价码
  getRoomRateCode = (market_id, order_type_id, guest_type_id) => {
    const {
      form: { getFieldValue },
    } = this.props;
    market_id = market_id || getFieldValue('market_id');
    order_type_id = order_type_id || getFieldValue('order_type_id');
    guest_type_id = guest_type_id || getFieldValue('guest_type_id');

    const param = { market_id, order_type_id, guest_type_id };
    getRoomRateCode(param).then(rsp => {
      const {
        form: { setFieldsValue },
      } = this.props;
      if (rsp && rsp.code == Constans.SUCCESS) {
        const priceCode = rsp.data || [];
        this.setState({
          roomPriceCodes: priceCode,
          initPriceCode: priceCode[0] && priceCode[0].id,
        });

        const roomRateId = priceCode && priceCode[0] && priceCode[0].id;
        setFieldsValue({
          room_rate_code: roomRateId,
        });

        this.getRoomRate(null, priceCode[0] && priceCode[0].id);
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
      form: { getFieldValue },
    } = this.props;
    room_type_id = room_type_id || getFieldValue('room_type_id');
    code_room_rate_id = code_room_rate_id || getFieldValue('room_rate_code');
    date_start_end = date_start_end || getFieldValue('checkin_time');
    date_end_sta = date_end_sta || getFieldValue('checkin_time');
    if (!room_type_id || !code_room_rate_id) return;
    const param = {
      room_type_id,
      code_room_rate_id,
      date_start_end: date_start_end.format('YYYY-MM-DD HH:mm:ss'),
      date_end_sta: date_end_sta.format('YYYY-MM-DD HH:mm:ss'),
    };
    getRoomRate(param).then(rsp => {
      const {
        form: { setFieldsValue },
      } = this.props;
      if (rsp && rsp.code == Constans.SUCCESS) {
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

  // 获取优惠理由
  getPreferReason = () => {
    getPreferReason().then(rsp => {
      this.setState({
        preferReason: rsp.data || [],
      });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        prefer_reason_id: rsp.data && rsp.data[0] && rsp.data[0].id,
      });
    });
  };

  // 获取包价
  getPackages = () => {
    getPackages().then(rsp => {
      this.setState({
        packages: rsp.data || [], //包价
      });

      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({
        packages: rsp.data && rsp.data[0] && rsp.data[0].id,
      });
    });
  };

  handChangeArrive = date => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    let retain_time = getFieldValue('retain_time');
    retain_time = retain_time
      .year(date.year())
      .month(date.month())
      .date(date.date());
    setFieldsValue({ retain_time });

    let order_type_id = getFieldValue('order_type_id');
    if (order_type_id == Dict.hourTypeId) {
      let checkout_time = moment()
        .year(date.year())
        .month(date.month())
        .date(date.date())
        .hour(date.hour())
        .minute(date.minute())
        .second(date.second());

      const config = JSON.parse(sessionStorage.getItem('config')) || {};
      const hourStar = (config[Dict.hourStartConfCode] && config[Dict.hourStartConfCode].code) || 3;
      checkout_time.add(hourStar, 'hour');
      setFieldsValue({
        checkout_time,
      });
      this.getRoomRate(null, null, date, checkout_time);
      this.getFreeRoomNums(null, date, checkout_time);
      if (this.state.arrange) {
        this.getRoomNoData(null, date, checkout_time);
      }
    } else {
      let checkout_time = getFieldValue('checkout_time');
      let checkout_time_new = null;
      if (checkout_time.isBefore(date)) {
        message.info('退房时间早于到店时间,已调整为到店时间次日,请注意!');
        checkout_time_new = moment()
          .year(date.year())
          .month(date.month())
          .date(date.date())
          .hour(checkout_time.hour())
          .minute(checkout_time.minute())
          .second(checkout_time.second())
          .add(1, 'days');
        setFieldsValue({
          checkout_time: checkout_time_new,
        });
      }
      this.getRoomRate(null, null, date, checkout_time_new);
      this.getFreeRoomNums(null, date, checkout_time_new);
      if (this.state.arrange) {
        this.getRoomNoData(null, date, checkout_time_new);
      }
    }
  };

  handChangeLeave = date => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;

    let checkin_time = getFieldValue('checkin_time');
    let checkin_time_new = null;
    if (checkin_time.isAfter(date)) {
      message.info('到店时间晚于离店时间,已调整为离店时间前日,请注意!');
      checkin_time_new = moment()
        .year(date.year())
        .month(date.month())
        .date(date.date())
        .hour(checkin_time.hour())
        .minute(checkin_time.minute())
        .second(checkin_time.second())
        .subtract(1, 'days');
      setFieldsValue({
        checkin_time: checkin_time_new,
      });
    }

    this.getRoomRate(null, null, checkin_time_new, date);
    this.getFreeRoomNums(null, checkin_time_new, date);
    if (this.state.arrange) {
      this.getRoomNoData(null, checkin_time_new, date);
    }
  };

  handleRoomTypeChange = value => {
    this.getRoomRate(value);
    this.getFreeRoomNums(value);
    if (this.state.arrange) {
      this.getRoomNoData(value);
    }
  };

  handleRoomRateCodeChange = value => {
    this.getRoomRate(null, value);
  };

  handleAdd = () => {
    const {
      form: { getFieldValue },
    } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        const room_nums = getFieldValue('room_nums');
        if (parseInt(room_nums) < 1) {
          message.error('没有空闲房间');
          return;
        }

        // 是否排房
        const arrange = getFieldValue('arrange');
        const room_no_id = getFieldValue('room_no_id');
        let room_no = '';
        if (arrange) {
          const rooms = this.state.rooms;
          if (room_no_id instanceof Array) {
            rooms.map(item => {
              if (room_no_id.includes(item.id)) {
                room_no = room_no + ',' + item.room_no;
              }
            });
          } else {
            rooms.map(item => {
              if (item.id == room_no_id) {
                room_no = item.room_no;
              }
            });
          }
          if (room_no && room_no.startsWith(',')) {
            room_no = room_no.substring(1);
          }
        }

        const checkin_time = getFieldValue('checkin_time');
        const checkout_time = getFieldValue('checkout_time');
        const room_type_id = getFieldValue('room_type_id');

        let roomTypeName = null;
        const roomTypeArr = this.state.roomTypes;
        for (let i = 0; i < roomTypeArr.length; i++) {
          if (roomTypeArr[i].id == room_type_id) {
            roomTypeName = roomTypeArr[i].name;
            break;
          }
        }
        const roomPriceCode = getFieldValue('room_rate_code');
        let priceCodeName = null;
        const priceCodeArr = this.state.roomPriceCodes;
        for (let i = 0; i < priceCodeArr.length; i++) {
          if (priceCodeArr[i].id == roomPriceCode) {
            priceCodeName = priceCodeArr[i].description;
            break;
          }
        }
        const packages = getFieldValue('packages');
        let packagesName = '';
        const packagesArr = this.state.packages;
        if (packages instanceof Array) {
          packagesArr.map(item => {
            if (packages.includes(item.id)) {
              packagesName = packagesName + ',' + item.description;
            }
          });
        } else {
          packagesArr.map(item => {
            if (item.id == packages) {
              packagesName = item.description;
            }
          });
        }
        if (packagesName && packagesName.startsWith(',')) {
          packagesName = packagesName.substring(1);
        }

        const room_reality_rate = getFieldValue('room_reality_rate');
        const roomRate = getFieldValue('room_rate');
        const preferReason = getFieldValue('prefer_reason_id');
        let preferReasonName = null;
        const preferReasonArr = this.state.preferReason;
        for (let i = 0; i < preferReasonArr.length; i++) {
          if (preferReasonArr[i].id == preferReason) {
            preferReasonName = preferReasonArr[i].description;
            break;
          }
        }

        const order_type_id = getFieldValue('order_type_id');
        const guest_type_id = getFieldValue('guest_type_id');
        const market_id = getFieldValue('market_id');
        let days_num = 0;
        let hours_num = 0;
        const tempArrive = moment(checkin_time);
        const tempLeave = moment(checkout_time);
        if (order_type_id == Dict.orderType[1].id) {
          hours_num = tempLeave.startOf('hour').diff(tempArrive.startOf('hour'), 'hour');
        } else {
          days_num = tempLeave.startOf('day').diff(tempArrive.startOf('day'), 'day');
        }

        let key = this.state.key;
        let reserves = this.state.reserves;
        const reserve = {
          key: key,
          checkin_time: checkin_time.format('YYYY-MM-DD HH:mm:ss'),
          checkout_time: checkout_time.format('YYYY-MM-DD HH:mm:ss'),
          room_type_id,
          roomTypeName,
          roomPriceCode,
          priceCodeName,
          packages,
          packagesName,
          room_reality_rate,
          roomRate,
          preferReason,
          preferReasonName,
          room_nums,
          days_num,
          hours_num,
          order_type_id,
          guest_type_id,
          market_id,
          room_no,
          room_no_id,

          retain_time: getFieldValue('retain_time'),
          sales_man_id: getFieldValue('sales_man_id'),
          order_desc: getFieldValue('order_desc'),
          company_info_id: getFieldValue('company_info_id'),
          reserve_name: getFieldValue('reserve_name'),
          reserve_tel: getFieldValue('reserve_tel'),
          order_no: getFieldValue('order_no'),
        };

        let hasReserve = false;
        for (let i = 0; i < reserves.length; i++) {
          const temp = reserves[i];
          if (
            temp.checkin_time == reserve.checkin_time &&
            temp.checkout_time == reserve.checkout_time &&
            temp.order_type_id == reserve.order_type_id &&
            temp.guest_type_id == reserve.guest_type_id &&
            temp.market_id == reserve.market_id &&
            temp.room_type_id == reserve.room_type_id &&
            temp.roomPriceCode == reserve.roomPriceCode &&
            temp.packages == reserve.packages &&
            temp.room_reality_rate == reserve.room_reality_rate &&
            temp.roomRate == reserve.roomRate &&
            temp.preferReason == reserve.preferReason
          ) {
            reserves[i].room_nums = reserves[i].room_nums + reserve.room_nums;
            reserves[i].room_nums_has =
              this.state.roomNumsObj[room_type_id] - reserves[i].room_nums;
            hasReserve = true;
            const obj = { ...this.state.roomNumHasObj, [room_type_id]: reserves[i].room_nums_has };
            this.setState({ roomNumHasObj: obj, roomNums: reserves[i].room_nums_has });
            break;
          }
        }
        if (!hasReserve) {
          reserve.room_nums_has = this.state.roomNumsObj[room_type_id] - reserve.room_nums;
          const obj = { ...this.state.roomNumHasObj, [room_type_id]: reserve.room_nums_has };
          this.setState({ roomNumHasObj: obj, roomNums: reserve.room_nums_has });
          reserves.push(reserve);
        }

        this.setState({ reserves, key: key + 1 });
      }
    });
  };

  handleDelete = () => {
    const { reserves, selectRows } = this.state;
    const newReserves = [];
    for (let i = 0; i < reserves.length; i++) {
      let has = false;
      for (let j = 0; j < selectRows.length; j++) {
        if (reserves[i].key == selectRows[j].key) {
          has = true;
          selectRows.splice(j, 1);
          break;
        }
      }
      if (!has) {
        newReserves.push(reserves[i]);
      }
    }
    this.setState({ reserves: newReserves, selectRows: [] });
  };

  handleSubmit = e => {
    if (this.state.reserves.length < 1) {
      message.error('至少需要一个预留');
      return;
    }

    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let orders = [];

    this.state.reserves.map(reserve => {
      const order_info_package = [];
      const packages = reserve.packages;
      if (packages instanceof Array) {
        packages.map(item => {
          order_info_package.push({ packages_id: item, room_no_id: 0 });
        });
      } else {
        order_info_package.push({ packages_id: packages, room_no_id: 0 });
      }

      const orderInfo = {
        canals_id: 0,
        company_info_id: reserve.company_info_id || 0, //协议单位ID
        create_user: currentUser.id,
        guest_type_id: reserve.guest_type_id,
        hotel_group_id: currentUser.hotel_group_id,
        hotel_id: currentUser.hotel_id,
        market_id: reserve.market_id,
        member_id: 0,
        order_desc: reserve.order_desc,
        // order_no: reserve.order_no,
        memo: reserve.order_no,
        order_price: 0,
        order_type_id: reserve.order_type_id,
        prefer_reason_id: reserve.preferReason, //优惠理由
        reserve_name: reserve.reserve_name,
        reserve_tel: reserve.reserve_tel,
        retain_time: reserve.retain_time.format('YYYY-MM-DD HH:mm:ss'),
        modify_user: currentUser.id,
        room_nums: 1,
        sales_man_id: reserve.sales_man_id,
        source_id: 0,
        status: 'R',
      };

      if (reserve.guest_type_id == 37) {
        orderInfo.member_card_id = this.state.member_card_id;
      }

      const room = {
        checkin_time: reserve.checkin_time, //入住时间
        checkout_time: reserve.checkout_time, //离店时间
        // hotel_group_id: currentUser.hotel_group_id,
        // hotel_id: currentUser.hotel_id,
        order_info_package,
        prefer_reason_id: reserve.preferReason,
        room_no_id: 0,
        room_rate: reserve.roomRate,
        room_rate_id: reserve.roomPriceCode,
        room_reality_rate: reserve.room_reality_rate,
        room_type_id: reserve.room_type_id,
        days_num: reserve.days_num,
        hours_num: reserve.hours_num,
      };

      // const order = {
      //   order_info: orderInfo,
      //   order_info_package,
      //   rooms: room,
      // };

      const room_no_ids = reserve.room_no_id;
      for (let i = 0; i < reserve.room_nums; i++) {
        // rooms.push(room);
        const order = { order_info: orderInfo, order_info_package, rooms: room };
        if (room_no_ids && room_no_ids.length > i) {
          const rooms = { ...order.rooms, room_no_id: room_no_ids[i] };
          order.rooms = rooms;
        }
        orders.push(order);
      }
    });

    console.log(orders);

    this.setState({ loading: true });
    reserveSubmit(orders).then(rsp => {
      this.setState({ loading: false });
      if (rsp && rsp.code == Constans.SUCCESS) {
        router.push({ pathname: 'orderDetail', query: { orderId: rsp.data } });
      }
    });
  };

  handleChangeOrderType = value => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const checkIn = getFieldValue('checkin_time');
    let checkout_time = moment()
      .hour(checkIn.hour())
      .minute(checkIn.minute())
      .second(checkIn.second());
    if (value == Dict.hourTypeId) {
      const config = JSON.parse(sessionStorage.getItem('config')) || {};
      const hourStar = (config[Dict.hourStartConfCode] && config[Dict.hourStartConfCode].code) || 3;
      checkout_time.add(hourStar, 'hour');
      setFieldsValue({
        checkout_time,
      });
    } else if (value == Dict.orderType[0].id) {
      checkout_time
        .add(1, 'd')
        .hour(this.state.latestLeave[0])
        .minute(this.state.latestLeave[1])
        .second(this.state.latestLeave[2]);
      setFieldsValue({
        checkout_time,
      });
    } else if (value == Dict.orderType[2].id || value == Dict.orderType[3].id) {
      checkout_time
        .add(30, 'd')
        .hour(this.state.latestLeave[0])
        .minute(this.state.latestLeave[1])
        .second(this.state.latestLeave[2]);
      setFieldsValue({
        checkout_time,
      });
    }
    this.getRoomRateCode(null, value, null);
  };

  handleChangeGuestType = value => {
    this.setState({ guestType: value });
    // this.getMarketData(value);

    if (value == 37) {
      this.setState({
        marketArr: [],
        roomPriceCodes: [],
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
    } else if (value == 38) {
      const company_id = this.state.xygs[0] && this.state.xygs[0].id;
      this.setState({ initXygs: company_id });
      this.props.form.setFieldsValue({ company_info_id: company_id });
      this.getCompanyMarkData(company_id);
    } else if (value == 39) {
      const company_id = this.state.travelAgencyArr[0] && this.state.travelAgencyArr[0].id;
      this.setState({ initAgency: company_id });
      this.props.form.setFieldsValue({ company_info_id: company_id });
      this.getCompanyMarkData(company_id);
    } else {
      this.getMarketData(value);
    }
  };

  handleChangeMarket = value => {
    this.getRoomRateCode(value);
  };

  handleCompanyCg = value => {
    this.getCompanyMarkData(value);
  };

  handleCardNoBlur = () => {
    const cardNo = this.props.form.getFieldValue('card_no');
    getMemberCard({ card_no: cardNo }).then(rsp => {
      if (rsp && rsp.code == Constans.SUCCESS) {
        const data = rsp.data || [];
        this.setState({ member_card_id: data[0] && data[0].id });
      }
    });
    this.getMemberMarkData(cardNo);
  };

  handleArrageSelChange = value => {
    this.setState({ arrange: value });
    if (value) {
      this.getRoomNoData();
    }
  };

  handleRoomNoSelChange = value => {
    console.log(value);
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      room_nums: value.length,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const rowSelection = {
      onSelect: (record, selected, selectedRows, e) => {
        this.setState({ selectRows: selectedRows });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 18 },
      },
    };

    return (
      <Spin spinning={this.state.loading}>
        <GridContent>
          {/* <i className={styles.leftIcon}>R</i> */}
          <div>
            <Card style={{ marginTop: '10px' }} bodyStyle={{ padding: 0 }}>
              <div style={{ padding: '12px 24px 24px', marginTop: '30px' }}>
                <Form {...formItemLayout} className={styles.myForm}>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <Form.Item label="订单类型">
                        {getFieldDecorator('order_type_id', {
                          rules: [{ required: true, message: '请选订单类型' }],
                          initialValue: Dict.orderType[0] && Dict.orderType[0].id,
                        })(
                          <Select onChange={value => this.handleChangeOrderType(value)}>
                            {this.state.orderType &&
                              this.state.orderType.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="客户类型">
                        {getFieldDecorator('guest_type_id', {
                          rules: [{ required: true, message: '请选客户类型' }],
                          initialValue: Dict.guestType[0] && Dict.guestType[0].id,
                        })(
                          <Select onChange={value => this.handleChangeGuestType(value)}>
                            {this.state.guestTypeArr &&
                              this.state.guestTypeArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
                                </Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      {this.state.guestType == this.state.guestTypeIds[1] && (
                        <Form.Item label="会员卡号">
                          {getFieldDecorator('card_no', {
                            rules: [{ required: true, message: '请输入会员卡号' }],
                          })(<Input onBlur={() => this.handleCardNoBlur()} />)}
                        </Form.Item>
                      )}
                      {this.state.guestType == this.state.guestTypeIds[2] && (
                        <Form.Item label="协议公司">
                          {getFieldDecorator('company_info_id', {
                            rules: [{ required: true, message: '请选协议公司' }],
                            initialValue: this.state.initXygs,
                          })(
                            <Select
                              placeholder="协议公司"
                              onChange={value => this.handleCompanyCg(value)}
                            >
                              {this.state.xygs.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                      )}
                      {this.state.guestType == this.state.guestTypeIds[3] && (
                        <Form.Item label="中&ensp;/&ensp;旅">
                          {getFieldDecorator('company_info_id', {
                            rules: [{ required: true, message: '请选中/旅' }],
                          })(
                            <Select
                              placeholder="中介/旅行社"
                              onChange={value => this.handleCompanyCg(value)}
                            >
                              {this.state.travelAgencyArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </Form.Item>
                      )}
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <Form.Item label="到&emsp;&emsp;达">
                        {getFieldDecorator('checkin_time', {
                          rules: [{ type: 'object', required: true, message: '请选时间' }],
                          initialValue: this.state.currentTime,
                        })(
                          <DatePicker
                            showTime={{ minuteStep: 15, format: 'HH:mm' }}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={date => this.handChangeArrive(date)}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="离&emsp;&emsp;开">
                        {getFieldDecorator('checkout_time', {
                          rules: [{ type: 'object', required: true, message: '请选时间' }],
                          initialValue: moment()
                            .add(1, 'day')
                            .hour(parseInt(this.state.latestLeave[0]))
                            .minute(parseInt(this.state.latestLeave[1]))
                            .second(parseInt(this.state.latestLeave[2])),
                        })(
                          <DatePicker
                            showTime={{ minuteStep: 15, format: 'HH:mm' }}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={date => this.handChangeLeave(date)}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="最晚保留">
                        {getFieldDecorator('retain_time', {
                          rules: [{ type: 'object', required: true, message: '请选时间' }],
                          initialValue: moment()
                            .hour(18)
                            .minute(0)
                            .second(0),
                        })(
                          <DatePicker
                            showTime={{ minuteStep: 15, format: 'HH:mm' }}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm"
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <Form.Item label="市&emsp;&emsp;场">
                        {getFieldDecorator('market_id', {
                          rules: [{ required: true, message: '请选市场' }],
                        })(
                          <Select onChange={value => this.handleChangeMarket(value)}>
                            {this.state.marketArr &&
                              this.state.marketArr.map(item => (
                                <Option key={item.id} value={item.id}>
                                  {item.description}
                                </Option>
                              ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="房&emsp;&emsp;型">
                        {getFieldDecorator('room_type_id', {
                          rules: [{ required: true, message: '请选房型' }],
                          initialValue: this.state.initRoomType,
                        })(
                          <Select
                            placeholder="请选房型"
                            onChange={value => this.handleRoomTypeChange(value)}
                          >
                            {this.state.roomTypes.map(roomType => (
                              <Option key={roomType.id} value={roomType.id}>
                                {roomType.name}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="房&ensp;价&ensp;码">
                        {getFieldDecorator('room_rate_code', {
                          rules: [{ required: true, message: '请选房价码' }],
                          initialValue: this.state.initPriceCode,
                        })(
                          <Select
                            placeholder="请选房价码"
                            onChange={value => this.handleRoomRateCodeChange(value)}
                          >
                            {this.state.roomPriceCodes.map(roomPrice => (
                              <Option key={roomPrice.id} value={roomPrice.id}>
                                {roomPrice.description}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <Form.Item label="协&ensp;议&ensp;价">
                        {getFieldDecorator('room_rate', {})(<Input disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="首&ensp;日&ensp;价">
                        {getFieldDecorator('room_reality_rate', {
                          rules: [{ required: true, message: '首日价不能为空' }],
                        })(<Input placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="包&emsp;&emsp;价">
                        {getFieldDecorator('packages', {
                          initialValue: this.state.initPackage,
                        })(
                          <Select placeholder="请选包价" mode="multiple">
                            {this.state.packages.map(item => (
                              <Option key={item.id} value={item.id}>
                                {item.description}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <Form.Item label="排&emsp;&emsp;房">
                        {getFieldDecorator('arrange', { initialValue: this.state.arrange })(
                          <Select onChange={this.handleArrageSelChange}>
                            <Option key={0} value={0}>
                              不排房
                            </Option>
                            <Option key={1} value={1}>
                              排房
                            </Option>
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    {!!this.state.arrange && (
                      <Col span={8}>
                        <Form.Item label="房&emsp;&emsp;号">
                          {getFieldDecorator(
                            'room_no_id',
                            {},
                          )(
                            <Select onChange={this.handleRoomNoSelChange} mode="multiple">
                              {this.state.rooms &&
                                this.state.rooms.map(item => (
                                  <Option key={item.id} value={item.id}>
                                    {item.room_no}
                                  </Option>
                                ))}
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <Form.Item label="销&ensp;售&ensp;员">
                        {getFieldDecorator('sales_man_id', {
                          rules: [{ required: true, message: '请选销售员' }],
                          initialValue: this.state.initSalesMan,
                        })(
                          <Select placeholder="请选销售员">
                            {this.state.salesMans.map(salesMan => (
                              <Option key={salesMan.id} value={salesMan.id}>
                                {salesMan.name}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="优惠理由">
                        {getFieldDecorator('prefer_reason_id', {
                          initialValue: this.state.initPreferReason,
                        })(
                          <Select placeholder="请选优惠理由">
                            {this.state.preferReason.map(item => (
                              <Option key={item.id} value={item.id}>
                                {item.description}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="房&ensp;间&ensp;数">
                        {getFieldDecorator('room_nums', { initialValue: 1 })(
                          <InputNumber
                            min={0}
                            max={this.state.roomNums}
                            disabled={this.state.arrange}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={8}>
                      <Form.Item label="预&ensp;订&ensp;人">
                        {getFieldDecorator('reserve_name', {
                          rules: [
                            {
                              required: true,
                              message: '请输入预订人',
                            },
                          ],
                        })(<Input placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="手&ensp;机&ensp;号">
                        {getFieldDecorator('reserve_tel', {
                          // rules: [
                          //   {
                          //     required: true,
                          //     message: '请输入手机号',
                          //   },
                          //   {
                          //     pattern: /^1\d{10}$/,
                          //     message: '手机号格式不正确',
                          //   },
                          // ],
                        })(<Input placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="手动工单">
                        {getFieldDecorator('order_no', {})(<Input placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '10px' }}>
                    <Col span={24}>
                      <Form.Item
                        label="备&emsp;&emsp;注"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                      >
                        {getFieldDecorator('order_desc', {})(<Input placeholder="请输入" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <div className={styles.tableOp}>
                  {/* <button onClick={this.handleAdd}>添加预留</button>
                  <button onClick={this.handleDelete}>删除预留</button> */}
                  <Button type="primary" onClick={this.handleAdd}>
                    添加预留
                  </Button>
                  <Button type="danger" onClick={this.handleDelete}>
                    删除预留
                  </Button>
                </div>
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={this.state.reserves}
                />

                <div className={styles.footer}>
                  <Button type="primary" onClick={this.handleSubmit}>
                    确认
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </GridContent>
      </Spin>
    );
  }
}

export default Form.create()(Reserve);
