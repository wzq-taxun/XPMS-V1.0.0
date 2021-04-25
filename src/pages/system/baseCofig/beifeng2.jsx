// import React from 'react';
// import { Form, Input, Select } from 'antd';
// const { Option } = Select;
// class FormLayoutDemo extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       formLayout: '',
//       codetextobj: '',
//     };
//   }
//   componentDidMount() {}
//   onBlur = e => {
//     console.log(e);
//     this.props.handeronbur(e);
//   };
//   shuoming = e => {
//     console.log(e.target.value);
//     this.props.handershuoming(e.target.value);
//   };
//   codeval = e => {
//     console.log(e.target.value);
//     this.props.handercodeval(e.target.value);
//   };
//   render() {
//     const { gochuancan } = this.props;
//     console.log(gochuancan);
//     return (
//       <div>
//         <Form layout="horizontal">
//           <Form.Item label="是否缓存" hasFeedback>
//             <Select
//               placeholder={gochuancan.is_cache === '1' ? '缓存' : '不缓存'}
//               onBlur={e => this.onBlur(e)}
//               // defaultValue={(gochuancan.is_cache === '1' ? '缓存' : '不缓存')}
//             >
//               <Option value="1">缓存</Option>
//               <Option value="0">不缓存</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item label="说明">
//             <Input
//               placeholder={gochuancan.memo}
//               onChange={e => this.shuoming(e)}
//               // defaultValue={gochuancan.memo}
//             />
//           </Form.Item>
//           <Form.Item label="值">
//             <Input
//               placeholder={gochuancan.code}
//               onChange={e => this.codeval(e)}
//               // defaultValue={}
//             />
//           </Form.Item>
//         </Form>
//       </div>
//     );
//   }
// }
// export default FormLayoutDemo;
