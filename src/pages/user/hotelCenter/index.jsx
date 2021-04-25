import { Button, Input, Select, Upload, Form, message, Icon, Row, Col } from 'antd';
import { connect } from 'dva';
import Constants from '@/constans';
import { useState, useEffect } from 'react';
import {
  getHotelByCode,
  getAreaCode,
  getHotelGroups,
  getOtaCitiesByName,
  getLocation,
  getOtaCitiesById,
  updateHotel,
} from '@/services/system/hotel';
import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';

const { Option } = Select;

const HotelCenter = props => {
  const [hotel, setHotel] = useState({});
  const [hotelGroups, setHotelGroups] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [streets, setStreets] = useState([]);

  const [isOta, setIsOta] = useState(false);
  const [otaCities, setOtaCities] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.hotelCode) {
      getHotelByCode(currentUser.hotelCode).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data;
          if (data && data.length > 0) {
            setHotel(data[0]);
          }
        }
      });
    }

    getHotelGroups().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setHotelGroups(list);
      }
    });

    getAreaCode(0).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setProvinces(list);
      }
    });
  }, []);

  useEffect(() => {
    if (provinces.length > 0) {
      const p = provinces.filter(item => item.division_no == hotel.province);
      if (p && p.length > 0) {
        getAreaCode(p[0].id).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            const cityList = rsp.data || [];
            setCities(cityList);
          }
        });
      }
    }
  }, [provinces]);

  useEffect(() => {
    if (cities.length > 0) {
      const c = cities.filter(item => item.division_no == hotel.city);
      if (c && c.length > 0) {
        getAreaCode(c[0].id).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            const areaList = rsp.data || [];
            setAreas(areaList);
          }
        });
      }
    }
  }, [cities]);

  useEffect(() => {
    if (areas.length > 0) {
      const a = areas.filter(item => item.division_no == hotel.area);
      if (a && a.length > 0) {
        getAreaCode(a[0].id).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            const streetList = rsp.data || [];
            setStreets(streetList);
          }
        });
      }
    }
  }, [areas]);

  useEffect(() => {
    const { ota, city_id } = hotel;
    if (ota == '1') {
      setIsOta(true);
      if (city_id) {
        getOtaCitiesById(city_id).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            const data = rsp.data;
            if (data) {
              setOtaCities([data]);
              props.form.setFieldsValue({ city_id });
            }
          } else {
            setOtaCities([]);
          }
        });
      }
    } else {
      setIsOta(false);
    }
  }, [hotel.ota]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { id: modify_user } = currentUser;

        updateHotel({ ...fieldsValue, id: hotel.id, modify_user }).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '添加成功');
          }
        });
      }
    });
  };

  const handleProviceCg = (value, option) => {
    const pid = parseInt(option.key);
    getAreaCode(pid).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setCities(list);
      }
    });
  };

  const handleCityCg = (value, option) => {
    const pid = parseInt(option.key);
    getAreaCode(pid).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setAreas(list);
      }
    });
  };

  const handleAreaCg = (value, option) => {
    const pid = parseInt(option.key);
    getAreaCode(pid).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setStreets(list);
      }
    });
  };

  let timer;

  const getOtaCityData = name => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    function getOta() {
      getOtaCitiesByName(name).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const list = rsp.data || [];
          setOtaCities(list);
        } else {
          setOtaCities([]);
        }
      });
    }

    timer = setTimeout(getOta, 300);
  };

  const handleOtaSearch = value => {
    if (value) {
      getOtaCityData(value);
    } else {
      setOtaCities([]);
    }
  };

  const handleAddressBlur = () => {
    const {
      form: { getFieldValue },
    } = props;

    const provinceCode = getFieldValue('province');
    const province = provinces.filter(item => item.division_no == provinceCode);
    if (null == province || province.length < 1) {
      return;
    }
    const provinceName = province[0].division_name;

    const cityCode = getFieldValue('city');
    const city = cities.filter(item => item.division_no == cityCode);
    if (null == city || city.length < 1) {
      return;
    }
    const cityName = city[0].division_name;

    const areaCode = getFieldValue('area');
    const area = areas.filter(item => item.division_no == areaCode);
    if (null == area || area.length < 1) {
      return;
    }
    const areaName = area[0].division_name;

    const streetCode = getFieldValue('street');
    const street = streets.filter(item => item.division_no == streetCode);
    if (null == street || street.length < 1) {
      return;
    }
    const streetName = street[0].division_name;

    const address1 = getFieldValue('address1') || '';
    const address = provinceName + cityName + areaName + streetName + address1;
    console.log(address);
    getLocation(address).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || {};
        const location = data.location;
        if (location) {
          props.form.setFieldsValue({ longtitude: location.lng, latitude: location.lat });
        }
      }
    });
  };

  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };

  return (
    <GridContent style={{ background: '#fff' }}>
      <div className={styles.header}>酒店设置</div>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Row type="flex" gutter={16}>
          <Col span={8}>
            <Form.Item label="集团">
              {getFieldDecorator('hotel_group_id', {
                rules: [{ required: true, message: '集团' }],
                initialValue: hotel.hotel_group_id,
              })(
                <Select>
                  {hotelGroups.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="编码">
              <Input value={hotel.code} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="名称">
              {getFieldDecorator('phone', {
                initialValue: hotel.name,
                rules: [
                  {
                    required: true,
                    message: '酒店名称不能为空',
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="省份">
              {getFieldDecorator('province', {
                rules: [{ required: true, message: '省份' }],
                initialValue: hotel.province,
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={(value, option) => {
                    handleProviceCg(value, option);
                  }}
                >
                  {provinces.map(item => (
                    <Option key={item.id} value={item.division_no}>
                      {item.division_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="市">
              {getFieldDecorator('city', {
                rules: [{ required: true, message: '市' }],
                initialValue: hotel.city,
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={(value, option) => {
                    handleCityCg(value, option);
                  }}
                >
                  {cities.map(item => (
                    <Option key={item.id} value={item.division_no}>
                      {item.division_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="区、县">
              {getFieldDecorator('area', {
                rules: [{ required: true, message: '区、县' }],
                initialValue: hotel.area,
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={(value, option) => {
                    handleAreaCg(value, option);
                  }}
                >
                  {areas.map(item => (
                    <Option key={item.id} value={item.division_no}>
                      {item.division_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="街道">
              {getFieldDecorator('street', {
                rules: [{ required: true, message: '街道' }],
                initialValue: hotel.street,
              })(
                <Select showSearch optionFilterProp="children">
                  {streets.map(item => (
                    <Option key={item.id} value={item.division_no}>
                      {item.division_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="地址">
              {getFieldDecorator('address1', {
                rules: [{ required: true, message: '地址' }],
                initialValue: hotel.address1,
              })(<Input onBlur={() => handleAddressBlur()} placeholder="楼栋门牌" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="经度">
              {getFieldDecorator('longtitude', { initialValue: hotel.longtitude })(
                <Input disabled />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="纬度">
              {getFieldDecorator('latitude', { initialValue: hotel.latitude })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="电话">
              {getFieldDecorator('phone', { initialValue: hotel.phone })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="传真">
              {getFieldDecorator('fax', { initialValue: hotel.fax })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', { initialValue: hotel.email })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="网站">
              {getFieldDecorator('website', { initialValue: hotel.website })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="星级">
              {getFieldDecorator('star', { initialValue: hotel.star })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="酒店类型">
              {getFieldDecorator('type', { initialValue: hotel.type })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="OTA">
              {getFieldDecorator('ota', { initialValue: hotel.ota })(
                <Select
                  onChange={value => {
                    if (value == '0') {
                      setIsOta(false);
                    } else {
                      setIsOta(true);
                    }
                  }}
                >
                  <Option key="0" value="0">
                    不对接
                  </Option>
                  <Option key="1" value="1">
                    对接
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          {isOta && (
            <Col span={8}>
              <Form.Item label="OTA城市">
                {getFieldDecorator('city_id', { initialValue: hotel.city_id })(
                  <Select
                    showSearch
                    filterOption={false}
                    onSearch={value => handleOtaSearch(value)}
                  >
                    {otaCities.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.city_name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button htmlType="submit" type="primary">
              提交
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </GridContent>
  );
};

export default connect(({ login }) => ({
  currentUser: login.currentUser,
}))(Form.create()(HotelCenter));
