import { DataSet } from '@antv/data-set';
import { Chart, Coord, Axis, Legend, Tooltip, Label, Geom } from 'bizcharts';

const Pie = props => {
  const { DataView } = DataSet;
  let data = [];

  if (props.data) {
    data = props.data;
    // console.log(data)
  }
  const dv = new DataView();
  dv.source(data).transform({
    type: 'percent',
    field: 'count',
    dimension: 'item',
    as: 'percent',
  });
  const cols = {
    percent: {
      formatter: val => {
        val = (val * 100).toFixed(2) + '%';
        return val;
      },
    },
  };
  const chulizhi = (val) => {
    let addcount = 0
    data.forEach((ite) => {
      if (val === ite.item) {
        addcount = ite.count // val 为每个图例项的文本值
      }
    })
    // console.log(addcount)
    return val + addcount.toString()
  }
  const { subTitle, total } = props;
  // console.log(dv)
  return (
    <Chart data={dv} scale={cols} height={360}>
      {props.inner ? (
        <Coord type="theta" radius={0.75} innerRadius={0.6} />
      ) : (
        <Coord type="theta" radius={0.75} />
      )}
      <Axis name="percent" />
      <Legend position="bottom-center" itemFormatter={(val) => chulizhi(val)} />
      <Tooltip showTitle={false} />
      <Geom
        type="intervalStack"
        position="percent"
        color="item"
        tooltip={[
          'item*percent',
          (item, percent) => {
            percent = (percent * 100).toFixed(2) + '%';
            return {
              name: item,
              value: percent,
            };
          },
        ]}
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
      >
        <Label
          content="percent"
          formatter={(val, item) => {
            return item.point.item + ': ' + val;
          }}
        />
      </Geom>
    </Chart>
  );
};

export default Pie;
