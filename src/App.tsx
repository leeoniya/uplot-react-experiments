import '/node_modules/uplot/dist/uPlot.min.css';

import React, { useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import uPlot, { AlignedData, Options } from 'uplot';

// OptsBuilder, bootstrap of plugins that set up hooks

type OptsDimless = Omit<Options, 'width' | 'height'>;

interface Props {
  width: number;
  height: number;
  opts: OptsDimless;
  data: AlignedData; // {aligned:, stacked: }
}

function UChart({ opts, width, height, data }: Props) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const plot = useRef<uPlot | null>(null);

  const diffProps = [width, height, data];

  const prevDiff = useRef(diffProps);

  useLayoutEffect(() => {
    return () => {
      console.log('u.destroy()');
      plot.current?.destroy();
      plot.current = null;
    };
  }, [opts]);

  useLayoutEffect(() => {
    const [prevWidth, prevHeight, prevData] = prevDiff.current;

    if (plot.current == null) {
      console.log('new uPlot()');
      plot.current = new uPlot({ ...opts, width, height }, data, wrap.current!);
    } else if (width != prevWidth || height != prevHeight) {
      console.log('u.setSize()');
      plot.current.setSize({ width, height });
    } else if (data != prevData) {
      console.log('u.setData()'); // prepData(), where?
      plot.current.setData(data);
    }

    prevDiff.current = diffProps;
  });

  return (
    <div className="uchart" ref={wrap} style={{ resize: 'both', overflow: 'auto' }}></div>
  );
}

function App() {
  console.log('App()');

  const [opts, setOpts] = useState<OptsDimless>({
    scales: {
      x: {
        time: false,
      },
    },
    series: [
      {},
      {
        stroke: 'red',
      },
    ],
  });

  const [data, setData] = useState<AlignedData>([
    [1, 2],
    [3, 4],
  ]);

  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(200);
  const [shouldRender, setShouldRender] = useState(true);

  useLayoutEffect(() => {
    setTimeout(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        setWidth(800);
        setHeight(400);
      });
    }, 2000);

    setTimeout(() => {
      setOpts({ ...opts, series: [{}, { stroke: 'green', width: 2 }] });
    }, 4000);

    setTimeout(() => {
      setData([
        [1, 2, 3],
        [0, 5, 0],
      ]);
    }, 6000);

    setTimeout(() => {
      setShouldRender(false);
    }, 8000);

    setTimeout(() => {
      setShouldRender(true);
    }, 10000);
  }, []);

  return (
    <div id="app">
      {shouldRender && (
        <UChart width={width} height={height} opts={opts} data={data}></UChart>
      )}
    </div>
  );
}

export default App;
