import { Duration, RemovalPolicy } from "aws-cdk-lib";
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
        },
      ],
      removalPolicy: RemovalPolicy.RETAIN,
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
      removalPolicy: RemovalPolicy.RETAIN,
      timeToLiveAttribute: "ExpiresAt",
    },
  );

  return {
    contactMessagesAttachmentsBucket,
    contactMessagesTable,
  };
};

export { createContactStorage };
