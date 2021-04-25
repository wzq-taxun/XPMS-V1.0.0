import { useState, createContext, useRef } from 'react';
import {
  getequipmentconfiglist,
  addequipmentconfiglist,
  updateequipmentconfig,
  deleteequipment,
} from '@/services/equipment';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, message, Button, Popconfirm, Divider } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';
// 引入表单新建模块
import Addequimform from './addequipmentform';
// 引入表单 修改模块
import Updatefrom from './updatequipmentfrom';
import Constants from '@/constans';
export const FatherContext = createContext();
const equipmentconfig = props => {
  const [columns] = useState([
    {
      title: '读卡设备id',
      dataIndex: 'device_id',
      key: 'device_id',
    },
    {
      title: '计算机ip',
      dataIndex: 'computer_ip',
      width: 200,
      key: 'computer_ip',
    },
    {
      title: '是否对接pms',
      dataIndex: 'is_pms',
      valueEnum: {
        '1': {
          text: '对接',
        },
        '0': {
          text: '不对接',
        },
      },
    },
    {
      title: '备注',
      key: 'memo',
      dataIndex: 'memo',
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <>
            <a onClick={() => handleUpdateRow(text, record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm
              style={{ width: '100px' }}
              placement="right"
              title="确定删除"
              onConfirm={() => confirm(record, text)}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ]);
  const [visible, setVisible] = useState(false);
  const [visibleupdate, setVisibleupdate] = useState(false);
  const [deviceid, setDeviceid] = useState('');
  const [computerip, setComputerip] = useState('');
  const [ispms, setIspms] = useState('0');
  const [memo, setMemo] = useState('');
  //   -------------------
  const [deviceidupdate, setDeviceidupdata] = useState('');
  const [computeripupdate, setComputeripupdata] = useState('');
  const [ispmsupdate, setIspmsupdata] = useState('');
  const [memoupdate, setMemoupdata] = useState('');
  const [id, setId] = useState('');
  // ----------------
  const [gochuancan, setGochuancan] = useState('');
  const [gochuancanupdate, setGochuancanuptate] = useState('');
  const [islodingfou, setIslodingfou] = useState(false);
  // 点击删除
  const confirm = (record, text) => {
    const { id } = record;
    //   此处 发起删除请求
    deleteequipment({ id, valid: '0' }).then(res => {
      if (!res || (res && res.code !== Constants.SUCCESS))
        return message.warning(res.message || '删除失败');
      //   重新刷新从新获取
      actionRef.current.reload();
      message.info(res.message || '删除成功');
    });
  };
  // 新建添加接口
  const handeraddequilist = () => {
    setVisible(true);
    setGochuancan('1');
  };
  //   点击修改接口
  const handleUpdateRow = (text, record) => {
    // 打开修改模态框
    setVisibleupdate(true);
    setId(text);
    // console.log(text, record);
    setGochuancanuptate(record);
  };
  const handleCancel = e => {
    setGochuancan('2');
    setVisible(false);
  };
  const handleCancelupdate = () => {
    setVisibleupdate(false);
  };
  const handleOk = e => {
    // 判空
    let star = computerip.replace(/(^\s*)|(\s*$)/g, '') || deviceid.replace(/(^\s*)|(\s*$)/g, '');
    if (star === '' || star === undefined || star === null) {
      // 清空输入框的值
      setDeviceid('');
      setComputerip('');
      setGochuancan('3');
      return message.warning('请输入内容');
    }
    // 发起新建提交接口
    setIslodingfou(true);
    let data = { computer_ip: computerip, device_id: deviceid, is_pms: ispms, memo };
    addequipmentconfiglist(data).then(res => {
      console.log(res);
      if (!res || (res && res.code !== Constants.SUCCESS)) return message.warning(res.message);
      setIslodingfou(false);
      setVisible(false);
      //   重新刷新从新获取
      actionRef.current.reload();
      // 清空输入框的值
      setDeviceid('');
      setComputerip('');
      setGochuancan('4');
    });
  };
  const handleOkupdate = () => {
    setIslodingfou(true);
    //   点击确定发起修改接口
    let data = {
      computer_ip: computeripupdate,
      device_id: deviceidupdate,
      is_pms: ispmsupdate,
      memo: memoupdate,
      id,
    };
    updateequipmentconfig(data).then(res => {
      console.log(res);
      if (res && res.code !== Constants.SUCCESS) return message.warning(res.message || '修改失败');
      message.success(res.message || '修改成功');
      //   重新刷新从新获取
      actionRef.current.reload();
      setIslodingfou(false);
      setVisibleupdate(false);
    });
  };
  const actionRef = useRef();
  return (
    <GridContent>
      <>
        <ProTable
          actionRef={actionRef}
          className={styles.myequi}
          columns={columns}
          rowKey="id"
          request={params => getequipmentconfiglist(params)}
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={() => handeraddequilist()}>
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
        {/* 显示对话框新建对话框 */}
        <Modal
          title="添加设备配置"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={islodingfou}
        >
          {/* 关键代码 */}
          {/* 提供器 */}
          <FatherContext.Provider value={gochuancan}>
            <Addequimform
              setdeviceid={setDeviceid}
              setcomputerip={setComputerip}
              setispms={setIspms}
              setmemo={setMemo}
            />
          </FatherContext.Provider>
        </Modal>
        {/* 显示对话框修改 */}
        <Modal
          title="修改设备配置"
          visible={visibleupdate}
          onOk={handleOkupdate}
          onCancel={handleCancelupdate}
          confirmLoading={islodingfou}
        >
          {/* 关键代码 */}
          {/* 提供器 */}
          <FatherContext.Provider value={gochuancanupdate}>
            <Updatefrom
              setdeviceidupdata={setDeviceidupdata}
              setcomputeripupdata={setComputeripupdata}
              setispmsupdata={setIspmsupdata}
              setmemoupdata={setMemoupdata}
            />
          </FatherContext.Provider>
        </Modal>
      </>
    </GridContent>
  );
};

export default equipmentconfig;
