import { useState, useRef } from 'react';
import { getcouponsSendConfig, deletelistmostfa } from '@/services/couponsSend';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';
import MostFavorableMock from './mostfavaraform';
import Constants from '@/constans';
let mostfavorable = props => {
  const [columns] = useState([
    {
      title: '活动类型描述',
      dataIndex: 'description',
      width: 200,
      key: 'description',
    },
    {
      title: '优惠券描述',
      dataIndex: 'coupon_desc',
      key: 'coupon_desc',
    },

    {
      title: '赠送数量',
      key: 'total',
      dataIndex: 'total',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'id',
      render: (text, record) => {
        return (
          <>
            <span>
              <a onClick={e => handleUpdateRowfavor(record, text)}>修改</a>
            </span>
            <Divider type="vertical" />
            <span>
              <Popconfirm
                placement="right"
                title="确定删除"
                onConfirm={() => confirm(record, text)}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        );
      },
    },
  ]);
  // 点击删除
  confirm = (record, text) => {
    const { id } = record;
    //   此处 发起删除请求
    deletelistmostfa({ id, valid: '0' }).then(res => {
      if (!res || (res && res.code !== Constants.SUCCESS))
        return message.warning(res.message || '删除失败');
      //   刷新
      updatalistbway();
      message.info(res.message || '删除成功');
    });
  };

  //   点击修改
  const handleUpdateRowfavor = (record, text) => {
    childRef.current.updatenewChangeVal(record);
  };
  //   点击新建出现模态框进行增加
  const childRef = useRef();
  const danchumockfavora = () => {
    // newChangeVal就是子组件暴露给父组件的方法
    childRef.current.newChangeVal();
  };
  const actionRef = useRef();
  //   接受子组件的方法
  const updatalistbway = () => {
    //   刷新
    actionRef.current.reload();
  };
  return (
    <GridContent>
      <>
        <ProTable
          actionRef={actionRef}
          className={styles.myprice}
          columns={columns}
          rowKey="id"
          search={false}
          request={params => getcouponsSendConfig(params)}
          toolBarRender={() => [
            <Button key="3" type="primary" onClick={() => danchumockfavora()}>
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
        {/* 模态框新增 */}
        <MostFavorableMock cRef={childRef} updatalistb={updatalistbway} />
      </>
    </GridContent>
  );
};
export default mostfavorable;
