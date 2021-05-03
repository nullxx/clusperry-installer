const steps = [
    {
        'title': 'Select nodes',
        'subTitle': 'How many nodes will your cluster have?',
        'content': require('../select-nodes').default
    },
    {
        'title': 'Config node',
        'subTitle': 'Cloud config, network...',
        'content': require('../config-nodes').default
    },
    {
        'title': 'Dowload OS images',
        'subTitle': 'Download selected OS images',
        'content': require('../download-os').default
    },
    {
        'title': 'Apply config',
        'subTitle': 'Inject config to images',
        'content': require('../inject-config').default
    },
    {
        'title': 'Export',
        'subTitle': 'Output images',
        'content': require('../export-images').default
    }
];

export default steps;