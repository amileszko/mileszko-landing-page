import { Duration, RemovalPolicy, type StackProps } from "aws-cdk-lib";
import { DockerImage, Stack } from "aws-cdk-lib";
import {
  CertificateValidation,
  DnsValidatedCertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  Function as CloudFrontFunction,
  Distribution,
  FunctionCode,
  FunctionEventType,
  HeadersFrameOption,
  HeadersReferrerPolicy,
  OriginAccessIdentity,
  PriceClass,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  ARecord,
  type IHostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { type Construct } from "constructs";
import path from "node:path";

import { HSTS_MAX_AGE_SECONDS } from "../constants/security";

interface WebsiteStackProps extends StackProps {
  apiDomainName: string
  googleTagManagerId: string
  hostedZone: IHostedZone
  websiteDomainName: string
}

class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(
      scope,
      id,
      {
        ...props,
        terminationProtection: true,
      },
    );

    const wwwWebsiteDomainName = `www.${props.websiteDomainName}`;

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const certificate = new DnsValidatedCertificate(
      this,
      "Certificate",
      {
        domainName: props.websiteDomainName,
        hostedZone: props.hostedZone,
        region: "us-east-1",
        subjectAlternativeNames: [wwwWebsiteDomainName],
        validation: CertificateValidation.fromDns(props.hostedZone),
      },
    );

    const deployBucket = new Bucket(
      this,
      "DeployBucket",
      {
        accessControl: BucketAccessControl.PRIVATE,
        lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(30) }],
        removalPolicy: RemovalPolicy.RETAIN,
        versioned: true,
      },
    );

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity",
    );

    deployBucket.addToResourcePolicy(new PolicyStatement({
      actions: ["s3:GetObject"],
      effect: Effect.ALLOW,
      principals: [originAccessIdentity.grantPrincipal],
      resources: [
        deployBucket.bucketArn,
        `${deployBucket.bucketArn}/*`,
      ],
    }));

    const viewerRequestFunction = new CloudFrontFunction(
      this,
      "ViewerRequestFunction",
      {
        code: FunctionCode.fromFile({
          filePath: path.join(
            __dirname,
            "..",
            "functions",
            "url-normalization-function.js",
          ),
        }),
      },
    );

    const cacheHeadersFunction = new CloudFrontFunction(
      this,
      "CacheHeadersFunction",
      {
        code: FunctionCode.fromFile({
          filePath: path.join(
            __dirname,
            "..",
            "functions",
            "cache-headers-function.js",
          ),
        }),
      },
    );

    const cspReportOnly = [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com",
      "font-src 'self'",
      `connect-src 'self' https://${props.apiDomainName} https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com`,
      "frame-src https://www.googletagmanager.com",
      "upgrade-insecure-requests",
    ].join("; ");

    const responseHeadersPolicy = new ResponseHeadersPolicy(
      this,
      "ResponseHeadersPolicy",
      {
        customHeadersBehavior: {
          customHeaders: [
            {
              header: "Content-Security-Policy-Report-Only",
              override: true,
              value: cspReportOnly,
            },
            {
              header: "Permissions-Policy",
              override: true,
              value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
            },
          ],
        },
        securityHeadersBehavior: {
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            override: true,
            referrerPolicy:
              HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          },
          strictTransportSecurity: {
            accessControlMaxAge: Duration.seconds(HSTS_MAX_AGE_SECONDS),
            includeSubdomains: true,
            override: true,
            preload: false,
          },
        },
      },
    );

    const distribution = new Distribution(
      this,
      "Distribution",
      {
        certificate: certificate,
        defaultBehavior: {
          functionAssociations: [
            {
              eventType: FunctionEventType.VIEWER_REQUEST,
              function: viewerRequestFunction,
            },
            {
              eventType: FunctionEventType.VIEWER_RESPONSE,
              function: cacheHeadersFunction,
            },
          ],
          origin: S3BucketOrigin.withOriginAccessIdentity(
            deployBucket,
            { originAccessIdentity },
          ),
          responseHeadersPolicy: responseHeadersPolicy,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        domainNames: [
          props.websiteDomainName,
          wwwWebsiteDomainName,
        ],
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 404,
            responsePagePath: "/404.html",
          },
          {
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: "/404.html",
          },
        ],
        priceClass: PriceClass.PRICE_CLASS_100,
      },
    );

    new ARecord(
      this,
      "AliasRecord",
      {
        recordName: props.websiteDomainName + ".",
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        zone: props.hostedZone,
      },
    );

    new ARecord(
      this,
      "WwwAliasRecord",
      {
        recordName: wwwWebsiteDomainName + ".",
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        zone: props.hostedZone,
      },
    );

    new BucketDeployment(
      this,
      "BucketDeployment",
      {
        destinationBucket: deployBucket,
        distribution: distribution,
        distributionPaths: ["/*"],
        sources: [
          Source.asset(
            "../",
            {
              bundling: {
                command: [
                  "sh",
                  "-c",
                  "cp -r /output/* /asset-output",
                ],
                image: DockerImage.fromBuild(
                  "../",
                  {
                    buildArgs: {
                      API_URL: `https://${props.apiDomainName}`,
                      GOOGLE_TAG_MANAGER_ID: props.googleTagManagerId,
                      HOST_NAME: `https://${props.websiteDomainName}`,
                    },
                    file: "website/Dockerfile",
                  },
                ),
              },
            },
          ),
        ],
      },
    );
  }
}

export { WebsiteStack };

