import { useState, useContext, useEffect } from 'react';
import { FatherContext } from './index';
import { Form, Input, Select } from 'antd';
const { Option } = Select;

const FormLayoutDemo = props => {
  // 子像父传值
  const { setshowcode, setshowshuo, setshowhand } = props;
  // 获取父组件转递的值
  const baseval = useContext(FatherContext);
  const [memo, setMemo] = useState('');
  const [is_cache, setIs_cache] = useState('');
  const [code, setCode] = useState('');
  useEffect(() => {
    setMemo(baseval.memo);
    setIs_cache(baseval.is_cache);
    setCode(baseval.code);
  }, [baseval]);
  const chufamemo = e => {
    // 修改memo
    setMemo(e.target.value);
    setshowshuo(e.target.value);
  };
  const chufacode = e => {
    // 修改code
    setCode(e.target.value);
    setshowcode(e.target.value);
  };
  const chufaIs_cache = e => {
    console.log(e);
    // 修改Is_cache
    setIs_cache(e);
    setshowhand(e);
  };
  return (
    <div>
      <Form layout="horizontal">
        <Form.Item label="是否缓存" hasFeedback>
          <Select value={is_cache} onSelect={e => chufaIs_cache(e)}>
            <Option value="1">缓存</Option>
            <Option value="0">不缓存</Option>
          </Select>
        </Form.Item>
        <Form.Item label="说明">
          <Input value={memo} onChange={e => chufamemo(e)} />
        </Form.Item>
        <Form.Item label="值">
          <Input value={code} onChange={e => chufacode(e)} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormLayoutDemo;
