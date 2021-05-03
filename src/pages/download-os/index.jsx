import { Button, Progress, Spin, Tag, message } from 'antd';
import { CheckCircleTwoTone, FolderOpenTwoTone } from '@ant-design/icons';

import React from 'react';
import styles from './style';

const fs = window.require("fs");
const xz = window.require("xz");
const { shell } = window.require('electron');
const Downloader = window.require('nodejs-file-downloader');
const path = window.require('path');
const os = window.require('os');

const DownloadOS = ({ canContinue, data, setData }) => {
    const [uniqueOSURLs, setUniqueOSURLs] = React.useState([]);
    const [uniqueOSNames, setUniqueOSNames] = React.useState([]);
    const [percentajes, setPercentajes] = React.useState([]);
    const [decompressing, setDecompressing] = React.useState([]);
    const [failed, setFailed] = React.useState([]);
    const [errors, setErrors] = React.useState([]);

    React.useEffect(() => {
        setData({ ...data, decompressing });
        canContinue(decompressing.map(d => typeof d !== 'undefined').length === uniqueOSURLs.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decompressing, uniqueOSURLs.length]);
    const createDownload = async (download, filePath, i) => {
        try {
            failed[i] = undefined;
            errors[i] = undefined;
            setFailed(Object.create(failed));
            setErrors(Object.create(errors));

            await download.download();

            console.log("File downloaded at", filePath);

            const targetFilePath = filePath.split('.').slice(0, -1).join('.');
            const compressor = new xz.Decompressor({ preset: 9, bufferSize: 1 });
            const input = fs.createReadStream(filePath);
            const output = fs.createWriteStream(targetFilePath);


            compressor.on('finish', () => {
                console.log('Finished uncompression', i, targetFilePath);
                decompressing[i] = { targetFilePath, url: download.config.url };
                setDecompressing(Object.create(decompressing));
            });

            compressor.on('error', (err) => {
                console.error(err);
                message.error(err.message);
            });

            input.pipe(compressor).pipe(output);

        } catch (error) {
            console.error(error);
            message.error(error.message || error);

            failed[i] = download;
            errors[i] = error;

            setFailed(Object.create(failed));
            setErrors(Object.create(errors));
        }
    }

    React.useEffect(() => {
        const processinguniqueOSURLs = [];
        const processingUniqueOSNames = [];

        data.selectNodes.forEach((node) => {
            const dlURL = node.os[node.os.length - 1];
            if (processinguniqueOSURLs.indexOf(dlURL) === -1) {
                processinguniqueOSURLs.push(dlURL);
                processingUniqueOSNames.push(node.os.slice(0, -1).join(' > '));
            }
        });

        processinguniqueOSURLs.forEach(async (dlURL, i) => {
            const fileName = dlURL.split('/').pop();
            const directory = os.tmpdir();
            const download = new Downloader({
                url: dlURL,
                directory,
                fileName,
                cloneFiles: false,
                onProgress: function (percentage, chunk, remainingSize) {
                    percentajes[i] = percentage;
                    setPercentajes(Object.create(percentajes));
                }
            });

            await createDownload(download, path.join(directory, "/", fileName), i);
        });

        setUniqueOSURLs(processinguniqueOSURLs);
        setUniqueOSNames(processingUniqueOSNames);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div style={styles.container}>
            {uniqueOSURLs.map((osURL, i) => (
                <div key={i}>
                    <h3>{failed[i] ? 'Failed' : 'Downloading'} <Tag color="magenta">{uniqueOSNames[i]}</Tag><sub>{errors[i] && errors[i].message}</sub></h3><p>{osURL}</p>
                    {failed[i] && <Button onClick={async () => await createDownload(failed[i], path.join(failed[i].config.directory, "/", failed[i].config.fileName), i)}>Retry</Button>}
                    <Progress
                        key={i}
                        strokeColor={{
                            from: '#108ee9',
                            to: '#87d068',
                        }}
                        percent={percentajes[i]}
                        status={parseFloat(percentajes[i]) !== 100.0 ? (!failed[i] ? 'active' : 'exception') : 'success'}
                    />
                    {parseFloat(percentajes[i]) === 100 && (
                        <div style={styles.decompress}>
                            {!decompressing[i] ? <Spin /> : <CheckCircleTwoTone />}
                            <div style={styles.separatorRow} />
                            <p>{!decompressing[i] ? 'Decompressing...' : 'Decompresion completed'}</p>
                            <div style={styles.separatorRow} />
                            {decompressing[i] && <Button icon={<FolderOpenTwoTone />} size='small' onClick={() => shell.showItemInFolder(path.resolve(decompressing[i].targetFilePath))} />}
                        </div>
                    )}
                </div>
            ))}

        </div>
    )
}

export default DownloadOS;
