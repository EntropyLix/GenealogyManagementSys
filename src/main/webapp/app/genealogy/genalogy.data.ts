/* eslint-disable @typescript-eslint/restrict-plus-operands */
export const GENEALOGY_SRC = {
  chart: {
    type: 'networkgraph',
    height: 700,
    scrollablePlotArea: {
      minWidth: 500,
      minHeight: 600,
      opacity: 0,
    },
  },
  exporting: {
    enabled: false,
  },
  title: null,
  credits: {
    enabled: false,
  },
  plotOptions: {
    networkgraph: {
      keys: ['from', 'to', 'properties'],
      layoutAlgorithm: {
        enableSimulation: true,
        friction: -0.96,
        linkLength: 70,
      },
      cursor: 'pointer',
      events: {},
    },
  },
  series: [
    {
      dataLabels: {
        enabled: true,
        linkTextPath: {
          attributes: {
            dy: 12,
          },
        },
        linkFormatter(): any {
          return (
            (this as any)['point']['fromNode']['id'] +
            '->' +
            (this as any)['point']['toNode']['id'] +
            '<br>' +
            (this as any)['point']['category']
          );
        },
        formatter(): any {
          return (this as any)['point']['id'] + '. ' + (this as any)['point']['properties'][1][1];
        },
      },
      marker: {
        radius: 20,
      },
      color: '#7e7676',
      data: [{ from: 'Node A', to: 'Node B' }],
    },
  ],
};

export const SORT_MAPPING = {
  id: 8,
  name: 7,
  age: 6,
  gender: 5,
  address: 4,
  birthDate: 3,
  createdBy: 2,
  createdDate: 1,
};
