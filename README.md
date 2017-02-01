# EC2-Backup

Public Version ec2-backup node script to run multiple snapshots
of Amazon Web Service EC2 Volumes and then delete them after a required period.

User only needs to update the config.js file with their relevant information and the package will work.

##How to install:

1) Clone Repo to the location you wish to install by running the below script into your terminal.

```
$ git clone https://github.com/ross-ewing/EC2-Backup.git
```
2) Run the below node package installer command.
```
npm install
```
3) Edit the config.js to your own details from aws. ( if your not sure how to obtain these details read AWS config.js details below)

##AWS config.js details

1) the SMTP auth: { user: 'USERNAME', pass: 'PASSWORD',

* First login to your amazon dashboard, we are assuming you have an account considering you're trying to backup an AWS volume.
* Navigate to the AWS SES tool and click "SMTP Settings" in the left panel
* Click "Create My SMTP Credentials"
* Type the given values into the config.js after you go through the given setup of an IAM user.

2) amazon: { secretKey: 'SECRET KEY', accessKey: 'ACCESS',

* Navigate to IAM Users and select create new user
* When given the security details take note
* Add the EC2 permissions so that the user can access the data.
* add the details to the amazon secret key and access key in the config.js file

3) You can now get your volumeID from the EC2 section of AWS and enter them into the VolumeId Array in the config.js.

(Note: that the Volume Names are in order of the volume ID's, these names can be anything)

## Add Volume 
To add more volumes simply add it to the end of the Volume Id Array in config.js

(Note: Keep in mind the "backupint" in config.js, this is the time in-between each volumes backup. If your volumes are quite large, increase this to allow AWS to finish backing up the previous volume. )


## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Credits
* AWS 
* [Ross Ewing](https://twitter.com/ross_ewing?lang=en)
* [Chris Sewell](https://twitter.com/chris_sewell?lang=en)


