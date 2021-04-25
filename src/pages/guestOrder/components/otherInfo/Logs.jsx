import { Table, Col, Row, Button } from 'antd';
import styles from '../style.less';
import moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';
import { getLogs } from '@/services/order';
import Constants from '@/constans';

const Logs = props => {
  const columns = [
    {
      title: '时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: text => moment(text).format('MM-DD HH:mm'),
    },
    {
      title: '项目',
      dataIndex: 'field_name',
      key: 'field_name',
    },
    // {
    //   title: '旧值',
    //   dataIndex: 'old_value',
    //   key: 'old_value',
    // },
    // {
    //   title: '新值',
    //   dataIndex: 'new_value',
    //   key: 'new_value',
    // },
    // {
    //   title: '操作者',
    //   dataIndex: 'create_user',
    //   key: 'create_user',
    // },
  ];

  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [log, setLog] = useState({});

  useEffect(() => {
    getLogs(props.id).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        setData(data);
      }
    });
  }, []);

  const handleRowClick = record => {
    setLog(record);
    setShow(true);
  };

  return (
    <>
      {!show ? (
        <>
          <Table
            columns={columns}
            dataSource={data}
            size="small"
            rowKey="id"
            rowClassName={styles.rowPointer}
            onRow={record => {
              return {
                onClick: e => handleRowClick(record),
              };
            }}
          />
          <Row style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={props.handleCancle}>
              取消
            </Button>
          </Row>
        </>
      ) : (
        <div className={styles.logDetail}>
          <Row>
            <Col span={6} className={styles.label}>
              时间:
            </Col>
            <Col span={18} className={styles.info}>
              {log.create_time}
            </Col>
          </Row>
          <Row>
            <Col span={6} className={styles.label}>
              项目:
            </Col>
            <Col span={18} className={styles.info}>
              {log.field_name}
            </Col>
          </Row>
          <Row>
            <Col span={6} className={styles.label}>
              旧值:
            </Col>
            <Col span={18} className={styles.info}>
              {log.old_value}
            </Col>
          </Row>
          <Row>
            <Col span={6} className={styles.label}>
              新值:
            </Col>
            <Col span={18} className={styles.info}>
              {log.new_value}
            </Col>
          </Row>
          <Row>
            <Col span={6} className={styles.label}>
              修改者:
            </Col>
            <Col span={18} className={styles.info}>
              {log.create_user}
            </Col>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={() => setShow(false)}>
              返回
            </Button>
          </Row>
        </div>
      )}
    </>
  );
};
export default Logs;
