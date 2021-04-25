import React, { Component } from 'react';
import { Tag, message, notification } from 'antd';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import { router } from 'umi';
import Socket from '@/utils/socket/socket';
import { getPageQuery } from '@/utils/utils';
import { stringify } from 'querystring';

class GlobalHeaderRight extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }

    Socket.created({ onMessage: this.onSocketMsg, onClose: this.onClose, onError: this.onError });
  }

  onSocketMsg = e => {
    const { dispatch } = this.props;
    const msg = JSON.parse(e.data);
    if (dispatch) {
      dispatch({
        type: 'global/addNotices',
        payload: msg,
      });
    }
    if (msg) {
      let voice = document.getElementById('voice');
      voice.play();

      notification['info']({
        message: '新消息',
        description: msg.content,
      });
    }
    if (window.location.pathname !== '/audit') {
      dispatch({
        type: 'global/changeAuditRefush',
      });
    }
  };
  onError = e => {
    console.log('socke异常', e);
    // message.error('网络异常');
    // sessionStorage.removeItem('currentUser');
    // sessionStorage.removeItem('token');
    // sessionStorage.removeItem('config');
    // const { redirect } = getPageQuery();
    // if (window.location.pathname !== '/user/login' && !redirect) {
    //   router.replace({
    //     pathname: '/user/login',
    //     search: stringify({
    //       redirect: window.location.href,
    //     }),
    //   });
    // }
  };
  onClose = e => {
    console.log('socke关闭', e);
    // message.error('网络异常连接断开,请重新登录');
    // sessionStorage.removeItem('currentUser');
    // sessionStorage.removeItem('token');
    // sessionStorage.removeItem('config');
    // const { redirect } = getPageQuery();
    // if (window.location.pathname !== '/user/login' && !redirect) {
    //   router.replace({
    //     pathname: '/user/login',
    //     search: stringify({
    //       redirect: window.location.href,
    //     }),
    //   });
    // }
  };

  changeReadState = clickedItem => {
    const { id, message_type } = clickedItem;
    const { dispatch } = this.props;

    if (message_type == '3') {
      router.push('todo');
    }

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
      });
    }
  };
  handleNoticeClear = (title, key) => {
    const { dispatch } = this.props;
    message.success(`${'清空了'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = () => {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'message_type');
  };

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach(key => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    const { unreadCount, fetchingNotices, onNoticeVisibleChange, notices = [] } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    return (
      <>
        <audio id="voice" src="https://www.xpms.cn:8080/file/hotel/voice/new_msg.mp3" />
        <NoticeIcon
          className={styles.action}
          count={unreadCount}
          onItemClick={item => {
            this.changeReadState(item);
          }}
          loading={fetchingNotices}
          clearText={'清空了'}
          viewMoreText={'查看更多'}
          onClear={this.handleNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          onViewMore={() => router.push('messageList')}
          clearClose
        >
          <NoticeIcon.Tab
            tabKey="1"
            count={unreadMsg[1]}
            list={noticeData[1]}
            title={'通知'}
            emptyText={'你已查看所有通知'}
            showViewMore
          />
          <NoticeIcon.Tab
            tabKey="2"
            count={unreadMsg[2]}
            list={noticeData[2]}
            title={'消息'}
            emptyText={'您已读完所有消息'}
            showViewMore
          />
          <NoticeIcon.Tab
            tabKey="3"
            title={'待办'}
            emptyText={'你已完成所有待办'}
            count={unreadMsg[3]}
            list={noticeData[3]}
            showViewMore
          />
        </NoticeIcon>
      </>
    );
  }
}

export default connect(({ login, global, loading }) => ({
  currentUser: login.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  unreadCount: global.unreadCount,
}))(GlobalHeaderRight);
