import styles from '../style.less';
import { Row, Col, DatePicker, Input, Select, Button } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const LeaveWord = props => {
  return (
    <>
      <Row>
        <Col span={8}>生效</Col>
        <Col span={16}>
          <DatePicker />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={8}>失效</Col>
        <Col span={16}>
          <DatePicker />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={8}>摘要</Col>
        <Col span={16}>
          <TextArea rows={4} />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={8}>修改人</Col>
        <Col span={16}>
          <Select style={{ width: '100%' }}>
            <Option value="admin">管理员</Option>
            <Option value="wmm">王木木</Option>
          </Select>
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={8}>修改时间</Col>
        <Col span={16}>
          <DatePicker />
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col offset={8}>
          <Button onClick={props.handleCancle}>取消</Button>
          <Button type="primary" style={{ marginLeft: '10px' }}>
            确认
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default LeaveWord;
