import styles from './style.less';
import { Row, Col, Input, Select, InputNumber, Button } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

const PrePayInfoPanel = props => {
  return (
    <>
      <Row className={styles.rzInfoRow}>
        <Col span={8}>金额:</Col>
        <Col span={16}>
          <Input className={styles.inp} />
        </Col>
      </Row>
      <Row className={styles.rzInfoRow}>
        <Col span={8}>付款方式:</Col>
        <Col span={16}>
          <Select defaultValue={1} className={styles.inp}>
            <Option value={1}>现金</Option>
            <Option value={2}>支付宝</Option>
          </Select>
        </Col>
      </Row>
      <Row className={styles.rzInfoRow}>
        <Col span={8}>单号:</Col>
        <Col span={16}>
          <Input className={styles.inp} />
        </Col>
      </Row>
      <Row className={styles.rzInfoRow}>
        <Col span={8}>付款人:</Col>
        <Col span={16}>
          <Input className={styles.inp} />
        </Col>
      </Row>
      <Row style={{ padding: '3px' }}>
        <Col span={8}>备注:</Col>
        <Col span={16}>
          <TextArea rows={4} />
        </Col>
      </Row>
      <Row className={styles.rzInfoRow}>
        <Col span={8}>打印份数:</Col>
        <Col span={16}>
          <InputNumber className={styles.inp} />
        </Col>
      </Row>
      <Row>
        <Col span={8} style={{ textAlign: 'center' }}>
          <Button>核对</Button>
        </Col>
        <Col span={8} style={{ textAlign: 'center' }}>
          <Button>取消</Button>
        </Col>
        <Col span={8} style={{ textAlign: 'center' }}>
          <Button type="primary">确认</Button>
        </Col>
      </Row>
    </>
  );
};

export default PrePayInfoPanel;
