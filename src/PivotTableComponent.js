import React from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import Plot from 'react-plotly.js';
import PlotlyRenderers from 'react-pivottable/PlotlyRenderers';

const PivotTableComponent = ({ data }) => {
  const [state, setState] = React.useState({
    data,
    ...PivotTableUI.defaultProps,
  });

  return (
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
  );
};

export default PivotTableComponent;
