import { Row, Col } from 'antd';

const StatisticsCard = props => {
  const pStyle = { padding: 0, margin: 0, fontWeight: 400, color: '#000' };

  return (
    <div
      style={{
        background: '#fff',
        padding: '20px 0 30px 20px',
        fontSize: '14px',
        borderRadius: '5px',
      }}
    >
      <h3 style={{ margin: 0, padding: 0, fontSize: '14px', color: '#929292' }}>{props.title}</h3>
      <Row>
        <Col span={14}>
          <div
            style={{
              textAlign: 'center',
              borderRight: '1px solid #e6e6e6',
            }}
          >
            <p style={{ ...pStyle, fontSize: '18px' }}>{props.num}</p>
            <p style={pStyle}>{props.category}</p>
          </div>
        </Col>
        <Col span={10}>
          <div style={{ textAlign: 'center' }}>
            <img src={props.img} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCard;
