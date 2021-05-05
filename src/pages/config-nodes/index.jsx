import { Collapse } from 'antd';
import MonacoEditor from '@uiw/react-monacoeditor';
import React from 'react';
import cloudConfigTemplates from './cloud-config';
import ip from 'ip';
import styles from '../select-nodes/style';

const { Panel } = Collapse;

const ConfigNode = ({ node, data, setData, canContinue }) => {
    const [userData, setUserData] = React.useState(cloudConfigTemplates.userData.replace('<HOSTNAME>', `node-${node.index.toString().padStart(2, '0')}`));
    const [networkConfig, setNetworkConfig] = React.useState(cloudConfigTemplates.networkConfig.replace('192.168.1.100', ip.fromLong(ip.toLong('192.168.1.100')+node.index-1)));


    React.useEffect(() => {
        if (!Array.isArray(data.configNodes)) {
            data.configNodes = [];
        }

        data.configNodes[node.index-1] = { ...data.configNodes[node.index-1], userData, node };
        setData(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    React.useEffect(() => {

        if (!Array.isArray(data.configNodes)) {
            data.configNodes = [];
        }

        data.configNodes[node.index-1] = { ...data.configNodes[node.index-1], networkConfig, node };
        setData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [networkConfig]);


    React.useEffect(() => {
       canContinue(data.configNodes && data.configNodes.filter(cn => typeof cn !== 'undefined').length === data.selectNodes.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [networkConfig, userData]);

    return (
        <div style={styles.container}>
            <div>
                <h2>cloud-config (user-data)</h2>
                <MonacoEditor
                    language="yaml"
                    onChange={(v) => setUserData(v)}
                    options={{
                        theme: 'vs-dark',
                        value: userData
                    }}
                    height="250px"
                />
            </div>

            <div>
                <h2>cloud-config (network-config)</h2>
                <MonacoEditor
                    language="yaml"
                    
                    onChange={(v) => setNetworkConfig(v)}
                    options={{
                        theme: 'vs-dark',
                        value: networkConfig
                    }}
                    height="250px"
                />
            </div>
        </div>
    );
};


const ConfigNodes = ({ data, setData, canContinue }) => {
    const nodes = data.selectNodes;

    return nodes.map((node, i) => (
        <Collapse bordered={false} defaultActiveKey={['0']} key={i}>
            <Panel header={`Node #${node.index}`} key={i}>
                <ConfigNode node={node} key={i} data={data} setData={setData} canContinue={canContinue}/>
            </Panel>
        </Collapse>
    ))
}
export default ConfigNodes;
