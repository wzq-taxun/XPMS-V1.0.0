import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { Row, Col, Table, Button, Modal, Spin, message } from 'antd';
import { useState, useEffect } from 'react';
import { getAuditTypes, getAuditDate, auditCheck, auditStart } from '@/services/audit';
import Constants from '@/constans';
import LoginUser from './LoginUser';
import AccountUnSettle from './AccountUnsettle';
import UnArrive from './UnArrive';
import UnLeave from './UnLeave';
import IncompleteGuest from './IncompleteGuest';
import OverRoomPrice from './OverRoomPrice';
import MemberValidity from './MemberValidity';
import SynthesizeAccount from './SynthesizeAccount';
import RoomRatePreview from './RoomRatePreview';
import { connect } from 'dva';
const { confirm } = Modal;

const Audit = props => {
  const [selcetRow, setSelectRow] = useState(0);
  const [auditTypes, setAuditTypes] = useState([]);
  const [currentCode, setCurrentCode] = useState();
  const [currentUrl, setCurrentUrl] = useState();
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    if(!fetch){
      getAuditCategory();
    }
  }, [props.auditRefush]);

  const getAuditCategory = () => {
    setFetch(true);
    getAuditDate().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const audit_record_id = rsp.data && rsp.data[0] && rsp.data[0].id;
        getAuditTypes(audit_record_id).then(rsp => {
          setFetch(false);
          if (rsp && rsp.code == Constants.SUCCESS) {
            const list = rsp.data || [];
            setAuditTypes(list);
            if (list.length > 0) {
              const url = list[0].description_en;
              const arr = url.split('/');
              const code = arr[arr.length - 1];
              setCurrentCode(code);
              setCurrentUrl(url);
              setId(list[0].id);
            }
          }
        });
      }
    });
  };

  const lfColumns = [
    {
      title: '项目',
      dataIndex: 'description',
      key: 'description',
    },
    // {
    //   title: '数量',
    //   dataIndex: 'exec_order',
    //   key: 'exec_order',
    // },
    // {
    //   title: '标志',
    //   dataIndex: 'flag',
    //   key: 'flag',
    // },
  ];

  const getRowClassName = (record, index) => {
    if (selcetRow == index) {
      return styles.clickRow;
    } else {
      return styles.unClickRow;
    }
  };

  const handleLtRowClick = (record, index) => {
    const url = record.description_en;
    const arr = url.split('/');
    const code = arr[arr.length - 1];
    setCurrentCode(code);
    setCurrentUrl(url);
    setId(record.id);
    setSelectRow(index);
  };

  const handleAuditCheck = () => {
    confirm({
      title: '夜审检查',
      content: '是否进行夜审检查?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        auditCheck().then(rsp => {
          setLoading(false);
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '夜审检查成功');
          } else {
            message.error((rsp && rsp.message) || '夜审检查失败');
          }
        });
      },
    });
  };

  const handleAudit = () => {
    confirm({
      title: '夜审',
      content: '是否进行夜审?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        auditStart().then(rsp => {
          setLoading(false);
          if (rsp && rsp.code == Constants.SUCCESS) {
            message.success(rsp.message || '夜审成功');
          } else {
            message.error((rsp && rsp.message) || '夜审失败');
          }
        });
      },
    });
  };

  return (
    <Spin spinning={loading}>
      <GridContent>
        <div style={{ background: '#fff', padding: '20px 0 10px', textAlign: 'center' }}>
          <Button onClick={handleAuditCheck}>夜审检查</Button>
          <Button style={{ marginLeft: '60px' }} onClick={handleAudit}>
            夜审
          </Button>
        </div>
        <Row gutter={12}>
          <Col span={8}>
            <div className={styles.tableContain}>
              <Table
                rowKey={record => {
                  return record.id + '-' + record.description_en;
                }}
                pagination={false}
                columns={lfColumns}
                dataSource={auditTypes}
                size="middle"
                rowClassName={(record, index) => getRowClassName(record, index)}
                onRow={(record, index) => {
                  return {
                    onClick: e => handleLtRowClick(record, index),
                  };
                }}
              />
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.tableContain}>
              {currentCode == 'login' && <LoginUser url={currentUrl} id={id} />}
              {currentCode == 'account' && <AccountUnSettle url={currentUrl} id={id} />}
              {currentCode == 'checkin' && <UnArrive url={currentUrl} id={id} />}
              {currentCode == 'checkout' && <UnLeave url={currentUrl} id={id} />}
              {currentCode == 'guest' && <IncompleteGuest url={currentUrl} id={id} />}
              {currentCode == 'room' && <OverRoomPrice url={currentUrl} id={id} />}
              {currentCode == 'member' && <MemberValidity url={currentUrl} id={id} />}
              {currentCode == 'synthesizeAccount' && <SynthesizeAccount url={currentUrl} id={id} />}
              {currentCode == 'roomRate' && <RoomRatePreview url={currentUrl} id={id} />}
            </div>
          </Col>
        </Row>
      </GridContent>
    </Spin>
  );
};

export default connect(({ global }) => ({ auditRefush: global.auditRefush }))(Audit);
