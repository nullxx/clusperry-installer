import { Card, Spin, message } from 'antd';

import { CheckCircleTwoTone } from '@ant-design/icons';
import React from 'react';
import _ from 'lodash';
import styles from './style';

;
const fs = window.require('fs');
const { ipcRenderer } = window.require('electron');

const InjectConfig = ({ data, setData, canContinue, canGoBack }) => {
    // const { userData, networkConfig } = ;
    const [wroteFiles, setWroteFiles] = React.useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        (async () => {
            for (const configNode of data.configNodes) {
                const configNodeImgUrl = configNode.node.os[configNode.node.os.length - 1];
                const { targetFilePath } = data.decompressing.find(d => d.url === configNodeImgUrl);
                if (!targetFilePath) return message.error('ERR_IMAGE_NOT_DOWNLOADED');
                const originalFileName = targetFilePath.split('/').pop();
                const destinationFileName = `node-${configNode.node.index}.${originalFileName.split('.').pop().padStart(2, '0')}`;
                const destinationPath = targetFilePath.replace(originalFileName, destinationFileName);
                console.log(originalFileName, destinationFileName, destinationPath);

                await copyFile({ sourcePath: targetFilePath, destinationPath })
                console.log("Copied", destinationPath);
                // const arr = preparedFiles;
                // arr.push({ destinationPath, configNode });
                // setPreparedFiles(_.clone(arr));
                const { drive: { mountpoints } } = await ipcRenderer.invoke('openImage', destinationPath);
                console.log('mountpoints', mountpoints)
                if (!mountpoints || mountpoints.length === 0) continue;

                const { userData, networkConfig } = configNode;

                const { path, label } = mountpoints[0];

                await writeFiles({ networkConfig, userData, path, label });
                console.log("Wrote files", destinationPath);

                await ipcRenderer.invoke('ejectImage', path);
                console.log("Eject image", path);

                const arr = wroteFiles;
                arr.push({ destinationPath });
                setWroteFiles(_.clone(arr));
            }
        })();
        canGoBack(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const obj = data;
        obj.injectConfig = wroteFiles;

        setData(obj);
        canContinue(data.configNodes.length === wroteFiles.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wroteFiles])

    const copyFile = ({ sourcePath, destinationPath }) => {
        return new Promise((res, rej) => {
            fs.copyFile(sourcePath, destinationPath, (err) => {
                if (err) rej(err);
                res();
            });
        });
    }
    const writeFiles = ({ userData, networkConfig, path, label }) => {
        return new Promise((res, rej) => {
            fs.writeFile(window.require('path').join(path, '/user-data',), userData, 'utf8', function (err, data) {
                if (err) {
                    return rej(err);
                }

                fs.writeFile(window.require('path').join(path, '/network-config',), networkConfig, 'utf8', function (err, data) {
                    if (err) {
                        return rej(err);
                    }
                    res();
                });
            });
        })
    }


    return (
        <>
            <div style={styles.container}>
                {data.configNodes.map((preparedFile, i) => (
                    <Card style={styles.injectingList} key={i}>
                        <p>Node #{preparedFile.node.index}</p>
                        {wroteFiles[i] ? <><CheckCircleTwoTone /><p>Success</p></> : <><Spin /><p>Mounting and writing files...</p></>}
                    </Card>
                ))}
            </div>
        </>
    );
}

export default InjectConfig;