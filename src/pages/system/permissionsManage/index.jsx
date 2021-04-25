import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import {
  Table,
  Divider,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  message,
} from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { queryMenus, addMenu, updateMenu, deleteMenu } from '@/services/system/permissions';
import { useRef } from 'react';
const { Option } = Select;

const PermissionsManage = props => {
  const columns = [
    {
      title: '所属系统',
      dataIndex: 'sub_sys_type',
      key: 'sub_sys_type',
    },
    {
      title: '权限名称',
      dataIndex: 'right_name',
      key: 'right_name',
    },
    {
      title: '权限类别',
      dataIndex: 'right_type',
      key: 'right_type',
      valueEnum: {
        1: {
          text: '菜单权限',
          // status: 'Default',
        },
        2: {
          text: '操作权限',
          // status: 'Default',
        },
        3: {
          text: '按钮权限',
        },
      },
    },
    {
      title: '权限级别',
      dataIndex: 'right_level',
      key: 'right_level',
      valueEnum: {
        1: {
          text: '一级菜单',
        },
        2: {
          text: '二级菜单',
        },
      },
    },
    {
      title: '权限链接',
      dataIndex: 'right_url',
      key: 'right_url',
      hideInSearch: true,
    },
    {
      title: '权限图标',
      dataIndex: 'icon',
      key: 'icon',
      hideInSearch: true,
    },
    {
      title: '权限排序',
      dataIndex: 'sort_no',
      key: 'sort_no',
      hideInSearch: true,
    },
    {
      title: '是否校验权限',
      dataIndex: 'authed',
      key: 'authed',
      valueEnum: {
        0: {
          text: '否',
        },
        1: {
          text: '是',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      hideInSearch: true,
    },
    {
      title: '创建者',
      dataIndex: 'create_user',
      key: 'create_user',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '修改人',
      dataIndex: 'modify_user',
      key: 'modify_user',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '修改时间',
      dataIndex: 'modify_time',
      key: 'modify_time',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '操作',
      key: 'action',
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
      hideInSearch: true,
    },
  ];

  const [add, setAdd] = useState(true);
  const actionRef = useRef();

  const handleAdd = () => {
    const { form } = props;
    setAdd(true);
    form.resetFields();
    setModalVisibal(true);
  };

  const handleUpdateRow = record => {
    const { form } = props;
    const formVal = {
      rightid: record.rightid,
      sub_sys_type: record.sub_sys_type,
      right_name: record.right_name,
      right_type: record.right_type,
      right_level: record.right_level,
      right_url: record.right_url,
      icon: record.icon,
      sort_no: record.sort_no,
      authed: record.authed,
      memo: record.memo,
    };
    form.setFieldsValue(formVal);
    setAdd(false);
    setModalVisibal(true);
  };

  const handleDeleteRow = record => {
    const result = deleteMenu(record);
    result.then(function(rsp) {
      if (rsp) {
        message.success('删除成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('删除失败');
      }
    });
  };

  const handleAddOrUpdate = () => {
    const { form } = props;
    form.validateFields((err, fieldsValue) => {
      if (add) {
        const result = addMenu(fieldsValue);
        result.then(function(rsp) {
          if (rsp) {
            message.success('添加成功');
            setModalVisibal(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error('添加失败');
          }
        });
      } else {
        const result = updateMenu(fieldsValue);
        result.then(function(rsp) {
          if (rsp) {
            message.success('修改成功');
            setModalVisibal(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error('修改失败');
          }
        });
      }
    });
  };

  const {
    dispatch,
    form: { getFieldDecorator },
  } = props;

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'permissions/getMenus',
      });
    }
  }, []);

  const [modalVisibal, setModalVisibal] = useState(false);

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 16 },
    },
  };
  return (
    <GridContent>
      <div className={styles.header}>权限管理</div>

      <div className={styles.content}>
        <ProTable
          columns={columns}
          actionRef={actionRef}
          request={param => queryMenus(param)}
          rowKey="rightid"
          toolBarRender={(action, { selectedRows }) => [
            <Button icon="plus" type="primary" onClick={() => handleAdd()}>
              新建
            </Button>,
          ]}
        ></ProTable>
      </div>
      <Modal
        title="添加菜单权限"
        visible={modalVisibal}
        onCancel={() => setModalVisibal(false)}
        onOk={() => handleAddOrUpdate()}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col span={12}>
              <Form.Item label="权限ID">
                {getFieldDecorator('rightid', {
                  rules: [{ required: true, message: '请输入权限ID' }],
                })(<Input placeholder="权限ID" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="所属系统">
                {getFieldDecorator('sub_sys_type', {
                  rules: [{ required: true, message: '所属系统' }],
                })(<Input placeholder="所属系统" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="权限名称">
                {getFieldDecorator('right_name', {
                  rules: [{ required: true, message: '权限名称' }],
                })(<Input placeholder="权限名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="权限级别">
                {getFieldDecorator('right_level', { initialValue: '1' })(
                  <Select>
                    <Option value="1">一级菜单</Option>
                    <Option value="2">二级菜单</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="权限URL">
                {getFieldDecorator('right_url', {})(<Input placeholder="权限URL" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="权限图标">
                {getFieldDecorator('icon', {})(<Input placeholder="权限图标" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="权限排序">
                {getFieldDecorator('sort_no', {})(<InputNumber />)}
              </Form.Item>
              {/* </Col>
            <Col span={12}>
              <Form.Item label="父权限ID">
                {getFieldDecorator('subSysType', {
                  rules: [{ required: true, message: '权限图标' }],
                })(<Input placeholder="权限图标" />)}
              </Form.Item> */}
            </Col>
            <Col span={12}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {})(<Input placeholder="备注" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="权限类别">
                {getFieldDecorator('right_type', { initialValue: '1' })(
                  <Select>
                    <Option value="1">菜单权限</Option>
                    <Option value="2">操作权限</Option>
                    <Option value="3">按钮权限</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否认证">
                {getFieldDecorator('authed', { initialValue: '1' })(
                  <Select>
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>

          {/* <Row>
            <Col span={12}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  rules: [{ required: true, message: '备注' }],
                })(<Input placeholder="备注" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="有效标识">
                {getFieldDecorator('valid', {
                  rules: [{ required: true, message: '有效标识' }],
                })(
                  <Select>
                    <Option value="1">有效</Option>
                    <Option value="0">无效</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row> */}
        </Form>
      </Modal>
    </GridContent>
  );
};

export default Form.create()(PermissionsManage);
