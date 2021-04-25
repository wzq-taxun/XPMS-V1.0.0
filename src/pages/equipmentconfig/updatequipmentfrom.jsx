import { useState, useContext, useEffect } from 'react';
import { FatherContext } from './index';
import { Form, Input, Select } from 'antd';
const { Option } = Select;

const Formupodate = props => {
  // 子像父传值
  const { setdeviceidupdata, setcomputeripupdata, setispmsupdata, setmemoupdata } = props;
  // 获取父组件转递的值
  const baseval = useContext(FatherContext);
  console.log(baseval);
  const [deviceidup, setDeviceidup] = useState('');
  const [computeripup, setComputeripup] = useState('');
  const [ispmsup, setIspmsup] = useState('');
  const [memoup, setMemoup] = useState('');
  useEffect(() => {
    setDeviceidup(baseval.device_id);
    setComputeripup(baseval.computer_ip);
    setIspmsup(baseval.is_pms);
    setMemoup(baseval.memo || '');
  }, [baseval]);
  const chufadeviceup = e => {
    setDeviceidup(e.target.value);
    setdeviceidupdata(e.target.value);
  };
  const chufacomputeripup = e => {
    setComputeripup(e.target.value);
    setcomputeripupdata(e.target.value);
  };
  const chufaispmsup = e => {
    setIspmsup(e);
    setispmsupdata(e);
  };
  const chufabeizhuup = e => {
    setMemoup(e.target.value);
    setmemoupdata(e.target.value);
  };
  return (
    <div>
      <Form layout="horizontal">
        <Form.Item label="读卡设备id" hasFeedback>
          <Input value={deviceidup} onChange={e => chufadeviceup(e)} />
        </Form.Item>
        <Form.Item label="计算机Ip">
          <Input value={computeripup} onChange={e => chufacomputeripup(e)} />
        </Form.Item>
        <Form.Item label="是否对接pms">
          <Select value={ispmsup} onSelect={e => chufaispmsup(e)}>
            <Option value="1">对接</Option>
            <Option value="0">不对接</Option>
          </Select>
        </Form.Item>
        <Form.Item label="备注">
          <Input value={memoup} onChange={e => chufabeizhuup(e)} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Formupodate;
