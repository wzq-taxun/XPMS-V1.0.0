import { useState, useContext, useEffect } from 'react';
import { FatherContext } from './index';
import { Form, Input, Select } from 'antd';
const { Option } = Select;

const FormLayoutDemo = props => {
  // 子像父传值
  const { setdeviceid, setcomputerip, setispms, setmemo } = props;
  // 获取父组件转递的值
  const baseval = useContext(FatherContext);
  //   console.log(baseval);
  const [deviceid, setDeviceid] = useState('');
  const [computerip, setComputerip] = useState('');
  const [ispms, setIspms] = useState('');
  const [memo, setMemo] = useState('');
  useEffect(() => {
    setDeviceid('');
    setComputerip('');
    setIspms('0');
    setMemo('');
  }, [baseval]);
  const chufadevice = e => {
    setDeviceid(e.target.value);
    setdeviceid(e.target.value);
  };
  const chufacomputerip = e => {
    setComputerip(e.target.value);
    setcomputerip(e.target.value);
  };
  const chufaispms = e => {
    setIspms(e);
    setispms(e);
  };
  const chufabeizhu = e => {
    setMemo(e.target.value);
    setmemo(e.target.value);
  };
  return (
    <div>
      <Form layout="horizontal">
        <Form.Item label="读卡设备id" hasFeedback>
          <Input value={deviceid} onChange={e => chufadevice(e)} />
        </Form.Item>
        <Form.Item label="计算机Ip">
          <Input value={computerip} onChange={e => chufacomputerip(e)} />
        </Form.Item>
        <Form.Item label="是否对接pms">
          <Select value={ispms} onSelect={e => chufaispms(e)}>
            <Option value="1">对接</Option>
            <Option value="0">不对接</Option>
          </Select>
        </Form.Item>
        <Form.Item label="备注">
          <Input value={memo} onChange={e => chufabeizhu(e)} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormLayoutDemo;
