import { AutoComplete, Icon, Input, Menu, Spin, Col, Row, List } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import styles from './index.less';
import HeaderDropdown from '../HeaderDropdown';
import { router } from 'umi';
import moment from 'moment';
import { getLatestOrderByRoom, getLatestOrderByKeyWord } from '@/services/order';
import Constants from '@/constans';
export default class HeaderSearch extends Component {
  static defaultProps = {
    defaultActiveFirstOption: false,
    onPressEnter: () => {},
    onSearch: () => {},
    onChange: () => {},
    className: '',
    placeholder: '',
    dataSource: [],
    defaultOpen: false,
    onVisibleChange: () => {},
    roomOrders: [],
  };

  static getDerivedStateFromProps(props) {
    if ('open' in props) {
      return {
        searchMode: props.open,
      };
    }

    return null;
  }

  inputRef = null;

  constructor(props) {
    super(props);
    this.state = {
      searchMode: props.defaultOpen,
      value: props.defaultValue,
    };
    this.debouncePressEnter = debounce(this.debouncePressEnter, 500, {
      leading: true,
      trailing: false,
    });
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      this.debouncePressEnter();
    }
  };
  onChange = value => {
    if (typeof value === 'string') {
      const { onSearch, onChange } = this.props;
      this.setState({
        value,
      });

      if (onSearch) {
        onSearch(value);
      }

      if (onChange) {
        onChange(value);
      }
    }
  };
  enterSearchMode = () => {
    const { onVisibleChange } = this.props;
    onVisibleChange(true);
    this.setState(
      {
        searchMode: true,
      },
      () => {
        const { searchMode } = this.state;

        if (searchMode && this.inputRef) {
          this.inputRef.focus();
        }
      },
    );
  };
  leaveSearchMode = () => {
    this.setState({
      searchMode: false,
    });
  };
  debouncePressEnter = () => {
    // const { onPressEnter } = this.props;
    const { value } = this.state;
    // onPressEnter(value || '');
    this.searchData(value);
  };

  searchData = value => {
    if (value) {
      getLatestOrderByRoom(value).then(rsp => {
        // getLatestOrderByKeyWord(value).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          const data = rsp.data || [];
          this.setState({ roomOrders: data });
        }
      });
    }
  };

  render() {
    const { className, defaultValue, placeholder, open, ...restProps } = this.props;
    const { searchMode, value } = this.state;
    delete restProps.defaultOpen; // for rc-select not affected

    const inputClass = classNames(styles.input, {
      [styles.show]: searchMode,
    });

    const menuHeaderDropdown = (
      <List
        size="small"
        bordered={true}
        style={{ width: '500px', left: '-200px' }}
        dataSource={this.state.roomOrders}
        renderItem={item => (
          <List.Item>
            <Row
              style={{ width: '100%', cursor: 'pointer' }}
              onClick={() => {
                this.setState({ value: null, roomOrders: [] });
                router.push({ pathname: 'orderDetail', query: { orderId: item.id } });
              }}
            >
              <Col span={3} style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
                {item.room_no}
              </Col>
              <Col span={4} style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
                {item.order_no}
              </Col>
              <Col span={2} style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
                {item.status}
              </Col>
              <Col span={6} style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
                <div
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    wordBreak: 'keep-all',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.guest_name}
                </div>
              </Col>
              <Col span={9} style={{ textAlign: 'center' }}>
                {item.checkin_time && moment(item.checkin_time).format('MM-DD HH:mm')}&nbsp;-&nbsp;
                {item.checkout_time && moment(item.checkout_time).format('MM-DD HH:mm')}
              </Col>
            </Row>
          </List.Item>
        )}
      />
    );

    return (
      <HeaderDropdown
        overlay={menuHeaderDropdown}
        trigger={['click']}
        overlayClassName={styles.popover}
      >
        <span
          className={classNames(className, styles.headerSearch)}
          onClick={this.enterSearchMode}
          onTransitionEnd={({ propertyName }) => {
            if (propertyName === 'width' && !searchMode) {
              const { onVisibleChange } = this.props;
              onVisibleChange(searchMode);
            }
          }}
        >
          <Icon type="search" key="Icon" />
          <AutoComplete
            key="AutoComplete"
            {...restProps}
            className={inputClass}
            value={value}
            onChange={this.onChange}
          >
            <Input
              ref={node => {
                this.inputRef = node;
              }}
              defaultValue={defaultValue}
              aria-label={placeholder}
              placeholder={placeholder}
              onKeyDown={this.onKeyDown}
              // onBlur={this.leaveSearchMode}
              // className={inputClass}
            />
          </AutoComplete>
        </span>
      </HeaderDropdown>
    );
  }
}
