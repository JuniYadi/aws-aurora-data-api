import AWS from 'aws-sdk';
import dotnev from 'dotenv';
dotnev.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const rds = new AWS.RDSDataService({
    endpoint: `https://rds-data.${process.env.AWS_REGION}.amazonaws.com`
});

rds.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    includeResultMetadata: true,
    resourceArn: process.env.RDS_ARN || 'arn:aws:rds:ap-southeast-1:000000000000:cluster:fakedb',
    secretArn: process.env.RDS_ARN_SECRET || 'arn:aws:secretsmanager:ap-southeast-1:000000000000:secret:Secret-Fake-Data-QWERTY',
    sql: 'SELECT * FROM users'
}, (err, data) => {
    if (err) {
        console.log(err)
    }

    console.log(JSON.stringify(data))
})