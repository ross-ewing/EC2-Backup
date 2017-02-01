var AWS = require('aws-sdk');
var config = require('./config.js').config;
var Mailer = require('./modules/mailer.js');
var _ = require('underscore');

AWS.config.accessKeyId = config.amazon.accessKey;
AWS.config.secretAccessKey = config.amazon.secretKey;
AWS.config.region = config.amazon.region;
AWS.config.email = config.amazon.email;

// For each Volume place Id into array

var awsvolumeid = _.each(volumeId, function (volumeId) {
    values = [];
    values.push(volumeId);
    return values;
});

var awsvolumeName = _.each(volumeName, function () {
    values = [];
    values.push(volumeName);
    return values;
});

//var mailer = new Mailer(config.smtp);

var emailAddress = config.smtp.email;
var sendEmailAddress = config.smtp.sendEmail;
var timestampNow = new Date().getTime();
var ec2 = new AWS.EC2();
var params = {
    DryRun: false,
    Filters: [
        {
            Name: 'volume-id',
            Values: awsvolumeid
        }
    ]
};


ec2.describeSnapshots(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            _.each(data.Snapshots, function (info) {
                if ((timestampNow - new Date(info.StartTime).getTime()) / 1000 / 60 / 60 / 24 > config.amazon.keepDay) {
                    //removeSnapshot(info.SnapshotId);
                    var deleMsg = 'Remove backup completed';
                }
            });
            createSnapshot(volumeId);
        }

        //STANDARD REMOVE MESSAGE
        deleMsg = 'Remove backup has nothing to delete';

        function removeSnapshot(id) {
            var params = {
                SnapshotId: id,
                DryRun: false
            };
            ec2.deleteSnapshot(params, function (err, data) {
                if (err) console.log(err, err.stack);// an error occurred
                else {
                    deleMsg = 'Completed Remove Backup';
                }
            });

        }

        var volNumber = 0;

        function createSnapshot(volumeId) {
            setTimeout(function () {
                var params = {
                    VolumeId: volumeId[volNumber],
                    Description: volumeName[volNumber] + new Date(),
                    DryRun: false
                };
                ec2.createSnapshot(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);// an error occurred
                    } else {
                    }
                    console.log(volumeName[volNumber - 1] + ' Backed up')
                });
                volNumber++;
                if (volNumber < volumeId.length) {
                    createSnapshot(volumeId);
                }
            }, backupint)
        }


        // send confirmation e-mail
        var compMsg = 'Backup successful for ' + awsvolumeName;
        SendToEmail(compMsg, deleMsg);

        function SendToEmail(mcomplete, mdelete) {
            //Email
            mailer.Send(
                //From
                '"backup@ec2service.com" ' + emailAddress,
                //To
                sendEmailAddress,
                //Subject
                'Backup Log',
                //Body Text
                mcomplete + "\n\xA0" + mdelete);
        }

    }
);