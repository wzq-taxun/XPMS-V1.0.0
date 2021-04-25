import { Component } from 'react';
import styles from './style.less';

class StateBlock extends Component {
  render() {
    return (
      <div className={styles.staBlockContain} onClick={this.props.click}>
        <img src={this.props.icon} />
        <span className={this.props.active ? styles.active : null}>{this.props.text}</span>
        <span className={this.props.active ? styles.active : null}>{this.props.count || 0}</span>
      </div>
    );
  }
}

export default StateBlock;
