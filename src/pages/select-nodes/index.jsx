import { Avatar, Card, Cascader, InputNumber, message } from 'antd';

import React from 'react';
import { retrieveOSImages } from '../../lib/osImages';
import styles from './style';

const { Meta } = Card;



const SelectNodes = () => {
    const [loading, setLoading] = React.useState(false);
    const [numOfNodes, setNumOfNodes] = React.useState(window.selectNodes ? window.selectNodes.length : 1);
    const [osList, setOsList] = React.useState([]);

    const [nodes, setNodes] = React.useState(window.selectNodes || Array.from(Array(numOfNodes)));


    React.useEffect(() => {
        setLoading(true);
        retrieveOSImages()
            .then((osImages) => {
                setOsList(osImages);
            })
            .catch(message.error)
            .finally(() => setLoading(false));
    }, []);
    React.useEffect(() => {

        let moreNodes;
        if (nodes.length > numOfNodes) {
            // deleting
            moreNodes = nodes.slice(0, numOfNodes);
        } else {
            moreNodes = nodes.concat(Array.from(Array(numOfNodes - nodes.length)));
        }
        setNodes(moreNodes);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numOfNodes]);


    React.useEffect(() => {
        window.selectNodes = nodes;
    }, [nodes]);

    return (
        <div style={styles.container}>

            <div>
                <h4>Select number of nodes</h4>
                <InputNumber min={1} value={numOfNodes} onChange={setNumOfNodes} />
            </div>

            {nodes.map((node, i) => (
                <Card style={styles.card} loading={loading} key={i}>
                    <Meta
                        avatar={
                            <Avatar src={"https://img.icons8.com/ios/452/operating-system.png"} />
                        }
                        title={`Node #${i + 1}`}
                    // description="This is the description"
                    />
                    <div style={styles.selectOS}>
                        <h3>OS</h3>
                        <Cascader options={osList} defaultValue={node ? node.os : undefined} onChange={(os) => { nodes[i] = { os, index: i + 1 }; setNodes(nodes) }} placeholder="Please select" style={styles.selectOSCascader} />
                    </div>
                </Card>
            ))}
        </div>
    );
};


export default SelectNodes;