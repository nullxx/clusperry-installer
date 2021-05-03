import { Button, Steps } from 'antd';
import { LeftCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons';

import React from 'react';
import steps from './steps';
import styles from './style.js';

const { Step } = Steps;
const { ipcRenderer } = window.require('electron');

const App = () => {
  const [current, setCurrent] = React.useState(0);
  const [nextDisabled, setNextDisabled] = React.useState(false);
  const [backDisabled, setBackDisabled] = React.useState(false);
  const [data, setData] = React.useState({});

  const next = async () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const StepContent = steps[current].content;
  return (
    <div style={styles.container}>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} subTitle={item.subTitle} />
        ))}
      </Steps>
      <div
        style={styles.stepContent}
      >
        <StepContent canContinue={(c) => setNextDisabled(!c)} canGoBack={(c) => setBackDisabled(!c)} data={data} setData={setData} />
      </div>
      <div style={styles.stickyFooter}>
      {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()} disabled={backDisabled}>
            <LeftCircleTwoTone />
            Previous
          </Button>
        )}

        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()} disabled={nextDisabled}>
            Next
            <RightCircleTwoTone />
          </Button>
        )}

        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => ipcRenderer.send('quit')}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
};


export default App;