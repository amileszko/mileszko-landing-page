import { Stack } from "aws-cdk-lib";
import { type DockerImage } from "aws-cdk-lib";
import {
  ApiDefinition,
  BasePathMapping,
  Cors,
  DomainName,
  MethodLoggingLevel,
  SpecRestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { type Function } from "aws-cdk-lib/aws-lambda";
import {
  ARecord,
  type IHostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { ApiGatewayDomain } from "aws-cdk-lib/aws-route53-targets";
import { type Construct } from "constructs";
import fs from "node:fs";
import path from "node:path";
import { type OpenAPIObject } from "openapi3-ts/oas30";

import {
  CONTACT_API_THROTTLE_BURST_LIMIT,
  CONTACT_API_THROTTLE_RATE_LIMIT,
  HSTS_MAX_AGE_SECONDS,
} from "../constants/security";

const createContactApi = (
  scope: Construct,
  props: {
    apiDomainName: string
    contactMessageHandler: Function
    dockerImage: DockerImage
    hostedZone: IHostedZone
    websiteDomainName: string
  },
) => {
  const stack = Stack.of(scope);
  const apiDefinitionDirectory = props.dockerImage.cp("/output/api.json");
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

  const apiResponseParameters = {
    "method.response.header.Access-Control-Allow-Headers": `'${Cors.DEFAULT_HEADERS.join(",")}'`,
    "method.response.header.Access-Control-Allow-Methods": "'POST,OPTIONS'",
    "method.response.header.Access-Control-Allow-Origin": `'https://${props.websiteDomainName}'`,
    "method.response.header.Cache-Control": "'no-store'",
    "method.response.header.Permissions-Policy": "'camera=(), microphone=(), geolocation=()'",
    "method.response.header.Referrer-Policy": "'strict-origin-when-cross-origin'",
    "method.response.header.Strict-Transport-Security":
      `'max-age=${HSTS_MAX_AGE_SECONDS}'`,
    "method.response.header.Vary": "'Origin'",
    "method.response.header.X-Content-Type-Options": "'nosniff'",
    "method.response.header.X-Frame-Options": "'DENY'",
  };

  const contactMessagesPath = apiDefinition.paths["/contact/messages"];

  if (contactMessagesPath.post) {
    contactMessagesPath.post["x-amazon-apigateway-integration"] = {
      contentHandling: "CONVERT_TO_TEXT",
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
          responseParameters: apiResponseParameters,
          statusCode: "200",
        },
        "Internal error.*": {
          responseParameters: apiResponseParameters,
          responseTemplates: {
            "application/json": `{
                "errorMessage": "Internal error",
                "requestId": "$context.requestId"
              }`,
          },
          statusCode: "500",
        },
        "Invalid input data.*": {
          responseParameters: apiResponseParameters,
          responseTemplates: {
            "application/json": `{
                "errorMessage": "Invalid input data",
                "requestId": "$context.requestId"
              }`,
          },
          statusCode: "400",
        },
      },
      type: "aws",
      uri: `arn:aws:apigateway:${stack.region}:lambda:path/2015-03-31/functions/${props.contactMessageHandler.functionArn}/invocations`,
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
          responseParameters: apiResponseParameters,
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
    scope,
    "Api",
    {
      apiDefinition: ApiDefinition.fromInline(apiDefinition),
      deploy: true,
      deployOptions: {
        dataTraceEnabled: false,
        loggingLevel: MethodLoggingLevel.ERROR,
        metricsEnabled: true,
        stageName: "prod",
        throttlingBurstLimit: CONTACT_API_THROTTLE_BURST_LIMIT,
        throttlingRateLimit: CONTACT_API_THROTTLE_RATE_LIMIT,
      },
      disableExecuteApiEndpoint: true,
    },
  );

  props.contactMessageHandler.addPermission(
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
    scope,
    "Certificate",
    {
      domainName: props.apiDomainName,
      validation: CertificateValidation.fromDns(props.hostedZone),
    },
  );

  const apiDomain = new DomainName(
    scope,
    "ApiDomainName",
    {
      certificate,
      domainName: props.apiDomainName,
    },
  );

  new BasePathMapping(
    scope,
    "ApiBasePathMapping",
    {
      domainName: apiDomain,
      restApi: api,
    },
  );

  new ARecord(
    scope,
    "AliasRecord",
    {
      recordName: props.apiDomainName + ".",
      target: RecordTarget.fromAlias(new ApiGatewayDomain(apiDomain)),
      zone: props.hostedZone,
    },
  );

  return api;
};

export { createContactApi };
