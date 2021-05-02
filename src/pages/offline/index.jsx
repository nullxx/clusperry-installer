import React from 'react';
import { WarningTwoTone } from '@ant-design/icons';
import styles from './style';

const Offline = () => (
    <div style={styles.container}>
        <article style={styles.article}>
            <WarningTwoTone style={styles.icon} twoToneColor='red' /> <h1 style={styles.title}>Internet connection lost</h1>
            <div>
                <p>Please connect to internet.</p>
            </div>
        </article>
    </div>
);

export default Offline;