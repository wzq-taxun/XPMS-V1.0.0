import ProTable from '@ant-design/pro-table';
import { Button, Divider, Popconfirm, message } from 'antd';
import { useState } from 'react';
import { useRef } from 'react';
import { updateMemberLevel } from '@/services/system/codeConfig';
import Constants from '@/constans';
import { getMemberLevel } from '@/services/member';
import MemberLevelModal from './MemberLevelModal';

const CodeMemberLevel = props => {
  const columns = [
    {
      title: '代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '中文描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '英文描述',
      dataIndex: 'description_en',
      key: 'description_en',
    },
    // {
    //   title: '市场码',
    //   dataIndex: 'market_code',
    //   key: 'market_code',
    // },
    // {
    //   title: '市场',
    //   dataIndex: 'market_description',
    //   key: 'market_description',
    // },
    {
      title: '是否私有',
      dataIndex: 'is_private',
      key: 'is_private',
      valueEnum: {
        '0': {
          text: '不私有',
        },
        '1': {
          text: '私有',
        },
      },
    },
    {
      title: '积分比例',
      dataIndex: 'integral_radio',
      key: 'integral_radio',
    },
    {
      title: '开始',
      dataIndex: 'date_start',
      key: 'date_start',
    },
    {
      title: '截止',
      dataIndex: 'date_end',
      key: 'date_end',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
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
      title: '操作',
      key: 'action',
      width: 160,
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => handleUpdateRow(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => handleDeleteRow(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

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
    updateMemberLevel([{ id: record.id, valid: '0', modify_user: currentUser.id }]).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.success(rsp.message || '删除成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    });
  };

  const [modalVis, setModalVis] = useState(false);
  const [add, setAdd] = useState(false);
  const [formValues, setFormValues] = useState();
  const actionRef = useRef();

  const handleCancel = refush => {
    setModalVis(false);
    if (refush) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        search={false}
        request={() => getMemberLevel()}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleAdd()}>
            新建
          </Button>,
        ]}
      />

      <MemberLevelModal
        visible={modalVis}
        handleCancel={refush => handleCancel(refush)}
        isAdd={add}
        formValues={formValues}
      />
    </>
  );
};

export default CodeMemberLevel;
