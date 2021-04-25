import { Button, Divider, Dropdown, Form, Icon, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ViewTemplate from './components/ViewTemplate';
import { queryReports, queryReportTypes, saveReport } from '@/services/report';
import { openPostWindow } from '@/utils/openPost';
import { useEffect } from 'react';
import Constants from '@/constans';
import EditView from './components/EditView';

const TableList = () => {
  const [viewModalVis, setViewModalVis] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [reportCode, setReportCode] = useState();
  const [reportType, setReportType] = useState('pdf');
  const [valueEnum, setValueEnum] = useState({});

  const [editVis, setEditVis] = useState(false);
  const [reportId, setReportId] = useState(null);

  useEffect(() => {
    queryReportTypes().then(rsp => {
      console.log(rsp);
      if (rsp && rsp.code && rsp.code == Constants.SUCCESS) {
        const data = rsp.data || [];
        const valueEnum = {};
        data.map(item => {
          valueEnum[item.id] = { text: item.name };
        });
        setValueEnum(valueEnum);
      }
    });
  }, []);

  const actionRef = useRef();
  const columns = [
    {
      title: '模板名称',
      dataIndex: 'report_name',
    },
    {
      title: '模板类型',
      // dataIndex: 'report_type_name',
      dataIndex: 'report_type',
      valueEnum: valueEnum,
    },
    {
      title: '类别',
      dataIndex: 'category',
      hideInSearch: true,
    },
    // {
    //   title: '导出方式',
    //   dataIndex: 'out_type',
    //   hideInSearch: true,
    // },
    // {
    //   title: '编辑',
    //   dataIndex: 'edit',
    //   valueType: 'option',
    //   render: (_, record) => (
    //     <a
    //       onClick={() => {
    //         setEditVis(true);
    //         setReportId(record.id);
    //       }}
    //     >
    //       编辑
    //     </a>
    //   ),
    // },
    {
      title: '预览',
      dataIndex: 'view',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setViewModalVis(true);
              setReportCode(record.code);
              record.exportTye = 'pdf';
              setReportType('pdf');
              setStepFormValues(record);
            }}
          >
            PDF预览
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setViewModalVis(true);
              setReportCode(record.code);
              record.exportTye = 'excel';
              setReportType('excel');
              setStepFormValues(record);
            }}
          >
            EXCEL下载
          </a>
        </>
      ),
    },
  ];

  const handleView = fields => {
    console.log(fields);
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const { hotel_group_id, hotel_id, id } = currentUser;
    // openPostWindow(
    //   'api/report/exportReport/' +
    //     hotel_group_id +
    //     '/' +
    //     hotel_id +
    //     '/' +
    //     reportCode +
    //     '/' +
    //     currentUser.id,
    //   fields,
    // );
    openPostWindow(
      'api/report/exportReport/' +
        hotel_group_id +
        '/' +
        hotel_id +
        '/' +
        reportCode +
        '/' +
        reportType +
        '/' +
        currentUser.id,
      fields,
    );
  };

  const handleEdit = fields => {
    console.log(fields);
    saveReport(fields).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        message.info(rsp.message || '保存成功');
      }
    });
  };

  return (
    <GridContent>
      <ProTable
        headerTitle="报表模板"
        actionRef={actionRef}
        rowKey="id"
        request={params => queryReports(params)}
        columns={columns}
      />

      <ViewTemplate
        onSubmit={async value => {
          handleView(value);
          setStepFormValues({});
          setViewModalVis(false);
        }}
        onCancel={() => setViewModalVis(false)}
        modalVisible={viewModalVis}
        record={stepFormValues}
      />

      <EditView
        visible={editVis}
        reportId={reportId}
        onSubmit={value => {
          handleEdit(value);
        }}
        onCancel={() => setEditVis(false)}
      />
    </GridContent>
  );
};

export default Form.create()(TableList);
