import { Modal, Row, Col, Input, Form, message, Select } from 'antd';
import { useEffect } from 'react';
import Constants from '@/constans';
import { useState } from 'react';
import {
  getHotelGroups,
  getAreaCode,
  getHotelByCode,
  getOtaCitiesByName,
  getOtaCitiesById,
  getLocation,
  addHotel,
  updateHotel,
} from '@/services/system/hotel';

const { Option } = Select;

const AddOrUpdate = props => {
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

  const {
    form: { getFieldDecorator },
  } = props;

  useEffect(() => {
    if (props.visible) {
      if (props.formValues) {
        const {
          hotel_group_id,
          code,
          name,
          province,
          city,
          area,
          street,
          address1,
          longtitude,
          latitude,
          phone,
          fax,
          email,
          website,
          star,
          type,
          ota,
        } = props.formValues;
        if (province) {
          const p = provinces.filter(item => item.division_no == province);
          if (p && p.length > 0) {
            getAreaCode(p[0].id).then(rsp => {
              if (rsp && rsp.code == Constants.SUCCESS) {
                const cityList = rsp.data || [];
                setCities(cityList);
                if (city) {
                  const c = cityList.filter(item => item.division_no == city);
                  if (c && c.length > 0) {
                    getAreaCode(c[0].id).then(rsp => {
                      if (rsp && rsp.code == Constants.SUCCESS) {
                        const areaList = rsp.data || [];
                        setAreas(areaList);
                        if (area) {
                          const a = areaList.filter(item => item.division_no == area);
                          if (a && a.length > 0) {
                            getAreaCode(a[0].id).then(rsp => {
                              if (rsp && rsp.code == Constants.SUCCESS) {
                                const streelList = rsp.data || [];
                                setStreets(streelList);
                              }
                            });
                          }
                        }
                      }
                    });
                  }
                }
              }
            });
          }
        }

        props.form.setFieldsValue({
          hotel_group_id,
          code,
          name,
          province,
          city,
          area,
          street,
          address1,
          longtitude,
          latitude,
          phone,
          fax,
          email,
          website,
          star,
          type,
          ota,
        });
      } else {
        props.form.resetFields();
      }
    }
  }, [props.visible]);

  useEffect(() => {
    if (props.visible && props.formValues) {
      const { ota, city_id } = props.formValues;
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
    }
  }, [props.formValues && props.formValues.ota, props.visible]);

  useEffect(() => {
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

  const [loading, setLoading] = useState(false);

  const [isOta, setIsOta] = useState(false);
  const [otaCities, setOtaCities] = useState([]);

  const [hotelGroups, setHotelGroups] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [streets, setStreets] = useState([]);

  const handleProviceCg = (value, option) => {
    const pid = parseInt(option.key);
    getAreaCode(pid).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        setCities(list);
      }
    });
  };

  const handleCodeBlur = e => {
    let code = e.target.value;
    if (code) {
      code = code.toUpperCase();
      props.form.setFieldsValue({ code });
      getHotelByCode(code).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const list = rsp.data;
          if (list && list.length > 0) {
            message.warning('该编码已存在,请修改');
          }
        }
      });
    }
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

  const handleSubmit = () => {
    props.form.validateFields((err, fieldsValue) => {
      if (err == null) {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const { id: create_user } = currentUser;
        const modify_user = create_user;
        if (props.isAdd) {
          setLoading(true);
          addHotel({ ...fieldsValue, create_user, modify_user }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        } else {
          setLoading(true);
          updateHotel({ ...fieldsValue, id: props.formValues.id, modify_user }).then(rsp => {
            setLoading(false);
            if (rsp && rsp.code == Constants.SUCCESS) {
              message.success(rsp.message || '添加成功');
              props.handleCancel(true);
            }
          });
        }
      }
    });
  };

  return (
    <Modal
      title="酒店"
      width={720}
      visible={props.visible}
      onCancel={() => props.handleCancel()}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form {...formItemLayout}>
        <Row gutter={8} type="flex">
          <Col span={12}>
            <Form.Item label="集团">
              {getFieldDecorator('hotel_group_id', {
                rules: [{ required: true, message: '集团' }],
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
          <Col span={12}>
            <Form.Item label="编码">
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '登陆编码' }],
              })(<Input placeholder="登陆编码" onBlur={e => handleCodeBlur(e)} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="酒店名称">
              {getFieldDecorator('name', { rules: [{ required: true, message: '酒店名称' }] })(
                <Input placeholder="酒店名称" />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="省份">
              {getFieldDecorator('province', {
                rules: [{ required: true, message: '省份' }],
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
          <Col span={12}>
            <Form.Item label="市">
              {getFieldDecorator('city', {
                rules: [{ required: true, message: '市' }],
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
          <Col span={12}>
            <Form.Item label="区、县">
              {getFieldDecorator('area', {
                rules: [{ required: true, message: '区、县' }],
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
          <Col span={12}>
            <Form.Item label="街道">
              {getFieldDecorator('street', {
                rules: [{ required: true, message: '街道' }],
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
          <Col span={12}>
            <Form.Item label="地址">
              {getFieldDecorator('address1', {
                rules: [{ required: true, message: '地址' }],
              })(<Input onBlur={() => handleAddressBlur()} placeholder="楼栋门牌" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="经度">
              {getFieldDecorator('longtitude', {})(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="纬度">
              {getFieldDecorator('latitude', {})(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电话">{getFieldDecorator('phone', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="传真">{getFieldDecorator('fax', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="邮箱">{getFieldDecorator('email', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="网站">{getFieldDecorator('website', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="星级">{getFieldDecorator('star', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="酒店类型">{getFieldDecorator('type', {})(<Input />)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="OTA">
              {getFieldDecorator(
                'ota',
                {},
              )(
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
            <Col span={12}>
              <Form.Item label="OTA城市">
                {getFieldDecorator(
                  'city_id',
                  {},
                )(
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
      </Form>
    </Modal>
  );
};

export default Form.create()(AddOrUpdate);
