import { Component } from 'react';
import { Row, Col } from 'antd';
import Room from './Room';
import styles from './style.less';

class Floor extends Component {
  render() {
    return (
      <>
        {this.props.floor.rooms && this.props.floor.rooms.length > 0 && (
          <>
            <Row>
              <span>{this.props.floor.floor}</span>
              {/* <span className={styles.floorStatusLabel}>(空净</span>
              <span></span>
              <span className={styles.floorStatusLabel}>住净</span>
              <span></span>
              <span className={styles.floorStatusLabel}>空脏</span>
              <span></span>
              <span className={styles.floorStatusLabel}>住脏</span>
              <span></span>
              <span className={styles.floorStatusLabel}>维修 </span>
              <span></span>
              <span className={styles.floorStatusLabel}>锁房)</span>
              <span></span> */}
            </Row>

            <Row type="flex" onClick={() => {}}>
              {this.props.floor.rooms.map((room, index) => (
                <Col span={4} key={index}>
                  <Room
                    statusColor={this.props.statusColor}
                    statusBackgroudImg={this.props.statusBackgroudImg}
                    {...room}
                    left={(index + 1) % 6 == 0}
                    refresh={this.props.refresh}
                  ></Room>
                </Col>
              ))}
            </Row>
          </>
        )}
      </>
    );
  }
}

export default Floor;
