module.exports = {
    apps: [
        {
            name:'index',
            script : './index.js',
            instance_var: 'INSTANCE_ID',
            instances:2,
            exec_mode : 'cluster',
            wait_ready : true,
            listen_timeout:50000,
            error_file : "./deploy/errLogs/err.log",
            out_file : "./deploy/outLogs/out.log"
        }
    ]
}