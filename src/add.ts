import AWS from 'aws-sdk';
import { hashSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import dotnev from 'dotenv';
dotnev.config();

const rds = new AWS.RDSDataService({
    endpoint: `https://rds-data.${process.env.AWS_REGION}.amazonaws.com`
});

const hashPassword = hashSync('test1234', 10);

rds.executeStatement({
    database: process.env.RDS_DATABASE_NAME,
    includeResultMetadata: true,
    resourceArn: process.env.RDS_ARN || 'arn:aws:rds:ap-southeast-1:000000000000:cluster:fakedb',
    secretArn: process.env.RDS_ARN_SECRET || 'arn:aws:secretsmanager:ap-southeast-1:000000000000:secret:Secret-Fake-Data-QWERTY',
    sql: 'INSERT INTO users (uuid, name, email, password, role, apiToken, createdAt, updatedAt) values (:uuid, :name, :email, :password, :role, :apiToken, :createdAt, :updatedAt)',
    parameters: [
        {
            name: 'uuid',
            value: {
                stringValue: uuid()
            }
        },
        {
            name: 'name',
            value: {
                stringValue: 'john doe'
            }
        },
        {
            name: 'email',
            value: {
                stringValue: 'johndoe@test.com'
            }
        },
        {
            name: 'password',
            value: {
                stringValue: hashPassword
            }
        },
        {
            name: 'role',
            value: {
                stringValue: 'admin'
            }
        },
        {
            name: 'apiToken',
            value: {
                isNull: true
            }
        },
        {
            name: 'createdAt',
            value: {
                stringValue: '2021-04-27 19:24:00'
            }
        },
        {
            name: 'updatedAt',
            value: {
                stringValue: '2021-04-27 19:24:00'
            }
        },
    ]
}, (err, data) => {
    if (err) {
        console.log(err)
    }

    console.log(JSON.stringify(data))
})