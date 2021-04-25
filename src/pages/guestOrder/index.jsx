import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { Row, Col, Collapse, Table, Icon, Tabs, Spin } from 'antd';
import { useState, useEffect, useRef } from 'react';
import {
  getOrderById,
  getAccount,
  getJoinStatistics,
  getJoinAccouts,
  getOrderRooms,
  getOrderGuest,
  getAccountSummary,
  getJoinAccountSummary,
  getOrderAccountSum,
  getJoinOrderAccountSum,
} from '@/services/order';
import Header from './components/Header';
import OrderInfo from './components/OrderInfo';
import OrderInfoPanel from './components/OrderInfoPanel';
import GuestInfo from './components/GuestInfo';
import GuestInfoPanel from './components/GuestInfoPanel';
import MarketInfo from './components/MarketInfo';
import PrePayInfo from './components/PrePayInfo';
import MarketInfoPanel from './components/MarketInfoPanel';
import PrePayInfoPanel from './components/PrePayInfoPanel';
import InVoiceBox from './components/invoiceBox';
import SubHeader from './components/SubHeader';
import OtherPanel from './OtherPanel';
import AccountPanel from './AccountPanel';
import Constants from '@/constans';
import OtherInfo from './components/OtherInfo';
import moment from 'moment';
import { connect } from 'dva';
import AccountDetail from './components/AccountDetail';
import JoinRooms from './components/JoinRooms';
const { Panel } = Collapse;
const { TabPane } = Tabs;
const OrderDetail = props => {
  useEffect(() => {
    const orderId = props.location.query && props.location.query.orderId;
    // console.log(orderId);
    // console.log(props)
    if (!props.loading && orderId) {
      getOrderById(orderId).then(rsp => {
        // console.log(rsp)
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data;
          setOrderInfo(data);
          // 判断状态如果为 i 就展开key5
          if (data.status === "I") { setPanelKey('6') }
        }
      });

      tabChangeGetData();

      if (listTab != 'all') {
        getAccount({ orderId, is_close: 2 }).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            const data = rsp.data;
            setAccountCount(data.length);
          }
        });
      }

      getOrderGuest(orderId).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data;
          if (data && data.length > 0) {
            setGuests(data);
            setGuestActiveKey(data[0].id + '');
          } else {
            setGuests([
              {
                id: 0,
                credential_type: '1',
                sex: '1',
                canDel: true,
                isNew: true,
              },
            ]);
            setGuestActiveKey('0');
          }
        }
      });

      getOrderRooms(orderId).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          if (data.length > 0) {
            const rooms = data.filter(item => item.order_info_id == orderId);
            if (rooms && rooms.length > 0) {
              setIsJoin(true);
              if (rooms[0].is_mianroom == '1') {
                setIsMain(true);
              } else {
                setIsMain(false);
              }
            } else {
              setIsJoin(false);
              setIsMain(true);
            }
          } else {
            setIsJoin(false);
            setIsMain(true);
          }
          setJoinRooms(data);
        }
      });

      // getToPay();

      if (panelKey == 5) {
        const init = !otherCollapseInit;
        setOtherCollapseInit(init);
      } else if (panelKey == 6) {
        const init = !accountCollapseInit;
        setAccountCollapseInit(init);
      }
    }
  }, [props.loading, props.location.query.orderId]);

  const infoCardStyle = {
    height: '180px',
    borderRight: '1px solid #eee',
  };

  const accountColumns = [
    {
      title: '房间号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '营业日期',
      dataIndex: 'audit_date',
      key: 'audit_date',
      width: 100,
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '项目',
      dataIndex: 'description',
      key: 'description',
      width: 100,
      // ellipsis: true,
    },
    // {
    //   title: '金额',
    //   dataIndex: 'charge',
    //   key: 'charge',
    //   render: (text, record) => {
    //     // if (record.debit_charge && record.debit_charge > 0) {
    //     //   return <span style={{ color: 'red' }}>{text}</span>;
    //     // }
    //     if (record.credit_charge && record.credit_charge > 0) {
    //       return <span style={{ color: 'red' }}>{text}</span>;
    //     }
    //     return text;
    //   },
    // },
    {
      title: '消费',
      dataIndex: 'debit_charge',
      key: 'debit_charge',
      render: text => <span style={{ color: 'red' }}>{text}</span>,
    },
    {
      title: '付款',
      dataIndex: 'credit_charge',
      key: 'credit_charge',
      render: text => <span style={{ color: 'green' }}>{text}</span>,
    },
    {
      title: '账务状态',
      dataIndex: 'status',
      key: 'status',
      render: text => {
        if (text == '1') {
          return '未结';
        } else if (text == '2') {
          return '已结';
        } else if (text == '3') {
          // return '挂账';
          return '已结';
        } else if (text == '4') {
          return '冲账';
        } else if (text == '5') {
          return '锁定';
        } else if (text == '6') {
          return '挂S账';
        }
      },
    },
    {
      title: '操作员',
      dataIndex: 'operate_user_name',
      key: 'operate_user_name',
      render: text => text || '系统',
    },
    {
      title: '操作时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text, record) =>
        record.create_time && moment(record.create_time).format('MM-DD HH:mm:ss'),
      width: 120,
    },
    // {
    //   title: '结账单号',
    //   dataIndex: 'close_account_no',
    //   key: 'close_account_no',
    // },
    // {
    //   title: '摘要',
    //   dataIndex: 'summary',
    //   key: 'summary',
    // },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      // width: 240,
      render: (text, record) => {
        if (record.status == '3' && !text) {
          return '挂账';
        } else {
          return text;
        }
      },
      ellipsis: true,
    },
    // {
    //   title: '有效性',
    //   dataIndex: 'valid',
    //   key: 'valid',
    //   render: (text, record) => {
    //     if (record.valid == '1') {
    //       return '正常';
    //     } else if (record.valid == '2') {
    //       return '支付中';
    //     } else if (record.valid == '0') {
    //       return '无效';
    //     }
    //   },
    // },
  ];

  const accountNoCkColumns = [
    {
      title: '',
      dataIndex: 'no_check',
      key: 'no_check',
      width: 60,
    },
    ...accountColumns,
  ];

  const [orderInfo, setOrderInfo] = useState({});
  const [accountData, setAccountData] = useState([]);
  const [accountSummary, setAccountSummary] = useState({});
  const [accountCount, setAccountCount] = useState([]);

  const joinRoomColumns = [
    {
      title: '',
      dataIndex: 'no_check',
      key: 'no_check',
      width: 60,
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
    },
    {
      title: '房间号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '笔数',
      dataIndex: 'account_count',
      key: 'account_count',
    },
    {
      title: '消费',
      dataIndex: 'debit_charge',
      key: 'debit_charge',
    },
    {
      title: '付款',
      dataIndex: 'credit_charge',
      key: 'credit_charge',
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
    },
  ];
  const [joinStatisticsData, setJoinStatisticsData] = useState([]);

  const [joinRooms, setJoinRooms] = useState([]);
  const [isMain, setIsMain] = useState(true);
  const [isJoin, setIsJoin] = useState(false);

  const [listTab, setListTab] = useState('notSettle');
  const [joinTab, setJoinTab] = useState('current');
  const [categoryTab, setCategoryTab] = useState('room');

  const [panelKey, setPanelKey] = useState('1');
  // const [defpanelKey, setDefPanelKey] = useState("1");

  const [toPay, setToPay] = useState(0);

  const getAccountList = is_close => {
    const orderId = props.location.query && props.location.query.orderId;
    getAccount({ orderId, is_close }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data;
        setAccountData(data);
        if (is_close == 2) {
          setAccountCount(data.length);
        }
      }
    });
  };

  const getJoinStatisticsList = is_close => {
    const orderId = props.location.query && props.location.query.orderId;
    getJoinStatistics({ orderId, is_close }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data;
        setJoinStatisticsData(data);
        if (is_close == 2) {
          setAccountCount(data.length);
        }
      }
    });
  };

  const getJoinAccountList = is_close => {
    const orderId = props.location.query && props.location.query.orderId;
    getJoinAccouts({ orderId, is_close }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data;
        setAccountData(data);
        if (is_close == 2) {
          setAccountCount(data.length);
        }
      }
    });
  };

  const tabChangeGetData = (close, join, category) => {
    if (close) {
      setListTab(close);
    } else {
      close = listTab;
    }

    if (join) {
      setJoinTab(join);
    } else {
      join = joinTab;
    }

    if (category) {
      setCategoryTab(category);
    } else {
      category = categoryTab;
    }

    let is_close = null;
    if (close == 'all') {
      is_close = 2;
    } else if (close == 'settle') {
      is_close = 1;
    } else if (close == 'notSettle') {
      is_close = 0;
    } else if (close == 'S') {
      is_close = 3;
    }

    if (join == 'current') {
      getAccountList(is_close);
      getAccountSummaryData(is_close);
      getToPay();
    } else if (join == 'all') {
      if (close == 'S') {
        setListTab('all');
        is_close = 2;
      }
      if (category == 'room') {
        getJoinStatisticsList(is_close);
      } else if (category == 'account') {
        getJoinAccountList(is_close);
      }
      getJoinAccountSummaryData(is_close);
      getJoinToPay();
    }
  };

  const handleListTabClick = type => {
    tabChangeGetData(type);
  };

  const handleJoinTabClick = type => {
    tabChangeGetData(null, type);
  };

  const handleCategoryTabClick = type => {
    tabChangeGetData(null, null, type);
  };

  const [guests, setGuests] = useState([
    {
      id: 1,
      credential_type: '1',
      sex: '1',
      canDel: true,
    },
  ]);

  const [guestAcitiveKey, setGuestActiveKey] = useState('0');

  const onEdit = (targetKey, action) => {
    if (action == 'add') {
      addGuestPanes();
    } else if (action == 'remove') {
      removeOrderInfoPanes(targetKey);
    }
  };

  const addGuestPanes = () => {
    let index = 1;
    let panes = [...guests];
    if (panes.length > 0) index = panes[panes.length - 1].id + 10; //数据最后一个ID理论是数据中最大ID 避免意外加10作为新的id(key)
    panes.push({
      id: index,
      credential_type: '1',
      sex: '1',
      canDel: true,
      isNew: true,
    });
    setGuests(panes);
    setGuestActiveKey(index + '');
  };

  const removeOrderInfoPanes = targetKey => {
    let panes = [...guests];
    for (let i = 0; i < panes.length; i++) {
      if (panes[i].id == targetKey) {
        panes.splice(i);
        break;
      }
    }
    setGuests(panes);
  };

  const clearSelect = () => {
    setSelectedRowKeys([]);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAccountIds, setSelectAccountIds] = useState([]);
  const [selectAccountCloseNo, setSelectAccountCloseNo] = useState([]);
  const [selectAccounts, setSelectAccounts] = useState([]);
  const [selectAccountCharge, setSelectAccountCharge] = useState(0);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      let charge = 0;
      const closeNo = [];
      selectedRows.map(item => {
        if (item.credit_charge) {
          charge -= item.credit_charge;
        }
        if (item.debit_charge) {
          charge += item.debit_charge;
        }
        if (!closeNo.includes(item.close_account_no)) {
          closeNo.push(item.close_account_no);
        }
      });

      setSelectAccountCloseNo(closeNo);
      setSelectAccountCharge(charge);
      setSelectAccountIds(selectedRowKeys);
      setSelectAccounts(selectedRows);

      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  const [otherCollapseInit, setOtherCollapseInit] = useState(true);
  const [accountCollapseInit, setAccountCollapseInit] = useState(true);
  const handleCollapseChange = activeKey => {
    setPanelKey(activeKey);
    if (activeKey == 5) {
      const init = !otherCollapseInit;
      setOtherCollapseInit(init);
    } else if (activeKey == 6) {
      const init = !accountCollapseInit;
      setAccountCollapseInit(init);
    }
  };

  const getAccountSummaryData = is_close => {
    const orderId = props.location.query && props.location.query.orderId;
    getAccountSummary({ orderId, is_close }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data;
        const accountSummary = {};
        data.map(item => {
          accountSummary[item.account_type] = item.total;
        });
        setAccountSummary(accountSummary);
      }
    });
  };

  const getJoinAccountSummaryData = is_close => {
    const orderId = props.location.query && props.location.query.orderId;
    getJoinAccountSummary({ orderId, is_close }).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data;
        const accountSummary = {};
        data.map(item => {
          accountSummary[item.account_type] = item.total;
        });
        setAccountSummary(accountSummary);
      }
    });
  };

  const getToPay = () => {
    const orderId = props.location.query && props.location.query.orderId;
    getOrderAccountSum(orderId).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || 0;
        setToPay(data);
      }
    });
  };

  const getJoinToPay = () => {
    const orderId = props.location.query && props.location.query.orderId;
    getJoinOrderAccountSum(orderId).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || 0;
        setToPay(data);
      }
    });
  };

  // ------------------ 开票触发模态框
  const childRef = useRef();
  const setHanshu = () => {
    // changeVal就是子组件暴露给父组件的方法
    childRef.current.changeVal();
  };

  const [accountDetailVis, setAccountDetailVis] = useState(false);
  const [accountDetail, setAccountDetail] = useState({});

  const handleAccountDetailClose = () => {
    setAccountDetailVis(false);
    setAccountDetail({});
  };

  const handleAccountDbClick = record => {
    const detail = { ...record };
    switch (detail.status) {
      case '1':
        detail.status_name = '正常';
        break;
      case '2':
        detail.status_name = '结账';
        break;
      case '3':
        detail.status_name = '挂账';
        break;
      case '4':
        detail.status_name = '冲账';
        break;
      case '5':
        detail.status_name = '锁定';
        break;
      case '6':
        detail.status_name = '挂S账';
        break;
      default:
        break;
    }
    setAccountDetail(detail);
    setAccountDetailVis(true);
  };

  return (
    <Spin spinning={props.loading}>
      <GridContent>
        <Header orderInfo={{ ...orderInfo }} />
        <SubHeader count={joinRooms.length} />
        <Row style={{ background: '#fff' }}>
          <Col style={infoCardStyle} span={5} onClick={() => setPanelKey('1')}>
            <OrderInfo orderInfo={{ ...orderInfo }} />
          </Col>
          <Col style={infoCardStyle} span={5} onClick={() => setPanelKey('2')}>
            <GuestInfo orderInfo={{ ...orderInfo }} guests={guests} />
          </Col>
          <Col style={infoCardStyle} span={5} onClick={() => setPanelKey('3')}>
            <MarketInfo orderInfo={{ ...orderInfo }} />
          </Col>
          <Col style={infoCardStyle} span={5}>
            <OtherInfo orderInfo={{ ...orderInfo }} />
          </Col>
          <Col style={infoCardStyle} span={4} onClick={() => setPanelKey('5')}>
            <JoinRooms orderInfo={orderInfo} joinRooms={joinRooms} />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }} gutter={8}>
          <Col span={18}>
            <div className={styles.accountTable}>
              <div className={styles.accountTableTitle}>账务列表</div>
              <Row>
                <Col span={8}>
                  <div className={styles.tableTabs}>
                    <span
                      className={listTab == 'all' ? styles.active : null}
                      onClick={() => handleListTabClick('all')}
                    >
                      所有
                    </span>
                    <span
                      className={listTab == 'settle' ? styles.active : null}
                      onClick={() => handleListTabClick('settle')}
                    >
                      已结
                    </span>
                    <span
                      className={listTab == 'notSettle' ? styles.active : null}
                      onClick={() => handleListTabClick('notSettle')}
                    >
                      未结
                    </span>
                    {joinTab == 'current' && (
                      <span
                        className={listTab == 'S' ? styles.active : null}
                        onClick={() => handleListTabClick('S')}
                      >
                        挂账
                      </span>
                    )}
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.tableTabs} style={{ textAlign: 'center' }}>
                    <span
                      className={joinTab == 'current' ? styles.active : null}
                      onClick={() => handleJoinTabClick('current')}
                    >
                      当前客房
                    </span>
                    <span
                      className={joinTab == 'all' ? styles.active : null}
                      onClick={() => handleJoinTabClick('all')}
                    >
                      所有联单
                    </span>
                  </div>
                </Col>
                {joinTab == 'all' && (
                  <Col span={8}>
                    <div className={styles.tableTabs} style={{ textAlign: 'right' }}>
                      <span
                        className={categoryTab == 'room' ? styles.active : null}
                        onClick={() => handleCategoryTabClick('room')}
                      >
                        房间
                      </span>
                      <span
                        className={categoryTab == 'account' ? styles.active : null}
                        onClick={() => handleCategoryTabClick('account')}
                      >
                        详情
                      </span>
                    </div>
                  </Col>
                )}
              </Row>

              {joinTab == 'current' && (
                <Table
                  columns={accountColumns}
                  dataSource={accountData}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  scroll={{ y: 'max-content' }}
                  rowSelection={rowSelection}
                  onRow={record => {
                    return {
                      onDoubleClick: event => {
                        handleAccountDbClick(record);
                      },
                    };
                  }}
                  rowClassName={(record, index) => {
                    if (orderInfo.status != 'R' && orderInfo.status != 'I') {
                      return styles.disRow;
                    } else {
                      if (record.status == '4') {
                        return styles.reserveRow;
                      } else if (record.status == '2' || record.status == '3') {
                        return styles.disRow;
                      }
                    }
                  }}
                />
              )}
              {joinTab == 'all' && categoryTab == 'room' && (
                <Table
                  columns={joinRoomColumns}
                  dataSource={joinStatisticsData}
                  rowKey="order_info_id"
                  size="small"
                  pagination={false}
                />
              )}
              {joinTab == 'all' && categoryTab == 'account' && (
                <Table
                  columns={accountNoCkColumns}
                  dataSource={accountData}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  scroll={{ y: 'max-content' }}
                />
              )}

              <Row className={styles.accountFooter}>
                <Col span={4} offset={4}>
                  消费:{(accountSummary && accountSummary.XF) || 0}
                </Col>
                <Col span={4}>付款:{(accountSummary && accountSummary.FK) || 0}</Col>
                <Col span={4}>退款:{(accountSummary && accountSummary.TK) || 0}</Col>
                <Col span={4}>余额:{toPay || 0}</Col>
              </Row>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ height: '850px', background: '#fff' }}>
              <Collapse
                className={styles.myCollapse}
                accordion={true}
                defaultActiveKey="1"
                activeKey={panelKey}
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" style={{ color: '#fff' }} rotate={isActive ? 90 : 0} />
                )}
                // onChange={activeKey => setPanelKey(activeKey)}
                onChange={activeKey => handleCollapseChange(activeKey)}
              >
                <Panel
                  className={styles.collapseHeader}
                  header={<span style={{ color: '#fff' }}>预定信息</span>}
                  key="1"
                >
                  <OrderInfoPanel {...orderInfo}></OrderInfoPanel>
                </Panel>
                <Panel header={<span style={{ color: '#fff' }}>住客信息</span>} key="2">
                  <Tabs
                    onChange={acitiveKey => setGuestActiveKey(acitiveKey)}
                    activeKey={guestAcitiveKey}
                    type="editable-card"
                    onEdit={onEdit}
                  >
                    {guests.map(pane => (
                      <TabPane tab={pane.name} key={pane.id + ''} closable={!!pane.canDel}>
                        <GuestInfoPanel {...pane} orderInfo={orderInfo}></GuestInfoPanel>
                      </TabPane>
                    ))}
                  </Tabs>
                </Panel>
                <Panel header={<span style={{ color: '#fff' }}>市场营销</span>} key="3">
                  <MarketInfoPanel {...orderInfo} />
                </Panel>
                {/* <Panel header={<span style={{ color: '#fff' }}>预收款营销</span>} key="4">
                <PrePayInfoPanel />
              </Panel> */}
                <Panel header={<span style={{ color: '#fff' }}>其他信息</span>} key="5">
                  <OtherPanel
                    sethanshu={setHanshu}
                    orderInfo={orderInfo}
                    accountCount={accountCount}
                    collapseInit={otherCollapseInit}
                  />
                </Panel>
                <Panel header={<span style={{ color: '#fff' }}>账务信息</span>} key="6">
                  <AccountPanel
                    orderInfo={orderInfo}
                    selectAccountIds={selectAccountIds}
                    selectAccountCloseNo={[...selectAccountCloseNo]}
                    selectAccountCharge={selectAccountCharge}
                    selectAccounts={selectAccounts}
                    handleClearSelect={clearSelect}
                    collapseInit={accountCollapseInit}
                    isJoin={isJoin}
                    isMain={isMain}
                  />
                </Panel>
              </Collapse>
            </div>
          </Col>
        </Row>

        {/* 点击开票出现模态框 */}
        <InVoiceBox orderInfo={orderInfo} cRef={childRef} />

        <AccountDetail
          visible={accountDetailVis}
          record={accountDetail}
          handleAccountColse={handleAccountDetailClose}
        />
      </GridContent>
    </Spin>
  );
};

export default connect(({ global }) => ({ loading: global.loading }))(OrderDetail);
