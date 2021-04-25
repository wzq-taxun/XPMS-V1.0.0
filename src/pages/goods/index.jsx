import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';
import { Input, Table, Button, Divider, Popconfirm } from 'antd';
import { useState, useRef } from 'react';
import { router } from 'umi';
import ProTable from '@ant-design/pro-table';
import { getGoods } from '@/services/order';
import AddGoods from './AddGoods';
import UpdateGoods from './UpdateGoods';
import Instorage from './InStorage';
import { getGoodsRecord, updateGoods, getStorage } from '@/services/goods';
import Constants from '@/constans';
const { Search } = Input;

const GoodsManage = props => {
  const [type, setType] = useState('goods');

  const goodsColumns = [
    {
      title: '代码',
      dataIndex: 'goods_type',
      key: 'goods_type',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '商品',
      dataIndex: 'goods_info_name',
      key: 'goods_info_name',
      align: 'center',
    },
    {
      title: '简称',
      dataIndex: 'goods_short_name',
      key: 'goods_short_name',
      align: 'center',
    },
    {
      title: '售价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '库存',
      dataIndex: 'numbers',
      key: 'numbers',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      hideInSearch: true,
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleUpdateGoods(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此商品？" onConfirm={() => handleDeleteGoods(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const inColumns = [
    {
      title: '类型',
      dataIndex: 'descr',
      key: 'descr',
      align: 'center',
    },
    {
      title: '商品',
      dataIndex: 'name',
      key: 'name',
      align: 'name',
    },
    {
      title: '入库数量',
      dataIndex: 'new_numbers',
      key: 'new_numbers',
      align: 'center',
    },
    {
      title: '入库前数量',
      dataIndex: 'old_numbers',
      key: 'old_numbers',
      align: 'center',
    },
    {
      title: '入库后数量',
      dataIndex: 'numbers',
      key: 'numbers',
      align: 'center',
    },
    {
      title: '入库时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'time',
    //   key: 'time',
    //   align: 'center',
    // },
  ];

  const storageColumns = [
    {
      title: '商品',
      dataIndex: 'descr',
      key: 'descr',
      align: 'center',
    },
    {
      title: '上日库存',
      dataIndex: 'ydStock',
      key: 'ydStock',
      align: 'center',
    },
    {
      title: '本日入库',
      dataIndex: 'newPut',
      key: 'newPut',
      align: 'center',
    },
    {
      title: '本日售出',
      dataIndex: 'newSell',
      key: 'newSell',
      align: 'center',
    },
    {
      title: '上月库存',
      dataIndex: 'yhPut',
      key: 'yhPut',
      align: 'center',
    },
    {
      title: '本月入库',
      dataIndex: 'newhPut',
      key: 'newhPut',
      align: 'center',
    },
    {
      title: '本月售出',
      dataIndex: 'newhSell',
      key: 'newhSell',
      align: 'center',
    },
    {
      title: '当前库存',
      dataIndex: 'newStock',
      key: 'newStock',
      align: 'center',
    },
  ];

  const [addModalVis, setAddModalVis] = useState(false);
  const handleAddGoods = () => {
    setAddModalVis(true);
  };

  const [updateModalVis, setUpdateModalVis] = useState(false);
  const [selectGoods, setSelectGoods] = useState(null);
  const handleUpdateGoods = record => {
    setSelectGoods(record);
    setUpdateModalVis(true);
  };

  const handleDeleteGoods = record => {
    const goods = [
      {
        id: record.goods_info_id,
        valid: '0',
      },
    ];
    console.log(goods);

    updateGoods(goods).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const actionRef = useRef();
  const cancelAddGoods = refush => {
    setAddModalVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const cancelUpdateGoods = refush => {
    setUpdateModalVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const inStorageBack = () => {
    setType('in');
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  return (
    <GridContent>
      <div className={styles.header}>
        {type == 'inStorage' ? (
          <>
            <span className={styles.tabs}>入库</span>
            <div className={styles.opContain}>
              <span className={styles.op} onClick={e => setType('in')}>
                退出
              </span>
            </div>
          </>
        ) : (
          <>
            <span className={styles.tabs} onClick={e => setType('goods')}>
              商品列表
            </span>
            <span className={styles.tabs} onClick={e => setType('in')}>
              入库单
            </span>
            <span className={styles.tabs} onClick={e => setType('storage')}>
              库存
            </span>
            <div className={styles.opContain}>
              {/* <Search style={{ width: '200px' }} /> */}
              {type == 'in' && (
                <>
                  <span className={styles.op} onClick={e => setType('inStorage')}>
                    新增
                  </span>
                  {/* <span className={styles.op}>打印</span> */}
                </>
              )}
              <span className={styles.op} onClick={e => router.push('bill')}>
                退出
              </span>
            </div>
          </>
        )}
      </div>
      <div style={{ marginTop: '10px', background: '#fff' }}>
        {type == 'goods' && (
          <ProTable
            columns={goodsColumns}
            // search={false}
            className={styles.myProtable}
            request={params => getGoods(params)}
            rowKey="goods_info_id"
            actionRef={actionRef}
            toolBarRender={(action, { selectedRows }) => [
              <Button icon="plus" type="primary" onClick={() => handleAddGoods()}>
                新建
              </Button>,
            ]}
          />
        )}
        {type == 'in' && (
          <ProTable
            columns={inColumns}
            search={false}
            rowClassName={(record, index) => {
              if (record.is_latest == '1') return styles.clickRow;
            }}
            request={() => getGoodsRecord()}
            rowKey="id"
            actionRef={actionRef}
          />
          // <Table columns={inColumns} dataSource={inData} rowKey="id" size="middle" />
        )}
        {type == 'storage' && (
          <ProTable
            columns={storageColumns}
            search={false}
            request={() => getStorage()}
            rowKey="id"
          />
          // <Table columns={storageColumns} dataSource={storageData} rowKey="id" size="middle" />
        )}
        {type == 'inStorage' && <Instorage back={() => inStorageBack()} />}
      </div>

      <AddGoods visible={addModalVis} cancelAddGoods={refush => cancelAddGoods(refush)} />
      <UpdateGoods
        goods={selectGoods}
        visible={updateModalVis}
        cancelUpdateGoods={refush => cancelUpdateGoods(refush)}
      />
    </GridContent>
  );
};

export default GoodsManage;
