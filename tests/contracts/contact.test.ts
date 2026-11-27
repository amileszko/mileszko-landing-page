import { describe, expect, it } from "vitest";

import {
  MAX_ATTACHMENTS as apiAttachments,
  MAX_ATTACHMENT_SIZE as apiAttachmentSize,
  MAX_ATTACHMENT_SIZE_MB as apiAttachmentSizeMb,
  MAX_DESCRIPTION_LENGTH as apiDescriptionLength,
  MAX_EMAIL_LENGTH as apiEmailLength,
  MAX_NDA_LENGTH as apiNdaLength,
  CONTACT_RETENTION_DAYS as apiRetentionDays,
  MAX_TOPIC_LENGTH as apiTopicLength,
} from "../../api/src/constants/contact";
import {
  CONTACT_DATA_RETENTION_DAYS as cdkRetentionDays,
} from "../../cdk/lib/constants/security";
import {
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENT_SIZE_MB,
  MAX_ATTACHMENTS,
  MAX_DESCRIPTION_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_NDA_LENGTH,
  MAX_TOPIC_LENGTH,
} from "../../website/src/constants/contact";

describe(
  "contact contract parity",
  () => {
    it(
      "keeps website and API limits aligned",
      () => {
        const pairs = [
          [
            MAX_ATTACHMENTS,
            apiAttachments,
          ],
          [
            MAX_ATTACHMENT_SIZE_MB,
            apiAttachmentSizeMb,
          ],
          [
            MAX_ATTACHMENT_SIZE,
            apiAttachmentSize,
          ],
          [
            MAX_EMAIL_LENGTH,
            apiEmailLength,
          ],
          [
            MAX_TOPIC_LENGTH,
            apiTopicLength,
          ],
          [
            MAX_DESCRIPTION_LENGTH,
            apiDescriptionLength,
          ],
          [
            MAX_NDA_LENGTH,
            apiNdaLength,
          ],
        ];

        for (const [
          websiteValue,
          apiValue,
        ] of pairs) {
          expect(websiteValue)
            .toBe(apiValue);
        }
      },
    );

    it(
      "keeps API and CDK retention aligned",
      () => {
        expect(apiRetentionDays)
          .toBe(cdkRetentionDays);
      },
    );
  },
);
