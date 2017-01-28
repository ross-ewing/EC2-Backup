var AWS = require('aws-sdk');
var config = require('./config.js').config;
var Mailer = require('./modules/mailer.js');

AWS.config.accessKeyId = config.amazon.accessKey;
AWS.config.secretAccessKey = config.amazon.secretKey;
AWS.config.region = config.amazon.region;
AWS.config.email = config.amazon.email;

var awsvolumeid = function (volumeId) {
    values = [];
    for (var i = 0; i < volumeId.length; i++) {
        values.push(volumeId[i]);
    }
    console.log(values);
    return values;
};

var awsvolumeName = function (volumeId) {
    values = [];
    for (var i = 0; i < volumeId.length; i++) {
        values.push(volumeName[i]);
    }
    return values.join('');
};

var mailer = new Mailer(config.smtp);
var emailAddress = config.smtp.email;
var sendEmailAddress = config.smtp.sendEmail;
var timestampNow = new Date().getTime();
var ec2 = new AWS.EC2();
var params = {
    DryRun: false,
    Filters: [
        {
            Name: 'volume-id',
            Values: awsvolumeid(volumeId)
        }
    ]
};


ec2.describeSnapshots(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
        for (var i = 0; i < data.Snapshots.length; i++) {
            var creation = data.Snapshots[i].StartTime;
            var createdTimestamp = new Date(creation).getTime();
            if ((timestampNow - createdTimestamp) / 1000 / 60 / 60 / 24 > config.amazon.keepDay) {
                removeSnapshot(data.Snapshots[i].SnapshotId);
                var deleMsg = 'Remove backup completed';

            }
        }
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

    var k = 0;

    function createSnapshot(volumeId) {
        setTimeout(function () {
            var params = {
                VolumeId: volumeId[k],
                Description: volumeName[k] + new Date(),
                DryRun: false
            };
            ec2.createSnapshot(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);// an error occurred
                } else {
                }
                console.log(volumeName[k - 1] + ' Backed up')
            });
            k++;
            if (k < volumeId.length) {
                createSnapshot(volumeId);
            }
        }, backupint)
    }

    // send confirmation e-mail
    var compMsg = 'Backup successful for ' + awsvolumeName(volumeId);
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

});
