import { useState, createContext, useRef, } from 'react';
import { getbasesall, uptadebasesall } from '@/services/basecode';
import { Modal, message, Form } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import styles from './style.less';
// 引入表单
import Baseform from './baseFormbiao';
import Constants from '@/constans';
export const FatherContext = createContext();
const newpage = props => {
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState('');
  const [memo, setMemo] = useState('');
  const [is_cache, setIs_cache] = useState('');
  const [id, setId] = useState('');
  const [gochuancan, setGochuancan] = useState('');
  const [isfoujiazai, setIsfoujiazai] = useState(false);
  // 修改
  const handleUpdateRow = (text, record) => {
    setVisible(true);
    setId(record);
    setGochuancan(text);
  };
  const handleOk = e => {
    setIsfoujiazai(true);
    // 发起请求更新
    let data = {
      code,
      description: '',
      id,
      is_cache,
      memo,
    };
    uptadebasesall(data).then(rsp => {
      // console.log(rsp);
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '修改成功');
        setIsfoujiazai(false);
        setVisible(false);
        // 更新列表后退出模态框
        actionRef.current.reload();
      }
    });
  };

  const handleCancel = e => {
    setVisible(false);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      // key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      // key: 'description',
      hideInSearch: true,
    },
    {
      title: '值',
      // key: 'code',
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: '是否缓存',
      dataIndex: 'is_cache',
      hideInSearch: true,
      valueEnum: {
        '1': {
          text: '缓存',
        },
        '0': {
          text: '不缓存',
        },
      },
    },
    {
      title: '是否有效',
      dataIndex: 'valid',
      hideInSearch: true,
      valueEnum: {
        '1': {
          text: '有效',
        },
        '0': {
          text: '无效',
        },
      },
    },
    {
      hideInSearch: true,
      title: '说明',
      // key: 'memo',
      dataIndex: 'memo',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'id',
      hideInSearch: true,
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleUpdateRow(record, text)}>修改</a>
          </span>
        );
      },
    },
  ];
  const actionRef = useRef();
  return (
    <GridContent>
      <>
        <ProTable
          headerTitle="基础配置列表"
          actionRef={actionRef}
          className={styles.myTabs}
          columns={columns}
          rowKey="id"
          search={false}
          request={params => getbasesall(params)}
        />
        {/* 显示对话框 */}
        <Modal
          title="基础配置"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={isfoujiazai}
        >
          {/* 关键代码 */}
          {/* 提供器 */}
          <FatherContext.Provider value={gochuancan}>
            <Baseform setshowcode={setCode} setshowshuo={setMemo} setshowhand={setIs_cache} />
          </FatherContext.Provider>
        </Modal>
      </>
    </GridContent>
  );
};

export default Form.create()(newpage);
