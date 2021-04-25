import { List, Form, Input, Button, Modal } from 'antd';
import { useState } from 'react';
import SetPassword from './SetPassword';

const SecurityView = props => {
  const passwordStrength = {
    strong: <span className="strong">强</span>,
    medium: <span className="medium">一般</span>,
    weak: <span className="weak">弱</span>,
  };

  const getData = () => [
    {
      title: '账户密码',
      description: <>当前密码强度 ：{passwordStrength.strong}</>,
      actions: [
        <a key="Modify" onClick={() => setPwVis(true)}>
          修改
        </a>,
      ],
    },
  ];

  const data = getData();

  const [pwVis, setPwVis] = useState(false);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />

      <SetPassword vis={pwVis} handleCancel={() => setPwVis(false)} />
    </>
  );
};

export default SecurityView;
