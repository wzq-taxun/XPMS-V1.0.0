import React from 'react';
import numeral from 'numeral';

const yuan = val => `${numeral(val).format('0,0.00')}`;
/**
 * 减少使用 dangerouslySetInnerHTML
 */

export default class Yuan extends React.Component {
  main = null;

  componentDidMount() {
    this.renderToHtml();
  }

  componentDidUpdate() {
    this.renderToHtml();
  }

  renderToHtml = () => {
    const { children } = this.props;

    if (this.main) {
      this.main.innerHTML = yuan(children);
    }
  };

  render() {
    return (
      <span
        className={this.props.className}
        ref={ref => {
          this.main = ref;
        }}
      />
    );
  }
}
