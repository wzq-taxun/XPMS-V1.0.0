import { getUnUploadGuest, retryUpload, retryAllUpload } from '@/services/order';
import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { message, Popconfirm, Button } from 'antd';
import Constants from '@/constans';
import { useRef, useState } from 'react';
import { router } from 'umi';
import styles from './style.less';
import ClearModal from './ClearModal';

const GuestReUpload = props => {
  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
    },
    {
      title: '房间号',
      dataIndex: 'room_no',
      key: 'room_no',
    },
    {
      title: '到店时间',
      dataIndex: 'checkin_time',
      key: 'checkin_time',
    },
    {
      title: '离店时间',
      dataIndex: 'checkout_time',
      key: 'checkout_time',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '客人姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '客人性别',
      dataIndex: 'sex',
      key: 'sex',
      valueEnum: {
        '1': {
          text: '男',
        },
        '2': {
          text: '女',
        },
      },
    },
    {
      title: '证件号码',
      dataIndex: 'credential_no',
      key: 'credential_no',
    },
    {
      title: '证件有效期',
      dataIndex: 'credential_validate',
      key: 'credential_validate',
      render: (text, record) => {
        return (
          (record.credential_validate_start || '') + ' - ' + (record.credential_validate_end || '')
        );
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: '民族',
      dataIndex: 'nation',
      key: 'nation',
    },
    {
      title: '营业日期',
      dataIndex: 'audit_date',
      key: 'audit_date',
    },
    {
      title: '订单描述',
      dataIndex: 'order_desc',
      key: 'order_desc',
    },
    {
      title: '入住上传',
      dataIndex: 'is_upload',
      key: 'is_upload',
      valueEnum: {
        '0': {
          text: '未上传',
        },
        '1': {
          text: '已上传',
        },
      },
    },
    {
      title: '退房上传',
      dataIndex: 'is_upload_out',
      key: 'is_upload_out',
      valueEnum: {
        '0': {
          text: '未上传',
        },
        '1': {
          text: '已上传',
        },
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (text, record) => {
        return (
          <span>
            <Popconfirm
              title="是否重新上传该客户到公安网？"
              onConfirm={() => handleReUpload(record)}
            >
              <a>重新上传</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const [columnsStateMap, setColumnsStateMap] = useState({
    credential_no: { show: false },
    credential_validate: { show: false },
    address: { show: false },
    birthday: { show: false },
    nation: { show: false },
    audit_date: { show: false },
    order_desc: { show: false },
  });

  const actionRef = useRef();

  // 单条重新上传公安网
  const handleReUpload = record => {
    retryUpload([record.id]).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '上传成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  // 选中多条上传公安网
  const handleSelctRetry = () => {
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      retryUpload(selectedRowKeys).then(rsp => {
        if (rsp && rsp.code == Constants.SUCCESS) {
          message.success(rsp.message || '上传成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      });
    }
  };

  // 所有未上传上传公安网
  const handleAllRetry = () => {
    retryAllUpload().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '上传成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  const handleRowClick = record => {
    router.push({
      pathname: 'orderDetail',
      query: { orderId: record.order_info_id },
    });
  };

  const [clearVis, setClearVis] = useState(false);

  const handleClearCancel = refresh => {
    setClearVis(false);
    if (refresh) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  return (
    <GridContent>
      <ProTable
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={map => {
          setColumnsStateMap(map);
        }}
        request={() => getUnUploadGuest()}
        search={false}
        rowKey="id"
        actionRef={actionRef}
        rowSelection={rowSelection}
        rowClassName={styles.rowSty}
        onRow={record => {
          return {
            onDoubleClick: e => {
              handleRowClick(record);
            },
          };
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button key="slecet_up" type="primary" onClick={() => handleSelctRetry()}>
            选中上传
          </Button>,
          <Button key="all_up" type="primary" onClick={() => handleAllRetry()}>
            全部上传
          </Button>,
          <Button key="all_up" type="primary" onClick={() => setClearVis(true)}>
            逾期清除
          </Button>,
        ]}
      />

      <ClearModal visible={clearVis} handleCancel={refresh => handleClearCancel(refresh)} />
    </GridContent>
  );
};

export default GuestReUpload;
