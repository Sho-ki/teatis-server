interface boxPlan {
  EVERY1:skuPlan;
  EVERY3:skuPlan;
  EVERY6:skuPlan;
  EVERY12:skuPlan;
}
interface skuPlan{
  productId:number;
  MINI:coachOption;
  STANDARD:coachOption;
  MAX:coachOption;
}

interface coachOption {
  COACH:boxIdentifier;
  SELF:boxIdentifier;
}

interface boxIdentifier{
  merchandiseId:string;
  sellingPlanId:string;
  sku:string;
}

const sellingPlan = {
  every1: 'Z2lkOi8vc2hvcGlmeS9TZWxsaW5nUGxhbi83MjQ5OTIwNTU=',
  every3: 'Z2lkOi8vc2hvcGlmeS9TZWxsaW5nUGxhbi83MjA2MDExNDM=',
  every6: 'Z2lkOi8vc2hvcGlmeS9TZWxsaW5nUGxhbi83MjA1MzU2MDc=',
  every12: 'Z2lkOi8vc2hvcGlmeS9TZWxsaW5nUGxhbi83MjA2NjY2Nzk=',
};

export const BOX_PLANS:boxPlan =
    {
      EVERY1: {
        productId: 6758795477047,
        MINI: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyMzcwNzk1OQ==',
            sellingPlanId: sellingPlan.every1,
            sku: '1m-mini-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzE0ODI4Mzk1OQ==',
            sellingPlanId: 'Z2lkOi8vc2hvcGlmeS9TZWxsaW5nUGxhbi83MjQ5OTIwNTU=',
            sku: '1m-mini-self',
          },
        },
        STANDARD: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyMzc0MDcyNw==',
            sellingPlanId: sellingPlan.every1,
            sku: '1m-standard-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzE0ODMxNjcyNw==',
            sellingPlanId: sellingPlan.every1,
            sku: '1m-standard-self',
          },
        },
        MAX: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA3NDk2NzAyMzY3MQ==',
            sellingPlanId: sellingPlan.every1,
            sku: '1m-max-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA3NDk2NzA1NjQzOQ==',
            sellingPlanId: sellingPlan.every1,
            sku: '1m-max-self',
          },
        },
      },
      EVERY3: {
        productId: 6758796427319,
        MINI: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyNDcyMzc2Nw==',
            sellingPlanId: sellingPlan.every3,
            sku: '3m-mini-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzE1NzkxNzc1MQ==',
            sellingPlanId: sellingPlan.every3,
            sku: '3m-mini-self',
          },
        },
        STANDARD: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyNDc1NjUzNQ==',
            sellingPlanId: sellingPlan.every3,
            sku: '3m-standard-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzE1Nzk1MDUxOQ==',
            sellingPlanId: sellingPlan.every3,
            sku: '3m-standard-self',
          },
        },
        MAX: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA3NTQwNDcwNTg0Nw==',
            sellingPlanId: sellingPlan.every3,
            sku: '3m-max-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA3NTQwNDczODYxNQ==',
            sellingPlanId: sellingPlan.every3,
            sku: '3m-max-self',
          },
        },
      },
      EVERY6: {
        productId: 6758799704119,
        MINI: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyNzY0MDExOQ==',
            sellingPlanId: sellingPlan.every6,
            sku: '6m-mini-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzE2MDE3ODc0Mw==',
            sellingPlanId: sellingPlan.every6,
            sku: '6m-mini-self',
          },
        },
        STANDARD: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyNzY3Mjg4Nw==',
            sellingPlanId: sellingPlan.every6,
            sku: '6m-standard-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzE2MDIxMTUxMQ==',
            sellingPlanId: sellingPlan.every6,
            sku: '6m-standard-self',
          },
        },
        MAX: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA3NTQxMTAzMDA3MQ==',
            sellingPlanId: sellingPlan.every6,
            sku: '6m-max-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA3NTQxMTA2MjgzOQ==',
            sellingPlanId: sellingPlan.every6,
            sku: '6m-max-self',
          },
        },
      },
      EVERY12: {
        productId: 6758801506359,
        MINI: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyOTM3NjgyMw==',
            sellingPlanId: sellingPlan.every12,
            sku: '12m-mini-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzE1NDU3NTQxNQ==',
            sellingPlanId: sellingPlan.every12,
            sku: '12m-mini-self',
          },
        },
        STANDARD: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyOTQwOTU5MQ==',
            sellingPlanId: sellingPlan.every12,
            sku: '12m-standard-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA2NzEyOTQwOTU5MQ==',
            sellingPlanId: sellingPlan.every12,
            sku: '12m-standard-self',
          },
        },
        MAX: {
          COACH: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA3NTQwMDUxMTU0Mw==',
            sellingPlanId: sellingPlan.every12,
            sku: '12m-max-coach',
          },
          SELF: {
            merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MDA3NTQwMDU0NDMxMQ==',
            sellingPlanId: sellingPlan.every12,
            sku: '12m-max-self',
          },
        },
      },
    };
