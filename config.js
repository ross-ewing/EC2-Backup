//CONFIG FILES

module.exports = {
    config: {
        // CREATE NEW SES USER FROM AWS
        // ADD EMAIL ADDRESS AND DOMAIN
        smtp: {
            host: 'email-smtp.eu-west-1.amazonaws.com',
            port: 465,
            secure: true, // USE SSL
            auth: {
                user: 'USERNAME',
                pass: 'PASSWORD'
            },
            email: 'FROM EMAIL ADDRESS',
            sendEmail: 'RECIPIENT ADDRESS'
        },
        // CREATE NEW IAM USER FROM AWS
        amazon: {
            secretKey: 'SECRET KEY',
            accessKey: 'ACCESS',
            region: 'eu-west-1', //CHANGE TO YOUR RELEVANT REGION
            keepDay: 3 // DAYS TO KEEP YOUR BACKUP
        }
    },
    //VOLUMES TO BE BACKED UP:
    var: volumeId = ['VOLUME-ID-1', 'VOLUME-ID-2', 'VOLUME-ID-3'],
    var: volumeName = ['ID-1-NAME, ', 'ID-2-NAME, ', 'ID-3-NAME '],
    var: backupint = 20000 //ITERATION RATE - CHANGE DEPENDING ON VOLUME SIZE TO REDUCE SCRIPT TIME.
};


