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

  // Function to aggregate data based on selected pivot table fields
  const getAggregateData = (rows, rowsFields) => {
    const aggregateData = {};

    rows.forEach((row) => {
      // Create a unique key by combining values of selected fields
      const key = rowsFields.map(field => row[field] || 'Unknown').join(' | ');

      // Increment the count for the unique key
      if (!aggregateData[key]) {
        aggregateData[key] = 1;
      } else {
        aggregateData[key]++;
      }
    });

    return aggregateData;
  };

  // Check if any pivot fields are selected
  const pivotFields = state.rows.length ? state.rows : [];

  // Only aggregate data if fields are selected
  const aggregateData = pivotFields.length ? getAggregateData(state.data, pivotFields) : null;

  return (
    <>
      <div style={{ marginTop: '2rem' }}>
        <h2>Pivot Pie Chart</h2>
        {aggregateData && Object.keys(aggregateData).length > 0 ? (
          <Pie
            data={{
              labels: Object.keys(aggregateData),
              datasets: [
                {
                  label: 'Pivot Data',
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
                },
              ],
            }}
          />
        ) : (
          <p>Please select fields in the pivot table to generate a Pie Chart.</p>
        )}
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
