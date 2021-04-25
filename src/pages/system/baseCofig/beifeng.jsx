// import React, { Component } from 'react';
// // import router from 'umi/router';
// import { getbasesall, uptadebasesall } from '@/services/basecode';
// import ProTable from '@ant-design/pro-table';
// import { Modal, message } from 'antd';
// import { GridContent } from '@ant-design/pro-layout';
// import styles from './style.less';
// // 引入表单
// import Baseform from './baseFormbiao';
// import Constants from '@/constans';

// export class newpage extends Component {
//   state = {
//     loding: true,
//     // tableListDataSource: [],
//     visible: false,
//     code: '',
//     memo: '',
//     is_cache: '',
//     id: '',
//     gochuancan: '',
//   };
//   componentDidMount() {}
//   // 修改
//   handleUpdateRow = (text, record) => {
//     console.log(record);
//     console.log(text);
//     // 将值存储
//     sessionStorage.setItem('textcodefig', JSON.stringify(text));
//     this.setState({
//       visible: true,
//       id: record,
//       gochuancan: JSON.parse(sessionStorage.getItem('textcodefig')),
//     });
//   };
//   handleOk = e => {
//     sessionStorage.removeItem('textcodefig');
//     let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
//     // console.log(currentUser);
//     if (currentUser) {
//       const { hotel_group_id, hotel_id, create_user, modify_user } = currentUser;
//       const { is_cache, code, memo, id } = this.state;
//       // console.log(code, memo, is_cache);
//       // 判断所输入的 不为空
//       let star = code.replace(/(^\s*)|(\s*$)/g, '');
//       let mstart = memo.replace(/(^\s*)|(\s*$)/g, '');
//       if (star === '' || star === undefined || star === null) {
//         message.error('不能输入为空、空格');
//         // 清空输入框的值
//         this.setState({
//           code: '',
//         });
//         return;
//       }
//       if (mstart === '' || mstart === undefined || mstart === null) {
//         message.error('不能输入为空、空格');
//         // 清空输入框的值
//         this.setState({
//           memo: '',
//         });
//         return;
//       }
//       // 发起请求更新
//       let data = {
//         code,
//         create_user,
//         description: '',
//         hotel_group_id,
//         hotel_id,
//         id,
//         is_cache,
//         modify_user,
//         memo,
//       };
//       uptadebasesall(data).then(rsp => {
//         console.log(rsp);
//         if (rsp && rsp.code == Constants.SUCCESS) {
//           message.success(rsp.message || '修改成功');
//           // 更新列表后退出模态框
//           window.location.reload();
//           // actionRef.current.reload();
//         }
//       });
//       this.setState({
//         visible: false,
//       });
//     }
//   };

//   handleCancel = e => {
//     sessionStorage.removeItem('textcodefig');
//     this.setState({
//       visible: false,
//     });
//   };
//   // 子组件像父组件传值
//   codevalhander = val => {
//     console.log(val);
//     this.setState({
//       is_cache: val,
//     });
//   };
//   handershuoming = val => {
//     console.log(val);
//     this.setState({
//       memo: val,
//     });
//   };
//   handercode = val => {
//     this.setState({
//       code: val,
//     });
//   };
//   render() {
//     // console.log(this.state.code);
//     const columns = [
//       {
//         // hideInTable: true,
//         title: '名称',
//         dataIndex: 'name',
//         key: 'name',
//       },
//       {
//         title: '描述',
//         dataIndex: 'description',
//         width: 200,
//         key: 'description',
//       },
//       {
//         title: '值',
//         key: 'code',
//         dataIndex: 'code',
//       },
//       {
//         title: '是否缓存',
//         dataIndex: 'is_cache',
//         // width: 120,
//         // hideInSearch: true,
//         valueEnum: {
//           '1': {
//             text: '缓存',
//           },
//           '0': {
//             text: '不缓存',
//           },
//         },
//       },
//       {
//         title: '是否有效',
//         dataIndex: 'valid',
//         // width: 120,
//         // hideInSearch: true,
//         valueEnum: {
//           '1': {
//             text: '有效',
//           },
//           '0': {
//             text: '无效',
//           },
//         },
//       },
//       {
//         title: '说明',
//         key: 'memo',
//         dataIndex: 'memo',
//       },
//       {
//         title: '操作',
//         valueType: 'option',
//         dataIndex: 'id',
//         render: (text, record) => {
//           return (
//             <span>
//               {/* <a onClick={e => handleRecharge(record)}>充值</a>
//               <Divider type="vertical" /> */}
//               <a onClick={e => this.handleUpdateRow(record, text)}>修改</a>
//               {/* <Divider type="vertical" />
//               <Popconfirm title="是否要停用此会员？" onConfirm={() => handleDeleteRow(record)}>
//                 <a>停用</a>
//               </Popconfirm> */}
//             </span>
//           );
//         },
//       },
//     ];
//     // const actionRef = useRef();
//     return (
//       // <Spin tip="Loading..." spinning={loding}>
//       <GridContent>
//         <>
//           <ProTable
//             // actionRef={actionRef}
//             className={styles.myTabs}
//             columns={columns}
//             rowKey="id"
//             request={params => getbasesall(params)}
//           />
//           {/* 显示对话框 */}
//           <Modal
//             title="基础配置"
//             visible={this.state.visible}
//             onOk={this.handleOk}
//             onCancel={this.handleCancel}
//           >
//             <Baseform
//               gochuancan={this.state.gochuancan}
//               handeronbur={this.codevalhander}
//               handershuoming={this.handershuoming}
//               handercodeval={this.handercode}
//             ></Baseform>
//           </Modal>
//         </>
//       </GridContent>
//       // </Spin>
//     );
//   }
// }

// export default newpage;
