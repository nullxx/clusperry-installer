import { Collapse } from 'antd';
import MonacoEditor from '@uiw/react-monacoeditor';
import React from 'react';
import cloudConfigTemplates from './cloud-config';
import ip from 'ip';
import styles from '../select-nodes/style';

const { Panel } = Collapse;

const ConfigNode = ({ node }) => {
    const [userData, setUserData] = React.useState(cloudConfigTemplates.userData.replace('<HOSTNAME>', `node-${node.index.toString().padStart(2, '0')}`));
    const [networkConfig, setNetworkConfig] = React.useState(cloudConfigTemplates.networkConfig.replace('192.168.1.100', ip.fromLong(ip.toLong('192.168.1.100')+node.index-1)));


    React.useEffect(() => {
        window.configuration = { ...window.configuration, userData };
    }, [userData]);

    React.useEffect(() => {
        window.configuration = { ...window.configuration, networkConfig };
    }, [networkConfig]);

    return (
        <div style={styles.container}>
            <div>
                <h2>cloud-config (user-data)</h2>
                <MonacoEditor
                    language="yaml"
                    value={userData}
                    onChange={(v) => setUserData(v)}
                    options={{
                        theme: 'vs-dark',
                    }}
                    height="250px"
                />
            </div>

            <div>
                <h2>cloud-config (network-config)</h2>
                <MonacoEditor
                    language="yaml"
                    value={networkConfig}
                    onChange={(v) => setNetworkConfig(v)}
                    options={{
                        theme: 'vs-dark',
                    }}
                    height="250px"
                />
            </div>
        </div>
    );
};


const ConfigNodes = ({ nodes = window.selectNodes }) => {
    return nodes.map((node, i) => (
        <Collapse bordered={false} defaultActiveKey={['0']} key={i}>
            <Panel header={`Node #${node.index}`} key={i}>
                <ConfigNode node={node} key={i} />
            </Panel>
        </Collapse>
    ))
}
export default ConfigNodes;

