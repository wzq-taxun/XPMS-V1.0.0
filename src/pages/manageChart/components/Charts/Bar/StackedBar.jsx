import { Axis, Chart, Geom, Tooltip, Legend } from 'bizcharts';
import React, { Component } from 'react';
import Debounce from 'lodash.debounce';
import autoHeight from '../autoHeight';
import styles from '../index.less';
import { DataSet } from '@antv/data-set';

class StackedBar extends Component {
  state = {
    autoHideXLabels: false,
  };

  root = undefined;

  node = undefined;

  resize = Debounce(() => {
    if (!this.node || !this.node.parentNode) {
      return;
    }

    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;

    if (!autoLabel) {
      return;
    }

    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }, 500);

  componentDidMount() {
    window.addEventListener('resize', this.resize, {
      passive: true,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  render() {
    const { height = 1, title, forceFit = true, data, padding } = this.props;

    let fields = [];
    const item = (data && data[0]) || {};
    for (let p in item) {
      if (p != 'name') {
        fields.push(p);
      }
    }

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      // fields: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
      fields: fields,
      // 展开字段集
      key: 'x',
      // key字段
      value: 'y', // value字段
    });

    const { autoHideXLabels } = this.state;
    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
      },
    };
    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y,
      }),
    ];
    return (
      <div
        className={styles.chart}
        style={{
          height,
        }}
        ref={this.handleRoot}
      >
        <div ref={this.handleRef}>
          {title && (
            <h4
              style={{
                marginBottom: 20,
              }}
            >
              {title}
            </h4>
          )}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={dv}
            padding={padding || 'auto'}
          >
            <Legend />
            <Axis
              name="x"
              // title={false}
              // label={autoHideXLabels ? undefined : {}}
              // tickLine={autoHideXLabels ? undefined : {}}
            />
            {/* <Axis name="y" min={0} /> */}
            <Axis name="y" />
            {/* <Tooltip showTitle={false} crosshairs={false} /> */}
            <Tooltip />
            <Geom
              type="intervalStack"
              position="x*y"
              color={'name'}
              // tooltip={tooltip}
              // style={{
              //   stroke: '#fff',
              //   lineWidth: 1,
              // }}
            />
          </Chart>
        </div>
      </div>
    );
  }
}

export default autoHeight()(StackedBar);
