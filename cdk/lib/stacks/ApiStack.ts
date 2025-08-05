import {
  DockerImage,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
} from "aws-cdk-lib";
import {
  ApiDefinition,
  BasePathMapping,
  Cors,
  DomainName,
  SpecRestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import {
  Architecture,
  AssetCode,
  Function,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import {
  ARecord,
  type IHostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { ApiGatewayDomain } from "aws-cdk-lib/aws-route53-targets";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { type Construct } from "constructs";
import fs from "node:fs";
import path from "node:path";
import { type OpenAPIObject } from "openapi3-ts/oas30";

interface ApiStackProps extends StackProps {
  apiDomainName: string
  contactEmail: string
  contactName: string
  hostedZone: IHostedZone
  notificationRecipientEmail: string
  notificationSenderEmail: string
  notificationSenderName: string
  websiteDomainName: string
}

export class ApiStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: ApiStackProps,
  ) {
    super(
      scope,
      id,
      props,
    );

    const contactMessagesAttachmentsBucket = new Bucket(
      this,
      "ContactMessagesAttachmentsBucket",
      {
        accessControl: BucketAccessControl.PRIVATE,
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    );

    const contactMessagesTable = new Table(
      this,
      "ContactMessagesTable",
      {
        billingMode: BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: "Id",
          type: AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
      },
    );

    const contactMessagesTopic = new Topic(
      this,
      "ContactMessagesTopic",
    );

    const dockerImage = DockerImage.fromBuild(
      "../",
      { file: "api/Dockerfile" },
    );

    const contactMessageHandler = new Function(
      this,
      "ContactMessageHandler",
      {
        architecture: Architecture.ARM_64,
        code: new AssetCode(dockerImage.cp("/output/contactMessageHandler/.")),
        environment: {
          DYNAMODB_TABLE_NAME: contactMessagesTable.tableName,
          S3_BUCKET_NAME: contactMessagesAttachmentsBucket.bucketName,
          SNS_TOPIC_ARN: contactMessagesTopic.topicArn,
        },
        handler: "index.handler",
        runtime: Runtime.NODEJS_20_X,
        timeout: Duration.seconds(30),
      },
    );

    const contactMessageDeliveredEmailHandler = new Function(
      this,
      "ContactMessageDeliveredEmailHandler",
      {
        architecture: Architecture.ARM_64,
        code: new AssetCode(dockerImage.cp("/output/contactMessageDeliveredEmailHandler/.")),
        environment: { SES_SENDER_EMAIL: `"${props.contactName}" <${props.contactEmail}>` },
        handler: "index.handler",
        runtime: Runtime.NODEJS_20_X,
        timeout: Duration.seconds(30),
      },
    );

    const contactMessageNotificationEmailHandler = new Function(
      this,
      "ContactMessageNotificationEmailHandler",
      {
        architecture: Architecture.ARM_64,
        code: new AssetCode(dockerImage.cp("/output/contactMessageNotificationEmailHandler/.")),
        environment: {
          S3_BUCKET_NAME: contactMessagesAttachmentsBucket.bucketName,
          SES_RECIPIENT_EMAIL: props.notificationRecipientEmail,
          SES_SENDER_EMAIL: `"${props.notificationSenderName}" <${props.notificationSenderEmail}>`,
        },
        handler: "index.handler",
        runtime: Runtime.NODEJS_20_X,
        timeout: Duration.seconds(30),
      },
    );

    contactMessagesAttachmentsBucket.grantReadWrite(contactMessageHandler);
    contactMessagesAttachmentsBucket
      .grantRead(contactMessageNotificationEmailHandler);
    contactMessagesTable.grantReadWriteData(contactMessageHandler);
    contactMessagesTopic.grantPublish(contactMessageHandler);

    const sesPolicy = new PolicyStatement({
      actions: [
        "ses:SendEmail",
        "ses:SendRawEmail",
      ],
      effect: Effect.ALLOW,
      resources: ["*"],
    });

    contactMessageDeliveredEmailHandler.addToRolePolicy(sesPolicy);
    contactMessageNotificationEmailHandler.addToRolePolicy(sesPolicy);

    contactMessagesTopic
      .addSubscription(
        new LambdaSubscription(contactMessageDeliveredEmailHandler),
      );
    contactMessagesTopic
      .addSubscription(
        new LambdaSubscription(contactMessageNotificationEmailHandler),
      );

    const apiDefinitionDirectory = dockerImage.cp("/output/api.json");

    const apiDefinition = JSON.parse(
      fs.readFileSync(
        path.join(
          apiDefinitionDirectory,
          "api.json",
        ),
        "utf8",
      ),
    ) as OpenAPIObject;

    apiDefinition["x-amazon-apigateway-binary-media-types"] = ["multipart/form-data"];

    const contactMessagesPath = apiDefinition.paths["/contact/messages"];

    if (contactMessagesPath.post) {
      contactMessagesPath.post["x-amazon-apigateway-integration"] = {
        httpMethod: "POST",
        passthroughBehavior: "when_no_templates",
        requestTemplates: {
          "multipart/form-data": `#set($allParams = $input.params())
#set($headers = $allParams.get("header"))
#set($contentType = "application/octet-stream")
#foreach($headerName in $headers.keySet())
  #if($headerName.toLowerCase() == "content-type")
    #set($contentType = $headers.get($headerName))
    #break
  #end
#end
{
  "body": "$input.body",
  "contentType": "$util.escapeJavaScript($contentType)"
}`,
        },
        responses: {
          "": {
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": `'${Cors.DEFAULT_HEADERS.join(",")}'`,
              "method.response.header.Access-Control-Allow-Methods": "'POST,OPTIONS'",
              "method.response.header.Access-Control-Allow-Origin": `'https://${props.websiteDomainName}'`,
              "method.response.header.Vary": "'Origin'",
            },
            statusCode: "200",
          },
          "Internal error.*": {
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": `'${Cors.DEFAULT_HEADERS.join(",")}'`,
              "method.response.header.Access-Control-Allow-Methods": "'POST,OPTIONS'",
              "method.response.header.Access-Control-Allow-Origin": `'https://${props.websiteDomainName}'`,
              "method.response.header.Vary": "'Origin'",
            },
            responseTemplates: {
              "application/json": `{
                "errorMessage": $input.json('$.errorMessage')
              }`,
            },
            statusCode: "500",
          },
          "Invalid input data.*": {
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": `'${Cors.DEFAULT_HEADERS.join(",")}'`,
              "method.response.header.Access-Control-Allow-Methods": "'POST,OPTIONS'",
              "method.response.header.Access-Control-Allow-Origin": `'https://${props.websiteDomainName}'`,
              "method.response.header.Vary": "'Origin'",
            },
            responseTemplates: {
              "application/json": `{
                "errorMessage": $input.json('$.errorMessage')
              }`,
            },
            statusCode: "400",
          },
        },
        type: "aws",
        uri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${contactMessageHandler.functionArn}/invocations`,
      };
    }
    else {
      throw new Error("Contact messages path not found.");
    }

    if (contactMessagesPath.options) {
      contactMessagesPath.options["x-amazon-apigateway-integration"] = {
        httpMethod: "OPTIONS",
        requestTemplates: { "application/json": "{ statusCode: 200 }" },
        responses: {
          "": {
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": `'${Cors.DEFAULT_HEADERS.join(",")}'`,
              "method.response.header.Access-Control-Allow-Methods": "'POST,OPTIONS'",
              "method.response.header.Access-Control-Allow-Origin": `'https://${props.websiteDomainName}'`,
              "method.response.header.Vary": "'Origin'",
            },
            statusCode: "204",
          },
        },
        type: "mock",
      };
    }
    else {
      throw new Error("Contact messages path options not found.");
    }

    const api = new SpecRestApi(
      this,
      "Api",
      {
        apiDefinition: ApiDefinition.fromInline(apiDefinition),
        deploy: true,
      },
    );

    contactMessageHandler.addPermission(
      "InvokeUrl",
      {
        principal: new ServicePrincipal("apigateway.amazonaws.com"),
        scope: api,
        sourceArn: api.arnForExecuteApi(
          "POST",
          "/contact/messages",
        ),
      },
    );

    const certificate = new Certificate(
      this,
      "Certificate",
      {
        domainName: props.apiDomainName,
        validation: CertificateValidation.fromDns(props.hostedZone),
      },
    );

    const apiDomain = new DomainName(
      this,
      "ApiDomainName",
      {
        certificate,
        domainName: props.apiDomainName,
      },
    );

    new BasePathMapping(
      this,
      "ApiBasePathMapping",
      {
        domainName: apiDomain,
        restApi: api,
      },
    );

    new ARecord(
      this,
      "AliasRecord",
      {
        recordName: props.apiDomainName + ".",
        target: RecordTarget.fromAlias(new ApiGatewayDomain(apiDomain)),
        zone: props.hostedZone,
      },
    );
  }
}
