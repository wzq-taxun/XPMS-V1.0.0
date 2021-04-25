import { Component } from 'react';
import { Checkbox, Row, Col } from 'antd';
import styles from './statusFilter.less';

class StatusFilter extends Component {
  render() {
    return (
      <div className={styles.contain}>
        <div className={styles.title}>房态</div>
        <Checkbox.Group
          className={styles.ckGroup}
          onChange={values => this.props.handleStatusChange(values)}
        >
          <Row type="flex">
            <Col span={24}>
              <Checkbox value="ALL" className={styles.ck}>
                <span style={{ background: '#a96060' }} className={styles.ckLabel}>
                  全&emsp;部
                  <span className={styles.ckLabelCount}>{this.props.statusCount.ALL}</span>
                </span>
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="VC" className={styles.ck}>
                <span style={{ background: this.props.statusColor.VC }} className={styles.ckLabel}>
                  空净房<span className={styles.ckLabelCount}>{this.props.statusCount.VC}</span>
                </span>
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="VD" className={styles.ck}>
                <span style={{ background: this.props.statusColor.VD }} className={styles.ckLabel}>
                  空脏房<span className={styles.ckLabelCount}>{this.props.statusCount.VD}</span>
                </span>
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="OC" className={styles.ck}>
                <span style={{ background: this.props.statusColor.OC }} className={styles.ckLabel}>
                  住净房<span className={styles.ckLabelCount}>{this.props.statusCount.OC}</span>
                </span>
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="OD" className={styles.ck}>
                <span style={{ background: this.props.statusColor.OD }} className={styles.ckLabel}>
                  住脏房<span className={styles.ckLabelCount}>{this.props.statusCount.OD}</span>
                </span>
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="OS" className={styles.ck}>
                <span style={{ background: this.props.statusColor.OS }} className={styles.ckLabel}>
                  停用房<span className={styles.ckLabelCount}>{this.props.statusCount.OS}</span>
                </span>
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox value="OO" className={styles.ck}>
                <span style={{ background: this.props.statusColor.OO }} className={styles.ckLabel}>
                  维修房<span className={styles.ckLabelCount}>{this.props.statusCount.OO}</span>
                </span>
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </div>
    );
  }
}

export default StatusFilter;
