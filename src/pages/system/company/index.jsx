import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getOnCompany, getAllCompany } from '@/services/account';
import { updateCompany } from '@/services/company';
import { Button, message, Divider, Popconfirm, Icon, Tabs } from 'antd';
import Constants from '@/constans';
import { useState, useRef } from 'react';
import CompanyModal from './CompanyModal';
import RechargeModal from './RechargeModal';
import Balance from './Balance';
const { TabPane } = Tabs;

const Company = props => {
  const columns = [
    {
      title: '单位名称',
      dataIndex: 'name',
    },

    {
      title: '公司类型',
      dataIndex: 'code_base_id',
      valueEnum: {
        38: {
          text: '协议公司',
        },
        39: {
          text: '中介/旅行社',
        },
      },
    },

    {
      title: '是否有AR协议',
      dataIndex: 'ar_account',
      valueEnum: {
        '0': {
          text: '无',
        },
        '1': {
          text: '有',
        },
      },
    },

    {
      title: '消费限额',
      dataIndex: 'account_limit',
    },
    {
      title: '账户余额',
      dataIndex: 'account_balance',
      render: text => -text || 0,
    },
    {
      title: '结余',
      dataIndex: 'balance',
    },
    {
      title: '有效',
      dataIndex: 'valid',
      key: 'valid',
      valueEnum: {
        '0': {
          text: '无效',
        },
        '1': {
          text: '有效',
        },
      },
    },

    {
      title: '城市',
      dataIndex: 'city',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '联系人',
      dataIndex: 'linkman',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '销售员',
      dataIndex: 'representative',
    },

    {
      title: '开票名称',
      dataIndex: 'company',
    },

    {
      title: '纳税人识别号',
      dataIndex: 'taxpayer_no',
    },
    {
      title: '纳税人电话',
      dataIndex: 'telPhone',
    },
    {
      title: '开户行',
      dataIndex: 'bank_name',
    },
    {
      title: '账户',
      dataIndex: 'bank_account',
    },
    {
      title: '纳税人邮箱',
      dataIndex: 'tax_emai',
    },

    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleReceive(record)}>预收</a>
            <Divider type="vertical" />
            <a onClick={e => handleUpdateRow(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要停用此协议单位？" onConfirm={() => handleDeleteRow(record)}>
              <a>停用</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const [modalVis, setModalVis] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [add, setAdd] = useState(true);
  const actionRef = useRef();

  const [chargeModalVis, setChargeModalVis] = useState(false);
  const [company, setCompany] = useState({});

  const [showCompany, setShowCompany] = useState(true);

  const [columnsStateMap, setColumnsStateMap] = useState({
    valid: { show: false },
    address: { show: false },
    email: { show: false },
    representative: { show: false },
    taxpayer_no: { show: false },
    telPhone: { show: false },
    bank_name: { show: false },
    bank_account: { show: false },
    tax_emai: { show: false },
  });

  const handleAdd = () => {
    setFormValues(null);
    setAdd(true);
    setModalVis(true);
  };

  const handleUpdateRow = record => {
    setFormValues(record);
    setAdd(false);
    setModalVis(true);
  };

  const handleDeleteRow = record => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    updateCompany([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const handleCancel = refush => {
    setModalVis(false);
    setChargeModalVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const handleReceive = record => {
    setChargeModalVis(true);
    setCompany(record);
  };

  const handleBack = () => {
    setShowCompany(true);
  };

  return (
    <GridContent>
      {showCompany ? (
        <ProTable
          search={false}
          actionRef={actionRef}
          columns={columns}
          request={() => getAllCompany()}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          toolBarRender={(action, { selectedRows }) => [
            <Button icon="plus" type="primary" onClick={() => handleAdd()}>
              新建
            </Button>,
          ]}
          columnsStateMap={columnsStateMap}
          onColumnsStateChange={map => {
            setColumnsStateMap(map);
          }}
          onRow={record => {
            return {
              onDoubleClick: e => {
                setCompany(record);
                setShowCompany(false);
              },
            };
          }}
        />
      ) : (
        <Tabs
          defaultActiveKey="unSettle"
          style={{ background: '#fff', padding: '10px' }}
          tabBarExtraContent={
            <Button
              onClick={() => {
                setShowCompany(true);
              }}
            >
              返回
            </Button>
          }
        >
          <TabPane tab="未结" key="unSettle">
            <Balance company={company} unSettle={true} />
          </TabPane>
          <TabPane tab="已结" key="settle">
            <Balance company={company} />
          </TabPane>
        </Tabs>
      )}

      <CompanyModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />

      <RechargeModal
        visible={chargeModalVis}
        company={company}
        handleCancel={refush => handleCancel(refush)}
      />
    </GridContent>
  );
};

export default Company;
