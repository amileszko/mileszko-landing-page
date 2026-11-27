import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { BackupPlan, BackupResource } from "aws-cdk-lib/aws-backup";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { type Construct } from "constructs";

import { CONTACT_DATA_RETENTION_DAYS } from "../constants/security";

const createContactStorage = (scope: Construct) => {
  const contactMessagesAttachmentsBucket = new Bucket(
    scope,
    "ContactMessagesAttachmentsBucket",
    {
      accessControl: BucketAccessControl.PRIVATE,
      lifecycleRules: [
        {
          abortIncompleteMultipartUploadAfter: Duration.days(1),
          expiration: Duration.days(CONTACT_DATA_RETENTION_DAYS),
          noncurrentVersionExpiration: Duration.days(30),
        },
      ],
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: true,
    },
  );

  const contactMessagesTable = new Table(
    scope,
    "ContactMessagesTable",
    {
      billingMode: BillingMode.PAY_PER_REQUEST,
      deletionProtection: true,
      partitionKey: {
        name: "Id",
        type: AttributeType.STRING,
      },
      pointInTimeRecoverySpecification: {pointInTimeRecoveryEnabled: true},
      removalPolicy: RemovalPolicy.RETAIN,
      timeToLiveAttribute: "ExpiresAt",
    },
  );

  const contactBackupPlan = BackupPlan.daily35DayRetention(
    scope,
    "ContactBackupPlan",
  );

  contactBackupPlan.addSelection(
    "ContactMessagesBackup",
    {
      allowRestores: true,
      resources: [BackupResource.fromDynamoDbTable(contactMessagesTable)],
    },
  );

  return {
    contactMessagesAttachmentsBucket,
    contactMessagesTable,
  };
};

export { createContactStorage };
