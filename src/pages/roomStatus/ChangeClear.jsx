import Constants from '@/constans';
import { getRoomsByStatus, updateRoomStatus } from '@/services/rooms';
import { Checkbox, Col, Modal, Row } from 'antd';
import { Component } from 'react';

class ChangeClear extends Component {
  state = {
    rooms: [],
    checkedIds: [],
    allRoomIds: [],
    indeterminate: false,
    checkAll: false,
  };

  componentDidMount() {
    getRoomsByStatus('D').then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        const roomIds = [];
        list.map(item => {
          roomIds.push(item.id);
        });
        this.setState({ rooms: list, allRoomIds: roomIds });
      }
    });
  }

  onChange = checkedValues => {
    const allRoomIds = this.state.allRoomIds;
    this.setState({
      checkedIds: checkedValues,
      indeterminate: !!checkedValues.length && checkedValues.length < allRoomIds.length,
      checkAll: checkedValues.length === allRoomIds.length,
    });
  };

  onCheckAllChange = e => {
    const allRoomIds = this.state.allRoomIds;
    this.setState({
      checkedIds: e.target.checked ? allRoomIds : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  handleSubmit = () => {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const { hotel_group_id, hotel_id, id: create_user } = currentUser;
    const { checkedIds, rooms } = this.state;

    if (!checkedIds || checkedIds.length < 1) {
      this.props.handleCancle();
    } else {
      const param = [];
      checkedIds.map(item => {
        const ckRooms = rooms.filter(room => room.id == item);
        if (ckRooms && ckRooms.length > 0) {
          let code = null;
          const room_status = ckRooms[0].code;
          if (room_status == 'OD') {
            code = 'OC';
          } else {
            code = 'VC';
          }
          const { id, room_no, room_no_id, room_type_id } = ckRooms[0];
          const room = {
            id,
            code,
            create_user,
            hotel_group_id,
            hotel_id,
            room_no,
            room_no_id,
            room_type_id,
          };

          param.push(room);
        }
      });

      console.log(param);
      updateRoomStatus(param).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          this.props.handleCancle();
          if (this.props.refresh) {
            this.props.refresh();
          }
        }
      });
    }
  };

  render() {
    return (
      <Modal
        title="置净"
        visible={this.props.visible}
        onCancel={this.props.handleCancle}
        onOk={this.handleSubmit}
      >
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
        </div>
        <Checkbox.Group
          style={{ width: '100%' }}
          onChange={this.onChange}
          value={this.state.checkedIds}
        >
          <Row type="flex">
            {this.state.rooms.map(item => (
              <Col span={8} key={item.id}>
                <Checkbox key={item.id} value={item.id}>
                  {item.room_no}({item.description})
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>
    );
  }
}

export default ChangeClear;
