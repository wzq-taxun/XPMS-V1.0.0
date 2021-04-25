import styles from './style.less';
import { Row, Col, Select, Button, Input, Form, InputNumber, message } from 'antd';
import { useState, useEffect } from 'react';
import {
  getMarket,
  getSource,
  getCanal,
  getRoomRateCode,
  getActivity,
  getPackages,
  getSalesMan,
  checkInSubmit,
  getCompanyInfo,
  getMedium,
  getMemberMarket,
  getCompanyMarket,
  getRoomRate,
} from '@/services/checkIn';
import Constants from '@/constans';
import { connect } from 'dva';
import Dict from '@/dictionary';
import { getMemberCard } from '@/services/member';
const { Option } = Select;

const MarketInfoPanel = props => {
  const [market, setMarket] = useState([]);
  const [source, setSource] = useState([]);
  const [canal, setCanal] = useState([]);
  const [roomRateCode, setRoomRateCode] = useState([]);
  const [activity, setActivity] = useState([]);
  const [packages, setPackages] = useState([]);
  const [salesMan, setSalesMan] = useState([]);
  const [guestType, setGuestType] = useState(props.guest_type_id);
  const [company, setCompany] = useState([]);
  const [travelAgency, setTravelAgency] = useState([]);
  const [initCompId, setInitCompId] = useState(props.company_info_id);
  const [memberCardNo, setMemberCardNo] = useState(null);
  const [memberCardId, setMemberCardId] = useState(null);

  const {
    card_no,
    room_type_id,
    market_id,
    source_id,
    canals_id,
    room_rate_id,
    order_packages_ids,
    sales_man_id,
    order_type_id,
    checkin_time,
    checkout_time,
    member_card_id,
  } = props;
  useEffect(() => {
    const {
      form: { setFieldsValue },
    } = props;

    const { guest_type_id, company_info_id } = props;
    setGuestType(guest_type_id);
    setInitCompId(props.company_info_id);

    setFieldsValue({ guest_type_id });

    if (guest_type_id == Dict.guestType[0].id) {
      getMarketData(guest_type_id, true);
    } else if (guest_type_id == Dict.guestType[1].id) {
      getMemberCard({ id: member_card_id }).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          const card_no = data[0] && data[0].card_no;
          setFieldsValue({ card_no });
          getMemberMarkData(card_no, true);
        }
      });
    } else if (guest_type_id == Dict.guestType[2].id || guest_type_id == Dict.guestType[3].id) {
      getCompanyMarkData(company_info_id, true);
    }

    getSource().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setSource(rsp.data || []);
        if (source_id) {
          setFieldsValue({ source_id: source_id });
        }
      }
    });

    getCanal().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setCanal(rsp.data || []);
        if (canals_id) {
          setFieldsValue({ canals_id: canals_id });
        }
      }
    });

    getRoomRateCodeData(market_id, guest_type_id, true);

    getPackages().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setPackages(rsp.data || []);
        let packagesStr = order_packages_ids;
        if (packagesStr && packagesStr.endsWith(',')) {
          packagesStr = packagesStr.substring(0, packagesStr.length - 1);
        }
        let packages =
          packagesStr &&
          packagesStr.split(',').map(item => {
            if (item) {
              return parseInt(item);
            }
          });

        console.log(packages);
        if (packages) {
          setFieldsValue({ order_packages_ids: packages });
        }
      }
    });

    getSalesMan().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        setSalesMan(rsp.data || []);
        if (sales_man_id) {
          setFieldsValue({ sales_man_id: sales_man_id });
        }
      }
    });
  }, [props.id]);

  useEffect(() => {
    getCompanyInfoData(true);
    getTravelAgencyData(true);
  }, []);

  //获取市场
  const getMarketData = (guest_type_id, init) => {
    if (!guest_type_id) {
      guest_type_id = props.guest_type_id;
    }

    getMarket({ guest_type_id }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setMarket(data);

        const {
          form: { setFieldsValue },
        } = props;
        if (init) {
          setFieldsValue({ market_id });
          getRoomRateCodeData(market_id, null, true);
        } else {
          setFieldsValue({ market_id: data[0] && data[0].id });
          getRoomRateCodeData(data[0] && data[0].id);
        }
      }
    });
  };

  const getMemberMarkData = (card_no, init) => {
    getMemberMarket(card_no).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setMarket(data);

        const {
          form: { setFieldsValue },
        } = props;
        if (init) {
          setFieldsValue({ market_id });
          getRoomRateCodeData(market_id, null, true);
        } else {
          setFieldsValue({ market_id: data[0] && data[0].id });
          getRoomRateCodeData(data[0] && data[0].id);
        }
      }
    });
  };

  const getCompanyMarkData = (company_info_id, init) => {
    if (company_info_id) {
      getCompanyMarket(company_info_id).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          setMarket(data);

          const {
            form: { setFieldsValue },
          } = props;
          if (init) {
            setFieldsValue({ market_id });
            getRoomRateCodeData(market_id, null, true);
          } else {
            setFieldsValue({ market_id: data[0] && data[0].id });
            getRoomRateCodeData(data[0] && data[0].id);
          }
        }
      });
    }
  };

  // 获取协议公司
  const getCompanyInfoData = init => {
    getCompanyInfo().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setCompany(data);

        const {
          form: { setFieldsValue },
        } = props;
        if (init) {
          setFieldsValue({
            company_info_id: props.company_info_id,
          });
        } else {
          setFieldsValue({ company_info_id: data[0] && data[0].id });
        }
      }
    });
  };

  // 获取中介旅行社
  const getTravelAgencyData = init => {
    getMedium().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setTravelAgency(data);

        const {
          form: { setFieldsValue },
        } = props;
        if (init) {
          setFieldsValue({
            company_info_id: props.company_info_id,
          });
        } else {
          setFieldsValue({ company_info_id: data[0] && data[0].id });
        }
      }
    });
  };

  // 获取房价码
  const getRoomRateCodeData = (market_id, guest_type_id, init) => {
    const {
      form: { getFieldValue },
    } = props;
    market_id = market_id || getFieldValue('market_id');
    guest_type_id = guest_type_id || getFieldValue('guest_type_id');
    const param = { market_id, order_type_id: order_type_id, guest_type_id };
    getRoomRateCode(param).then(rsp => {
      const {
        form: { setFieldsValue },
      } = props;
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setRoomRateCode(data);

        if (init) {
          setFieldsValue({
            room_rate_id: room_rate_id,
          });
        } else {
          setFieldsValue({
            room_rate_id: data[0] && data[0].id,
          });
        }

        getRoomRateData(data[0] && data[0].id);
      } else {
        setFieldsValue({
          room_rate_id: null,
          room_reality_rate: null,
        });
      }
    });
  };

  // 获取房价
  const getRoomRateData = code_room_rate_id => {
    if (!code_room_rate_id) return;
    const param = {
      room_type_id: room_type_id,
      code_room_rate_id,
      date_start_end: checkin_time,
      date_end_sta: checkout_time,
    };
    getRoomRate(param).then(rsp => {
      const {
        form: { setFieldsValue },
      } = props;
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data;
        setFieldsValue({
          room_reality_rate: data,
        });
      } else {
        setFieldsValue({
          room_reality_rate: null,
        });
      }
    });
  };

  const handleChangeGuestType = value => {
    setGuestType(value);

    if (value == 37) {
      const {
        form: { setFieldsValue },
      } = props;
      setFieldsValue({
        market_id: null,
        room_rate_id: null,
        room_reality_rate: null,
      });
      setMarket([]);
      setRoomRateCode([]);
    } else if (value == 38) {
      const {
        form: { setFieldsValue },
        company_info_id,
      } = props;
      const company_id = company[0] && company[0].id;
      setInitCompId(company_id);
      setFieldsValue({ company_info_id: company_info_id });
      getCompanyMarkData(company_id);
    } else if (value == 39) {
      const {
        form: { setFieldsValue },
        company_info_id,
      } = props;
      const company_id = travelAgency[0] && travelAgency[0].id;
      setInitCompId(company_id);
      setFieldsValue({ company_info_id: company_info_id });
      getCompanyMarkData(company_id);
    } else {
      getMarketData(value);
    }
  };

  const handleCardNoBlur = () => {
    const cardNo = props.form.getFieldValue('card_no');
    getMemberCard({ card_no: cardNo }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        // this.setState({ member_card_id: data[0] && data[0].id });
        setMemberCardId(data[0] && data[0].id);
      }
    });
    getMemberMarkData(cardNo);
  };

  const handleCompanyCg = value => {
    getCompanyMarkData(value);
  };

  const handleChangeMarket = value => {
    getRoomRateCodeData(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);

        let order_info_package = [];
        values.order_packages_ids &&
          values.order_packages_ids.map(item => {
            order_info_package.push({
              packages_id: item,
              order_info_room_id: props.order_info_room_id,
              room_no_id: props.room_no_id,
            });
          });

        let member_card_id = null;
        if (values.guest_type_id == Dict.guestType[1].id) {
          member_card_id = memberCardId;
        }

        const order = {
          order_info: {
            id: props.id,
            guest_type_id: values.guest_type_id,
            company_info_id: values.company_info_id,
            member_card_id: member_card_id,
            market_id: values.market_id,
            source_id: values.source_id,
            canals_id: values.canals_id,
            sales_man_id: values.sales_man_id,
          },
          rooms: {
            id: props.order_info_room_id,
            room_rate_id: values.room_rate_id,
            room_reality_rate: values.room_reality_rate,
          },
          order_info_package,
        };

        console.log(order);

        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'global/changeLoading',
            payload: true,
          });
          checkInSubmit(order).then(rsp => {
            dispatch({
              type: 'global/changeLoading',
              payload: false,
            });
            if (rsp && rsp.code == Constants.SUCCESS) {
              console.log(rsp);
              message.info('更新成功');
            }
          });
        }

        // checkInSubmit(order).then(rsp => {
        //   console.log(rsp);
        // });
      }
    });
  };

  const {
    form: { getFieldDecorator },
  } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };

  return (
    <Form {...formItemLayout} className={styles.panelForm} onSubmit={handleSubmit}>
      <Form.Item label="客户类型">
        {getFieldDecorator('guest_type_id', {
          rules: [{ required: true, message: '请选客户类型' }],
        })(
          <Select onChange={value => handleChangeGuestType(value)}>
            {Dict.guestType &&
              Dict.guestType.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>,
        )}
      </Form.Item>
      {guestType == Dict.guestType[1].id && (
        <Form.Item label="会员卡号">
          {getFieldDecorator('card_no', {
            rules: [{ required: true, message: '请输入会员卡号' }],
          })(<Input onBlur={() => handleCardNoBlur()} />)}
        </Form.Item>
      )}
      {guestType == Dict.guestType[2].id && (
        <Form.Item label="协议公司">
          {getFieldDecorator('company_info_id', {
            rules: [{ required: true, message: '请选协议公司' }],
            initialValue: props.company_info_id,
          })(
            <Select placeholder="协议公司" onChange={value => handleCompanyCg(value)}>
              {company.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      )}
      {guestType == Dict.guestType[3].id && (
        <Form.Item label="中&ensp;/&ensp;旅">
          {getFieldDecorator('company_info_id', {
            rules: [{ required: true, message: '请选中/旅' }],
            initialValue: props.company_info_id,
          })(
            <Select placeholder="中介/旅行社" onChange={value => handleCompanyCg(value)}>
              {travelAgency.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      )}
      <Form.Item label="市场">
        {getFieldDecorator('market_id', {
          rules: [
            {
              required: true,
              message: '请选择市场',
            },
          ],
        })(
          <Select onChange={value => handleChangeMarket(value)}>
            {market.map(item => (
              <Option key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="来源">
        {getFieldDecorator('source_id', {
          rules: [
            {
              required: true,
              message: '请选择来源',
            },
          ],
        })(
          <Select>
            {source.map(item => (
              <Option key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="渠道">
        {getFieldDecorator('canals_id', {
          rules: [
            {
              required: true,
              message: '请选择渠道',
            },
          ],
        })(
          <Select>
            {canal.map(item => (
              <Option key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="房价码">
        {getFieldDecorator('room_rate_id', {
          rules: [
            {
              required: true,
              message: '请选择房价码',
            },
          ],
        })(
          <Select>
            {roomRateCode.map(item => (
              <Option key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="房价">
        {getFieldDecorator('room_reality_rate', {
          rules: [
            {
              required: true,
              message: '请输入房价',
            },
          ],
          initialValue: props.room_reality_rate,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="包价">
        {getFieldDecorator(
          'order_packages_ids',
          {},
        )(
          <Select mode="multiple">
            {packages.map(item => (
              <Option key={item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="销售员">
        {getFieldDecorator(
          'sales_man_id',
          {},
        )(
          <Select>
            {salesMan.map(item => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {props.status && (props.status == 'I' || props.status == 'R' || props.status == 'RG') && (
        <Form.Item wrapperCol={{ offset: 16 }}>
          <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>
            确认
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(
  Form.create()(MarketInfoPanel),
);
