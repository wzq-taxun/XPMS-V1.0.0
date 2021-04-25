import styles from './style.less';
import { GridContent } from '@ant-design/pro-layout';
import { DatePicker, Radio, Table, Input, InputNumber, Button, Modal } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { getRoomSituation } from '@/services/rooms';
import Constants from '@/constans';
import Orders from './Orders';
import { getRoomType } from '@/services/checkIn';

const RoomSituation = props => {
  const [columns, setColumns] = useState([]);
  const [list, setList] = useState([]);
  const [day, setDay] = useState(15);

  const [roomTypeEnum, setRoomTypeEnum] = useState({});

  useEffect(() => {
    getDate();

    getRoomType().then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        const list = rsp.data || [];
        let tempRoomTypeEnum = {};
        list.map(item => {
          tempRoomTypeEnum[item.id] = { text: item.name };
        });
        setRoomTypeEnum(tempRoomTypeEnum);
      }
    });
  }, []);

  const getDate = day => {
    console.log(day);
    let params = {};
    if (day) params = { day };
    getRoomSituation(params).then(rsp => {
      if (rsp && rsp.code == Constants.SUCCESS) {
        let columnsArr = [
          {
            title: '',
            dataIndex: 'date',
            colSpan: 0,
            width: 160,
            align: 'center',
            render: (text, row, index) => {
              const obj = {
                children: text,
                props: {},
              };
              if (index < 2) {
                obj.props.colSpan = 0;
                return obj;
              }
              if ((index - 2) % 3 == 0) {
                obj.props.rowSpan = 3;
                return obj;
              } else {
                obj.props.rowSpan = 0;
                return obj;
              }
            },
          },
          {
            title: '',
            dataIndex: 'type',
            colSpan: 2,
            width: 120,
            align: 'center',
            render: (text, row, index) => {
              if (index < 2) {
                return {
                  children: text,
                  props: {
                    colSpan: 2,
                  },
                };
              }
              return text;
            },
          },
        ];

        let total = { date: '', type: '总数' };
        let inHotel = { date: '', type: '在住' };
        let list = [];

        const roomType = (rsp.data && rsp.data.roomType) || [];
        const dateList = (rsp.data && rsp.data.dateList) || [];
        roomType.map(item => {
          columnsArr.push({ title: item.name, dataIndex: item.room_type_id });
          total[item.room_type_id] = item.sunm;
          inHotel[item.room_type_id] = item.in;
        });
        setColumns(columnsArr);

        list.push(total);
        list.push(inHotel);
        dateList.map(item => {
          let obj1 = { date: item.date, type: '可售' };
          let obj2 = { date: item.date, type: '占用' };
          let obj3 = { date: item.date, type: '维修' };
          const countList = item.msg || [];
          countList.map(msg => {
            obj1[msg.room_type_id] = msg.sale + '/' + total[msg.room_type_id];
            obj2[msg.room_type_id] = msg.occupy + '/' + total[msg.room_type_id];
            obj3[msg.room_type_id] = msg.repair + '/' + total[msg.room_type_id];
          });
          list.push(obj1);
          list.push(obj2);
          list.push(obj3);
        });
        setList(list);
      }
    });
  };

  const handleRowDbClick = record => {
    setOrderDay(record.date);
    setVis(true);
  };

  const handleCancel = () => {
    setOrderDay(null);
    setVis(false);
  };

  const [vis, setVis] = useState(false);
  const [orderDay, setOrderDay] = useState(null);

  return (
    <GridContent>
      <div className={styles.header}>
        <span className={styles.title}>客房概况</span>
        <span>天数：</span>
        <InputNumber min={1} defaultValue={15} onChange={value => setDay(value)} />
        <Button type="primary" icon="search" onClick={() => getDate(day)}>
          查询
        </Button>
        {/* <DatePicker showTime style={{ width: '200px' }} format="YYYY-MM-DD" />
        <Radio value={1} style={{ marginLeft: '10px' }}>
          本日将离
        </Radio> */}
      </div>

      <Table
        className={styles.mytable}
        columns={columns}
        dataSource={list}
        rowKey="id"
        bordered
        size="small"
        pagination={false}
        scroll={{ y: 720 }}
        onRow={record => {
          return {
            onDoubleClick: event => {
              handleRowDbClick(record);
            },
          };
        }}
      />

      <Orders
        visible={vis}
        orderDay={orderDay}
        handleCancel={handleCancel}
        roomTypeEnum={roomTypeEnum}
      />
    </GridContent>
  );
};

export default RoomSituation;
