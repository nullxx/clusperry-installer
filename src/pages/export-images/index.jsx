import { Button, Card } from 'antd';

import { FolderOpenTwoTone } from '@ant-design/icons';
import React from 'react';
import styles from './style';

const { shell } = window.require('electron');
const path = window.require('path');

const ExportImages = ({ data, setData, canGoBack }) => {
  React.useEffect(() => {
    canGoBack(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}>
      {data.injectConfig.map(((ic, i) => (
        <Card key={i} style={styles.open}>
          {ic.destinationPath && <><p>{ic.destinationPath}</p><Button icon={<FolderOpenTwoTone />} size='small' onClick={() => shell.showItemInFolder(path.resolve(ic.destinationPath))} /></>}
        </Card>
      )))}

    </div>
  );
}

export default ExportImages;