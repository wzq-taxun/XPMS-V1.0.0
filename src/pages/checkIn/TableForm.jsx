import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Table, message, Select, InputNumber } from 'antd';
import React, { Fragment, Component } from 'react';
import { scanCard, uploadBaseImg, upGuestBase } from '@/services/checkIn';
import isEqual from 'lodash.isequal';
import styles from './style.less';
import Constants from '@/constans';
import moment from 'moment';
import socket from '@/utils/socket/socket';
import Dict from '@/dictionary';
import { getLocalIp } from '@/utils/ipUtil';
import { getSenseTimeDevice } from '@/services/global';
import { getequipmentconfiglist } from '@/services/equipment';
import JsonP from 'jsonp';

const { Option } = Select;

class TableForm extends Component {
  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }

    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  clickedCancel = false;

  index = 0;

  currentKey = null;

  cacheOriginData = {};

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
      render: (text, record) => {
        return (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'name', record.key)}
            onBlur={e => this.handleCheck('name', text, record)}
            placeholder="成员姓名"
          />
        );
      },
    },
    {
      title: '证件类型',
      dataIndex: 'credential_type',
      key: 'credential_type',
      width: '10%',
      render: (text, record) => {
        return (
          <Select
            defaultValue="1"
            onChange={value => this.handleSelectFieldChange(value, 'credential_type', record.key)}
          >
            <Option value="1">身份证</Option>
            <Option value="2">护照</Option>
          </Select>
        );
      },
    },
    {
      title: '证件号码',
      dataIndex: 'credential_no',
      key: 'credential_no',
      width: '20%',
      render: (text, record) => {
        return (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'credential_no', record.key)}
            onBlur={e => this.handleCheck('IDCardNo', text, record)}
            placeholder="证件号码"
          />
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: '20%',
      render: (text, record) => {
        return (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'phone_number', record.key)}
            onBlur={e => this.handleCheck('phone', text, record)}
            placeholder="手机号"
          />
        );
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: '30%',
      render: (text, record) => {
        return (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'address', record.key)}
            onBlur={e => this.handleCheck('address', text, record)}
            placeholder="地址"
          />
        );
      },
    },
    // {
    //   title: '会员卡号',
    //   dataIndex: 'member_no',
    //   key: 'member_no',
    //   width: '20%',
    //   render: (text, record) => {
    //     return (
    //       <Input
    //         value={text}
    //         onChange={e => this.handleFieldChange(e, 'member_no', record.key)}
    //         placeholder="会员卡号"
    //       />
    //     );
    //   },
    // },
    // {
    //   title: '会员等级',
    //   dataIndex: 'memberLevel',
    //   key: 'memberLevel',
    //   width: '10%',
    //   render: (text, record) => {
    //     return (
    //       <InputNumber
    //         value={text}
    //         onChange={value => this.handleSelectFieldChange(value, 'memberLevel', record.key)}
    //         placeholder="会员等级"
    //       />
    //     );
    //   },
    // },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <>
            <span>
              <a onClick={() => this.handleScanCard(record)}>读卡</a>
            </span>
            <Divider type="vertical" />
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
      scanType: Dict.cardScan,
      iframeUrl: '',
    };
  }

  componentDidMount() {
    const config = JSON.parse(sessionStorage.getItem('config')) || {};
    const scanConf = config[Dict.scanCardConfCode] && config[Dict.scanCardConfCode].code;
    if (scanConf) {
      this.setState({ scanType: scanConf });
    }
    if (scanConf == Dict.peopleCard) {
      // getLocalIp(ip => {
      //   console.log(ip);
      //   let pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g;
      //   if (pattern.test(ip)) {
      //     getSenseTimeDevice(ip).then(rsp => {
      //       if (rsp && rsp.code == Constants.SUCCESS) {
      //         const device_id = rsp.data.device_id;
      //         socket.created({ id: device_id, onMessage: this.onSocketMsg });
      //       }
      //     });
      //   } else {
      //     socket.created({ id: 'SID020S19E00530', onMessage: this.onSocketMsg });
      //   }
      // });

      getequipmentconfiglist().then(rsp => {
        if (rsp.code && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          if (data.length > 0) {
            const device_id = data[0].device_id;
            socket.created({ id: device_id, onMessage: this.onSocketMsg });
          }
        }
      });
    }
  }

  componentWillUnmount() {
    socket.destroyed();
  }

  onSocketMsg = e => {
    console.log(e.data);
    const msg = JSON.parse(e.data);
    const { data = [] } = this.state;
    const newData = [...data];
    for (let i = 0; i < newData.length; i++) {
      if (!newData[i].credential_no) {
        const guest_base = msg.guest_base || {};
        newData[i].guest_base_id = guest_base.id;
        newData[i].name = guest_base.name;
        newData[i].credential_no = guest_base.credential_no;
        newData[i].sex = guest_base.sex;
        newData[i].credential_image = guest_base.credential_image;
        newData[i].face_image = msg.face_image;
        newData[i].verify_result = msg.verify_result;
        newData[i].verify_score = msg.verify_score;
        newData[i].address = guest_base.address;
        break;
      }
    }

    this.setState({
      data: newData,
    });

    const { onChange } = this.props;
    if (onChange) {
      onChange(newData);
    }
  };

  handleScanCard(record) {
    if (this.state.scanType == Dict.cardScan) {
      this.JLScanCard(record);
    }
  }

  JLScanCard(record) {
    this.currentKey = record.key;

    // JsonP的跨域请求
    JsonP('http://localhost:8989/api/ReadMsg?waitTime=3&readOnce=1', {}, (err, rsp) => {
      console.log(err);
      console.log(rsp);
      if (rsp === 'undefined') return message.warning('读卡失败,请重新放入卡机读卡');
      if (rsp && rsp.code !== '0')
        return message.warning(rsp.message || '读卡失败,请重新放入卡机读卡');

      const { data = [] } = this.state;
      const newData = [...data];
      const target = this.getRowByKey(this.currentKey, newData);
      if (target) {
        target.name = rsp.name;
        target.credential_no = rsp.cardno;
        target.sex = rsp.sex == '男' ? '1' : '2';
        target.nation = rsp.nation;
        target.birthday = moment(rsp.born).format('YYYY-MM-DD HH:mm:ss');
        target.credential_validate_start = moment(rsp.userlifeb).format('YYYY-MM-DD HH:mm:ss');
        target.credential_validate_end = moment(rsp.userlifee).format('YYYY-MM-DD HH:mm:ss');
        target.address = rsp.address;
        target.credential_image = rsp.photobase64;
        this.setState({
          data: newData,
        });

        const { onChange } = this.props;
        if (onChange) {
          onChange(newData);
        }
        this.upGuestBaseInfo(target);
      }
    });

    // scanCard().then(rsp => {
    //   if (rsp && rsp.code == '0') {
    //     console.log(rsp);

    //     const { data = [] } = this.state;
    //     const newData = [...data];
    //     const target = this.getRowByKey(this.currentKey, newData);
    //     if (target) {
    //       target.name = rsp.name;
    //       target.credential_no = rsp.cardno;
    //       target.sex = rsp.sex == '男' ? '1' : '2';
    //       target.nation = rsp.nation;
    //       target.birthday = moment(rsp.born).format('YYYY-MM-DD HH:mm:ss');
    //       target.credential_validate_start = moment(rsp.userlifeb).format('YYYY-MM-DD HH:mm:ss');
    //       target.credential_validate_end = moment(rsp.userlifee).format('YYYY-MM-DD HH:mm:ss');
    //       target.address = rsp.address;
    //       target.credential_image = rsp.photobase64;
    //       this.setState({
    //         data: newData,
    //       });

    //       const { onChange } = this.props;
    //       if (onChange) {
    //         onChange(newData);
    //       }
    //       this.upGuestBaseInfo(target);
    //     }
    //   }
    // });
  }

  upGuestBaseInfo(record) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const { id: create_user } = currentUser || {};
    upGuestBase({ ...record, create_user, modify_user: create_user }).then(rsp => {
      console.log(rsp);
      if (rsp && rsp.code == Constants.SUCCESS) {
        if (record.key) {
          const { data = [] } = this.state;
          const newData = [...data];
          const target = this.getRowByKey(record.key, newData);
          target.guest_base_id = rsp.data && rsp.data.guest_base_id;
          target.face_image = rsp.data && rsp.data.face_image;
          this.setState({
            data: newData,
          });

          const { onChange } = this.props;
          if (onChange) {
            onChange(newData);
          }
        }
      }
    });
  }

  getRowByKey(key, newData) {
    const { data = [] } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  handleCheck(type, value, record) {
    if (type == 'IDCardNo') {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value) === false) {
        message.error('身份证格式不正确');
      } else {
        // if (!record.sex) {
        const sexStr = record.credential_no.charAt(record.credential_no.length - 2);
        if (parseInt(sexStr) % 2 == 0) {
          record.sex = '2';
        } else {
          record.sex = '1';
        }
        // }
        // if (!record.birthday) {
        const birth = record.credential_no.substring(6, 14);
        record.birthday = moment(birth).format('YYYY-MM-DD HH:mm:ss');
        // }
        if (record.name) {
          this.upGuestBaseInfo(record);
        }
      }
    } else if (type == 'phone') {
      const reg = /(^\d{11}$)/;
      if (reg.test(value) === false) {
        message.error('电话格式不正确');
      }
    } else if (type == 'name') {
      if (!value || value.trim() == '') {
        message.error('姓名不能为空');
      } else {
        if (value.length > 20) {
          message.error('姓名过长');
        } else {
          if (record.credential_no) {
            this.upGuestBaseInfo(record);
          }
        }
      }
    } else if (type == 'address') {
      if (!value || value.trim() == '') {
        message.error('地址不能为空');
      } else {
        if (record.credential_no) {
          this.upGuestBaseInfo(record);
        }
      }
    }
  }

  newMember = () => {
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      name: '',
      credential_type: '1',
      credential_no: '',
      phone_number: '',
      address: '',
      // member_no: '',
      // memberLevel: 0,
      // editable: true,
      // isNew: true,
      hotel_id: currentUser.hotel_id,
      hotel_group_id: currentUser.hotel_group_id,
      modify_user: currentUser.id,
      create_user: currentUser.id,
    });
    this.index += 1;
    this.setState({
      data: newData,
    });

    const { onChange } = this.props;
    if (onChange) {
      onChange(newData);
    }
  };

  remove(key) {
    const { data = [] } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({
      data: newData,
    });

    if (onChange) {
      onChange(newData);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(key, newData);

    if (target) {
      target[fieldName] = e.target.value;
      this.setState({
        data: newData,
      });

      const { onChange } = this.props;
      if (onChange) {
        onChange(newData);
      }
    }
  }

  handleSelectFieldChange(value, fieldName, key) {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(key, newData);

    if (target) {
      target[fieldName] = value;
      this.setState({
        data: newData,
      });
    }

    const { onChange } = this.props;
    if (onChange) {
      onChange(newData);
    }
  }

  render() {
    const { loading, data } = this.state;
    return (
      <Fragment>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={data}
          bordered={false}
          pagination={false}
          // rowClassName={record => (record.editable ? styles.editable : '')}
          rowClassName={styles.editable}
          size="middle"
          scroll={{ y: 90 }}
          style={{ maxHeight: '130px', minHeight: '130px' }}
        />
        <div style={{ textAlign: 'center' }}>
          <Button
            style={{
              width: '140px',
              marginTop: 16,
              marginBottom: 8,
            }}
            type="primary"
            onClick={this.newMember}
          >
            <PlusOutlined />
            添加
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default TableForm;
