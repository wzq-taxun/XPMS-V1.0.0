import { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Input, Row, Col, Select, Radio, Tabs, Button, Table, Checkbox } from 'antd';
import styles from './style.less';
import Floor from './Floor';
import { getRoomType } from '@/services/checkIn';
import Constants from '@/constans';
import {
  getRoomStatusColor,
  getFloors,
  getRooms,
  getRoomStatusCount,
  getRoomsStatistics,
} from '@/services/rooms';
import jdPng from '@/assets/room/jiangdao.png';
import jlPng from '@/assets/room/jiangli.png';
import zdPng from '@/assets/room/zhongdian.png';
import tdPng from '@/assets/room/tuandui.png';
import zdcsPng from '@/assets/room/zdcaoshi.png';
import vipPng from '@/assets/room/vip.png';
import hyPng from '@/assets/room/huiyuan.png';
import mfPng from '@/assets/room/mianfei.png';
import cbPng from '@/assets/room/changbao.png';
import zyPng from '@/assets/room/ziyong.png';
import lfPng from '@/assets/room/lianfang.png';
import cxPng from '@/assets/room/caoxian.png';
import lstPng from '@/assets/room/linshitai.png';
import StateBlock from './StateBlock';
import StatusFilter from './StatusFilter';
import Dict from '@/dictionary';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

class RoomStatus extends Component {
  state = {
    rooms: [],
    roomTypes: [],
    roomTypeId: null,
    floors: [],
    floorId: null,
    statusColor: {
      VC: '#5FB878', //空净
      VD: '#B6B6B7', //空脏
      OC: '#009688', //住净
      OD: '#B6B6B7', //住脏
      OO: '#E90000', //维修
      OS: '#FF730C', //停用 锁房
    },
    statusBackgroudImg: {
      VC: 'assets/room/vc.jpg', //空净
      VD: 'assets/room/vd.jpg', //空脏
      OC: 'assets/room/oc.jpg', //住净
      OD: 'assets/room/od.jpg', //住脏
      OO: 'assets/room/oo.jpg', //维修
      OS: 'assets/room/os.jpg', //停用 锁房
    },
    statusCount: {
      ALL: 0,
      VC: 0, //空净
      VD: 0, //空脏
      OC: 0, //住净
      OD: 0, //住脏
      OO: 0, //维修
      OS: 0, //停用 锁房
    },
    queryParam: {},
    blockActive: 0,
  };

  timer = null;

  componentDidMount() {
    getRoomStatusColor().then(rsp => {
      if (rsp && rsp.code === Constants.SUCCESS) {
        const data = rsp.data || [];
        data.map(item => {
          this.state.statusColor[item.room_status] = item.color;
          this.state.statusBackgroudImg[item.room_status] = item.background_image;
        });
      }
    });

    this.getRoomsData();

    getFloors().then(rsp => {
      if (rsp && rsp.code === Constants.SUCCESS) {
        const data = rsp.data || [];
        // this.setState({ floors: [{ id: 0, floor_no: '全部' }, ...data] });
        this.setState({ floors: data });
      }
    });

    getRoomType().then(rsp => {
      if (rsp && rsp.code === Constants.SUCCESS) {
        const data = rsp.data || [];

        // this.setState({ roomTypes: [{ id: 0, name: '全部' }, ...data] });
        this.setState({ roomTypes: data });
      }
    });
  }

  componentWillUnmount() {
    if (null != this.timer) {
      clearTimeout(this.timer);
    }
  }

  getRoomsData(param) {
    getRooms(param).then(rsp => {
      if (rsp && rsp.code === Constants.SUCCESS) {
        const data = (rsp.data && rsp.data.map) || [];
        this.setState({ rooms: data });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.componentDidMount();
        }, 300000);
      }
    });

    getRoomStatusCount().then(rsp => {
      if (rsp && rsp.code === Constants.SUCCESS) {
        const data = rsp.data || [];
        let statusCount = {
          ALL: 0,
          VC: 0, //空净
          VD: 0, //空脏
          OC: 0, //住净
          OD: 0, //住脏
          OO: 0, //维修
          OS: 0, //锁房
        };
        let all = 0;
        data.map(item => {
          switch (item.code) {
            case 'VC':
              statusCount.VC = item.num || 0;
              break;
            case 'VD':
              statusCount.VD = item.num || 0;
              break;
            case 'OC':
              statusCount.OC = item.num || 0;
              break;
            case 'OD':
              statusCount.OD = item.num || 0;
              break;
            case 'OO':
              statusCount.OO = item.num || 0;
              break;
            case 'OS':
              statusCount.OS = item.num || 0;
              break;
          }
          // statusCount[item.code] = item.num;
          all += item.num;
        });
        statusCount.ALL = all;
        // const old = this.state.statusCount;
        // this.setState({ statusCount: { ...old, ...statusCount } });
        this.setState({ statusCount: statusCount });
      }
    });

    getRoomsStatistics().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || {};
        this.setState({ roomStatistics: data });
      }
    });
  }

  handleStatusChange(values) {
    const queryParam = this.state.queryParam;
    if (values && values.length > 0) {
      if (!values.includes('ALL')) {
        queryParam.code = values.toString();
      } else {
        delete queryParam.code;
      }
      this.setState({ queryParam });
    } else {
      delete queryParam.code;
      this.setState({ queryParam });
    }
    this.getRoomsData(queryParam);
  }

  handleRoomTypeChange(values) {
    const queryParam = this.state.queryParam;
    if (values && values.length > 0) {
      if (!values.includes(0)) {
        queryParam.type_id = values.toString();
      } else {
        delete queryParam.type_id;
      }
      this.setState({ queryParam });
    } else {
      delete queryParam.type_id;
      this.setState({ queryParam });
    }
    this.getRoomsData(queryParam);
  }

  handleFloorChange(values) {
    const queryParam = this.state.queryParam;
    if (values && values.length > 0) {
      if (!values.includes(0)) {
        queryParam.room_floor_id = values.toString();
      } else {
        delete queryParam.room_floor_id;
      }
    } else {
      delete queryParam.room_floor_id;
      this.setState({ queryParam });
    }
    this.getRoomsData(queryParam);
  }

  handleGuestTypeChange(values) {
    const queryParam = this.state.queryParam;
    if (values && values.length > 0) {
      if (!values.includes(0)) {
        queryParam.guest_type_id = values.toString();
      } else {
        delete queryParam.guest_type_id;
      }
    } else {
      delete queryParam.guest_type_id;
      this.setState({ queryParam });
    }
    this.getRoomsData(queryParam);
  }

  onKeyDown = e => {
    if (e.ctrlKey) {
      console.log(e.keyCode);
    }
  };

  handleSearchRoom(value) {
    let param = {};
    if (value) {
      param = {
        room_no: value,
      };
    }
    this.getRoomsData(param);
  }

  handleBlockClick(type, value, index) {
    let param = {};
    if (this.state.blockActive != index) {
      if (type == 1) {
        param = {
          type: value,
        };
      } else if (type == 2) {
        param = {
          order_type_id: value,
        };
      } else if (type == 3) {
        param = {
          guest_type_id: value,
        };
      }
      this.setState({ blockActive: index });
    } else {
      this.setState({ blockActive: 0 });
    }

    this.getRoomsData(param);
  }

  render() {
    return (
      <GridContent>
        <div className={styles.header}>
          <span className={styles.title}>房态</span>
          {/* <span className={styles.quick}>
            网络订单
          </span>
          <span className={styles.quick}>快速预定</span>
          <span className={styles.quick}>快速入住</span>
          <span className={styles.quick}>制 卡</span>
          <span className={styles.quick}>公安入住</span> */}
          <Search
            placeholder="搜索"
            onSearch={value => this.handleSearchRoom(value)}
            className={styles.search}
          />
        </div>

        <Row gutter={8} style={{ marginTop: '10px' }}>
          <Col span={18}>
            <div className={styles.roomIconsContain}>
              <StateBlock
                icon={jdPng}
                text="应到"
                count={this.state.roomStatistics && this.state.roomStatistics.today_arrive}
                click={() => this.handleBlockClick(1, 1, 1)}
                active={this.state.blockActive == 1}
              />
              <StateBlock
                icon={jlPng}
                text="预离"
                count={this.state.roomStatistics && this.state.roomStatistics.today_leave}
                click={() => this.handleBlockClick(1, 2, 2)}
                active={this.state.blockActive == 2}
              />
              <StateBlock
                icon={zdPng}
                text="全日"
                count={this.state.roomStatistics && this.state.roomStatistics.qr_count}
                click={() => this.handleBlockClick(2, Dict.orderType[0].id, 3)}
                active={this.state.blockActive == 3}
              />
              <StateBlock
                icon={zdPng}
                text="钟点"
                count={this.state.roomStatistics && this.state.roomStatistics.zd_count}
                click={() => this.handleBlockClick(2, Dict.orderType[1].id, 4)}
                active={this.state.blockActive == 4}
              />
              <StateBlock
                icon={cbPng}
                text="长包"
                count={this.state.roomStatistics && this.state.roomStatistics.cb_count}
                click={() => this.handleBlockClick(2, Dict.orderType[2].id, 5)}
                active={this.state.blockActive == 5}
              />
              <StateBlock
                icon={cbPng}
                text="长租"
                count={this.state.roomStatistics && this.state.roomStatistics.cz_count}
                click={() => this.handleBlockClick(2, Dict.orderType[3].id, 6)}
                active={this.state.blockActive == 6}
              />
              {/* <StateBlock icon={tdPng} text="团队" /> */}
              {/* <StateBlock icon={zdcsPng} text="钟点超时" /> */}
              {/* <StateBlock icon={vipPng} text="VIP" /> */}
              <StateBlock
                icon={zyPng}
                text="散客"
                count={this.state.roomStatistics && this.state.roomStatistics.sk_count}
                click={() => this.handleBlockClick(3, Dict.guestType[0].id, 7)}
                active={this.state.blockActive == 7}
              />
              <StateBlock
                icon={hyPng}
                text="会员"
                count={this.state.roomStatistics && this.state.roomStatistics.hy_count}
                click={() => this.handleBlockClick(3, Dict.guestType[1].id, 8)}
                active={this.state.blockActive == 8}
              />
              <StateBlock
                icon={zyPng}
                text="公司"
                count={this.state.roomStatistics && this.state.roomStatistics.xygs_count}
                click={() => this.handleBlockClick(3, Dict.guestType[2].id, 9)}
                active={this.state.blockActive == 9}
              />
              <StateBlock
                icon={zyPng}
                text="中介"
                count={this.state.roomStatistics && this.state.roomStatistics.zjlxs_count}
                click={() => this.handleBlockClick(3, Dict.guestType[3].id, 10)}
                active={this.state.blockActive == 10}
              />
              {/* <StateBlock icon={mfPng} text="免费" /> */}
              {/* <StateBlock icon={zyPng} text="自用" /> */}
              {/* <StateBlock icon={lfPng} text="联房" /> */}
              {/* <StateBlock icon={cxPng} text="超限" /> */}
              {/* <StateBlock icon={lstPng} text="临时态" /> */}
            </div>
            <div className={styles.roomsContain}>
              {this.state.rooms &&
                this.state.rooms.map(floor => (
                  <Floor
                    key={floor.floor_id}
                    floor={floor}
                    statusColor={this.state.statusColor}
                    statusBackgroudImg={this.state.statusBackgroudImg}
                    refresh={() => this.getRoomsData()}
                  />
                ))}
            </div>
          </Col>
          <Col span={6}>
            <div style={{ background: '#fff', padding: '10px', minHeight: '750px' }}>
              <StatusFilter
                statusColor={this.state.statusColor}
                statusCount={this.state.statusCount}
                handleStatusChange={values => this.handleStatusChange(values)}
              />

              <Tabs defaultActiveKey="1" className={styles.filterTabs} tabBarGutter={0}>
                <TabPane tab="房型" key="1" className={styles.filterPane}>
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    onChange={values => this.handleRoomTypeChange(values)}
                  >
                    <Row type="flex">
                      <Col span={12}>
                        <Checkbox value={0} className={styles.roomTypeCb}>
                          全部房型
                        </Checkbox>
                      </Col>
                      {this.state.roomTypes.map(item => (
                        <Col span={12} key={item.id}>
                          <Checkbox value={item.id} className={styles.roomTypeCb}>
                            {item.name}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </TabPane>
                <TabPane tab="楼层" key="2" className={styles.filterPane}>
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    onChange={values => this.handleFloorChange(values)}
                  >
                    <Row type="flex">
                      <Col span={12}>
                        <Checkbox value={0} className={styles.roomTypeCb}>
                          全部楼层
                        </Checkbox>
                      </Col>
                      {this.state.floors.map(item => (
                        <Col span={12} key={item.id}>
                          <Checkbox value={item.id} style={{ padding: '5px 0' }}>
                            {item.floor_no}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </TabPane>
              </Tabs>

              <div style={{ border: '1px solid #f2f0f1', marginTop: '15px' }}>
                <div
                  style={{
                    lineHeight: '30px',
                    textAlign: 'center',
                    borderBottom: '1px solid #f2f0f1',
                  }}
                >
                  客人类型
                </div>
                <Checkbox.Group
                  onChange={values => this.handleGuestTypeChange(values)}
                  style={{ padding: '10px' }}
                >
                  <Row type="flex">
                    <Col span={8}>
                      <Checkbox className={styles.radioStyle} value={0}>
                        全部
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox className={styles.radioStyle} value={Dict.guestType[0].id}>
                        散客
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox className={styles.radioStyle} value={Dict.guestType[1].id}>
                        会员
                      </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox className={styles.radioStyle} value={Dict.guestType[2].id}>
                        协议公司
                      </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox className={styles.radioStyle} value={Dict.guestType[3].id}>
                        中介/旅行社
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </div>
            </div>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default RoomStatus;
