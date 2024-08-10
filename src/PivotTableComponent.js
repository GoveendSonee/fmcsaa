import React from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import Plot from 'react-plotly.js';
import PlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PivotTableComponent = ({ data }) => {
  const [state, setState] = React.useState({
    data,
    ...PivotTableUI.defaultProps,
  });

  const aggregateData = data.reduce((acc, row) => {
    const type = row.entity_type || 'Unknown'; 
    acc[type] = (acc[type] || 0) + 1; 
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(aggregateData),
    datasets: [
      {
        label: 'Entity Types',
        data: Object.values(aggregateData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
          'rgba(255, 159, 255, 0.7)',
          'rgba(255, 99, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 159, 255, 1)',
          'rgba(255, 99, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div style={{ marginTop: '2rem' }}>
        <h2>Pie Chart</h2>
        <Pie data={pieData} />
      </div>
      <div>
        <PivotTableUI
          data={state.data}
          onChange={(s) => setState(s)}
          renderers={{ ...PlotlyRenderers }}
          {...state}
        />
        {state.plotlyChart && (
          <Plot
            data={state.plotlyChart.data}
            layout={state.plotlyChart.layout}
            config={state.plotlyChart.config}
          />
        )}
        
      </div>
    </>
  );
};

export default PivotTableComponent;
