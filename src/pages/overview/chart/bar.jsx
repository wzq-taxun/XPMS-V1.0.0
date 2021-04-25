import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

const Bar = props => {
  // const data = [
  //   {
  //     category: '商务大床房',
  //     count: 70,
  //   },
  //   {
  //     category: '商务双人床',
  //     count: 69,
  //   },
  //   {
  //     category: '商务套房',
  //     count: 95,
  //   },
  //   {
  //     category: '豪华双人间',
  //     count: 145,
  //   },
  //   {
  //     category: '豪华套房',
  //     count: 184,
  //   },
  //   {
  //     category: '豪华大床房',
  //     count: 215,
  //   },
  //   {
  //     category: '特价大床房',
  //     count: 252,
  //   },
  // ];

  const data = [];
  const fields = [];

  if (props.data) {
    const zz = { name: '在住' };
    const zs = { name: '总数' };
    props.data.map(item => {
      zz[item.name] = item.al;
      zs[item.name] = item.cot;
      fields.push(item.name);
    });
    data.push(zz);
    data.push(zs);
  }

  // const data = [
  //   {
  //     name: '在住',
  //     商务大床房: 10,
  //     商务双人床: 25,
  //     商务套房: 16,
  //     豪华双人间: 15,
  //     豪华套房: 18,
  //     豪华大床房: 20,
  //     特价大床房: 33,
  //   },
  //   {
  //     name: '总数',
  //     商务大床房: 20,
  //     商务双人床: 25,
  //     商务套房: 18,
  //     豪华双人间: 17,
  //     豪华套房: 20,
  //     豪华大床房: 25,
  //     特价大床房: 35,
  //   },
  // ];
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'fold',
    fields: fields,
    // 展开字段集
    key: 'category',
    // key字段
    value: 'count', // value字段
  });
  // dv.source(data).transform({
  //   type: 'sort',

  //   callback(a, b) {
  //     // 排序依据，和原生js的排序callback一致
  //     return a.count - b.count > 0;
  //   },
  // });

  return (
    <div>
      <Chart height={360} data={dv} forceFit>
        {props.horizontal && <Coord transpose />}
        <Axis
          name="category"
          // label={{
          //   offset: 12,
          // }}
        />
        <Axis name="count" />
        <Legend />
        <Tooltip />
        <Geom
          type="interval"
          position="category*count"
          color="category"
          color={'name'}
          adjust={[
            {
              type: 'dodge',
              marginRatio: 1 / 32,
            },
          ]}
        />
      </Chart>
    </div>
  );
};

export default Bar;
