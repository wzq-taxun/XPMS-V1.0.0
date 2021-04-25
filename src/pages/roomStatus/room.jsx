import { Component } from 'react';
import styles from './style.less';
import { Icon, Modal, message, Button } from 'antd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { router } from 'umi';
import { updateRoomStatus } from '@/services/rooms';
import Constants from '@/constans';
import Detail from './Detail';
import { getOrderById } from '@/services/order';
import Lock from './Lock';
import Repair from './Repair';
import Dict from '@/dictionary';
import ChangeRoom from './ChangeRoom';
import ChangeClear from './ChangeClear';
import ChangeDirty from './ChangeDirty';
import MaintainDetail from './MaintainDetail';
import LockDetail from './LockDetail';

const { confirm } = Modal;

let timer = null;
let count = 0;
class Room extends Component {
  constructor(props) {
    super(props);
    // let detail = props.orderInfoDetails && props.orderInfoDetails[0];
    // let guests = props.orderInfoGuestEntities;
    // if (guests && guests.length > 0) {
    //   let guestName = '';
    //   guests.map(item => {
    //     guestName = item.name + '  ';
    //   });
    //   detail.reserve_name = guestName;
    //   if (guests[0].phone_number) {
    //     detail.reserve_tel = guests[0].phone_number;
    //   }
    // }
    this.state = {
      menu: false,
      hoverInfo: false,
      clickInfo: false,
      clickMaintain: false,
      clickLock: false,
      timerCount: 0,
      room_no: props.room_no,
      room_type_name: props.room_type_name,
      statusColor: props.statusColor || {
        VC: '#5FB878', //空净
        VD: '#B6B6B7', //空脏
        OC: '#336699', //住净
        OD: '#B6B6B7', //住脏
        OO: '#E90000', //维修
        OS: '#FF730C', //停用 锁房
      },
      statusBackgroudImg: props.statusBackgroudImg || {
        VC: 'assets/room/vc.jpg', //空净
        VD: 'assets/room/vd.jpg', //空脏
        OC: 'assets/room/oc.jpg', //住净
        OD: 'assets/room/od.jpg', //住脏
        OO: 'assets/room/oo.jpg', //维修
        OS: 'assets/room/os.jpg', //停用 锁房
      },
      // detail,
      lockVis: false,
      repairVis: false,
      showModal: false,
      top: false,
      changeVis: false,
      changeClearVis: false,
      changeDirtyVis: false,
    };
  }

  handleClick = e => {
    if (null != timer) {
      clearTimeout(timer);
    }

    count += 1;
    timer = setTimeout(() => {
      if (count === 1) {
        if (this.props.order_info_id && !this.state.showModal) {
          const boundClient = this.refs.detail.getBoundingClientRect();
          const height = window.innerHeight;
          let top = false;
          if (boundClient.bottom + 380 > height && 380 + 160 < boundClient.top + 40) {
            top = true;
          }
          this.setState({ clickInfo: true, clickMaintain: false, clickLock: false, top });
        } else if (this.props.code == 'OO') {
          const boundClient = this.refs.detail.getBoundingClientRect();
          const height = window.innerHeight;
          let top = false;
          if (boundClient.bottom + 380 > height && 380 + 160 < boundClient.top + 40) {
            top = true;
          }
          this.setState({ clickMaintain: true, clickInfo: false, clickLock: false, top });
        } else if (this.props.code == 'OS') {
          const boundClient = this.refs.detail.getBoundingClientRect();
          const height = window.innerHeight;
          let top = false;
          if (boundClient.bottom + 380 > height && 380 + 160 < boundClient.top + 40) {
            top = true;
          }
          this.setState({ clickLock: true, clickInfo: false, clickMaintain: false, top });
        } else {
          this.setState({ clickInfo: false, clickMaintain: false, clickLock: false });
        }
      } else if (count === 2) {
        if (!this.state.showModal) {
          if (this.props.order_info_id) {
            router.push({ pathname: 'orderDetail', query: { orderId: this.props.order_info_id } });
          } else {
            const room_status = this.props.code;
            if (room_status != 'OS' && room_status != 'OO' && room_status != 'OD') {
              router.push({
                pathname: 'checkIn',
                state: { room_type_id: this.props.type_id, room_no_id: this.props.room_no_id },
              });
            }
          }
        }
      }
      count = 0;
    }, 240);
  };

  handleMouseOut = e => {
    this.setState({ clickInfo: false, clickMaintain: false, clickLock: false });
  };

  handleRcMenuClick(e, data) {
    e.stopPropagation();
    if (data.type == 1) {
      router.push({
        pathname: 'checkIn',
        state: data,
        // state: { room_type_id: this.props.type_id, room_no_id: this.props.room_no_id },
      });
      // router.push({
      //   pathname: 'reserve',
      //   state: data,
      // });
    } else if (
      data.type == 2 ||
      data.type == 3 ||
      data.type == 4 ||
      data.type == 5 ||
      data.type == 6 ||
      data.type == 7 ||
      data.type == 9 ||
      data.type == 10
    ) {
      data.handle();
    } else if (data.type == 8) {
      router.push({
        pathname: 'reserve',
        state: data,
      });
    }
  }

  handleUpdateStatus(status) {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const { hotel_group_id, hotel_id, id: create_user } = currentUser;
    const { status_id: id, room_no, room_no_id, type_id } = this.props;

    const room_status = this.props.code;

    let code = null;
    let msg = '是否置净该房?';
    if (status == 'C') {
      if (room_status == 'OD') {
        code = 'OC';
      } else {
        code = 'VC';
      }
    } else if (status == 'D') {
      msg = '是否置脏该房?';
      if (room_status == 'OC') {
        code = 'OD';
      } else {
        code = 'VD';
      }
    }

    if (!code) return;

    const param = [
      {
        id: parseInt(id),
        code,
        create_user,
        hotel_group_id,
        hotel_id,
        room_no,
        room_no_id,
        room_type_id: type_id,
      },
    ];

    console.log(param);
    confirm({
      title: '房态修改',
      content: msg,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        updateRoomStatus(param).then(rsp => {
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '更新成功');
            if (this.props.refresh) {
              this.props.refresh();
            }
          }
        });
      },
    });
  }

  handleCancleLock() {
    this.setState({ lockVis: false });
  }

  handleCancleRepair() {
    this.setState({ repairVis: false });
  }

  handleCancleChangeRoom() {
    this.setState({ changeVis: false });
  }

  handleCancleChangeClear() {
    this.setState({ changeClearVis: false });
  }

  handleCancleChangeDirty() {
    this.setState({ changeDirtyVis: false });
  }

  render() {
    const { room_no, room_type_name, guest_name, status_name, guest_type_id } = this.props;
    const room_status = this.props.code;
    // let background = this.state.statusColor[room_status];
    let background = this.state.statusBackgroudImg[room_status];

    let guestTypeText = '';
    if (guest_type_id) {
      if (guest_type_id == Dict.guestType[0].id) {
        guestTypeText = '散';
      } else if (guest_type_id == Dict.guestType[1].id) {
        guestTypeText = '会';
      } else if (guest_type_id == Dict.guestType[2].id) {
        guestTypeText = '协';
      } else if (guest_type_id == Dict.guestType[3].id) {
        guestTypeText = '网';
      }
    }

    return (
      <div
        className={styles.roomContain}
        style={{ background: `url(${require('@/' + background)}) center center /cover` }}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseOut}
        // onMouseEnter={this.handleMouseEnter}
        // onDoubleClick={this.handlDoubleClick}
        ref="detail"
      >
        <ContextMenuTrigger id={room_no}>
          <div className={styles.roomHeader}>
            <span className={styles.roomNo}>{room_no}</span>
            <span className={styles.room_type}>{room_type_name}</span>
          </div>
          <div className={styles.roomContent}>
            <span className={styles.status}>{status_name}</span>
            <span className={styles.name}>{guest_name}</span>
          </div>
          <div className={styles.roomFooter}>
            {this.props.to_type && <span className={styles.stateIcon}>到</span>}
            {this.props.leave_type && <span className={styles.stateIcon}>离</span>}
            {this.props.join_type && <span className={styles.stateIcon}>联</span>}
            {this.props.over_type && <span className={styles.stateIcon}>超</span>}
            {this.props.guest_type_id && <span className={styles.stateIcon}>{guestTypeText}</span>}
          </div>
        </ContextMenuTrigger>

        <ContextMenu id={room_no} className={styles.contextMenuContain}>
          {room_status == 'VC' && (
            <>
              <MenuItem
                className={styles.CMmenuItem}
                data={{
                  type: 1,
                  room_type_id: this.props.type_id,
                  room_no_id: this.props.room_no_id,
                  // room_no,
                  // room_type_name,
                }}
                onClick={this.handleRcMenuClick}
              >
                <Button type="primary">散客步入</Button>
              </MenuItem>
              <MenuItem
                className={styles.CMmenuItem}
                data={{
                  type: 8,
                  room_type_id: this.props.type_id,
                  room_no_id: this.props.room_no_id,
                }}
                onClick={this.handleRcMenuClick}
              >
                <Button type="primary">快速预定</Button>
              </MenuItem>
            </>
          )}
          {(room_status == 'VC' || room_status == 'VD') && (
            <>
              <MenuItem
                className={styles.CMmenuItem}
                data={{
                  type: 2,
                  handle: () => {
                    this.setState({ lockVis: true, showModal: true });
                  },
                }}
                onClick={this.handleRcMenuClick}
              >
                <Button type="primary">锁房</Button>
              </MenuItem>
              <MenuItem
                className={styles.CMmenuItem}
                data={{
                  type: 3,
                  handle: () => {
                    this.setState({ repairVis: true, showModal: true });
                  },
                }}
                onClick={this.handleRcMenuClick}
              >
                <Button type="primary">维修房</Button>
              </MenuItem>
            </>
          )}
          {(room_status == 'VD' || room_status == 'OD') && (
            <>
              <MenuItem
                className={styles.CMmenuItem}
                data={{ type: 4, handle: () => this.handleUpdateStatus('C') }}
                onClick={this.handleRcMenuClick}
              >
                <Button type="primary">置净</Button>
              </MenuItem>
              <MenuItem
                className={styles.CMmenuItem}
                data={{
                  type: 9,
                  handle: () => {
                    this.setState({ changeClearVis: true, showModal: true });
                  },
                }}
                onClick={this.handleRcMenuClick}
              >
                <Button type="primary">批量置净</Button>
              </MenuItem>
            </>
          )}
          {(room_status == 'VC' || room_status == 'OC') && (
            <>
              <MenuItem
                className={styles.CMmenuItem}
                data={{ type: 5, handle: () => this.handleUpdateStatus('D') }}
                onClick={this.handleRcMenuClick}
              >
                <Button type="primary">置脏</Button>
              </MenuItem>
              <MenuItem
                className={styles.CMmenuItem}
                data={{
                  type: 10,
                  handle: () => {
                    this.setState({ changeDirtyVis: true, showModal: true });
                  },
                }}
                onClick={this.handleRcMenuClick}
              >
                <Button type="primary">批量置脏</Button>
              </MenuItem>
            </>
          )}
          {(room_status == 'OS' || room_status == 'OO') && (
            <MenuItem
              className={styles.CMmenuItem}
              data={{ type: 6, handle: () => this.handleUpdateStatus('C') }}
              onClick={this.handleRcMenuClick}
            >
              <Button type="primary">启用</Button>
            </MenuItem>
          )}
          {(room_status == 'OC' || room_status == 'OD') && (
            <MenuItem
              className={styles.CMmenuItem}
              data={{ type: 7, handle: () => this.setState({ changeVis: true, showModal: true }) }}
              onClick={this.handleRcMenuClick}
            >
              <Button type="primary">换房</Button>
            </MenuItem>
          )}
        </ContextMenu>

        {this.state.clickInfo && (
          <Detail
            orderInfoId={this.props.order_info_id}
            // {...this.state.detail}
            left={this.props.left}
            top={this.state.top}
          />
        )}

        {this.state.clickMaintain && (
          <MaintainDetail
            room_no_id={this.props.room_no_id}
            room_no={this.props.room_no}
            room_type={this.props.room_type_name}
            status={this.props.code}
            left={this.props.left}
            top={this.state.top}
          />
        )}

        {this.state.clickLock && (
          <LockDetail
            room_no_id={this.props.room_no_id}
            room_no={this.props.room_no}
            room_type={this.props.room_type_name}
            status={this.props.code}
            left={this.props.left}
            top={this.state.top}
          />
        )}

        {this.state.lockVis && (
          <Lock
            {...this.props}
            visible={this.state.lockVis}
            handleCancle={() => this.handleCancleLock()}
            refresh={this.props.refresh}
          ></Lock>
        )}

        {this.state.repairVis && (
          <Repair
            {...this.props}
            visible={this.state.repairVis}
            handleCancle={() => this.handleCancleRepair()}
            refresh={this.props.refresh}
          ></Repair>
        )}

        {this.state.changeVis && (
          <ChangeRoom
            {...this.props}
            visible={this.state.changeVis}
            handleCancle={() => this.handleCancleChangeRoom()}
            refresh={this.props.refresh}
          ></ChangeRoom>
        )}

        {this.state.changeClearVis && (
          <ChangeClear
            visible={this.state.changeClearVis}
            handleCancle={() => this.handleCancleChangeClear()}
            refresh={this.props.refresh}
          ></ChangeClear>
        )}

        {this.state.changeDirtyVis && (
          <ChangeDirty
            visible={this.state.changeDirtyVis}
            handleCancle={() => this.handleCancleChangeDirty()}
            refresh={this.props.refresh}
          ></ChangeDirty>
        )}
      </div>
    );
  }
}

export default Room;
