// Product form option constants shared across product creation and editing

export const shippingOptions = [
  {
    value: "0xe30101711220b084c1990cbc0098c8fd1e45e6f2456949c21d38804785cf2c7a61097be970b1",
    label: "Free Shipping",
  },
  {
    value: "0xe301017112202de1ddbbdf1095f615292f9ff9407beafcf088f411994441c50eb6eb41e73f9c",
    label: "Fixed Shipping",
  },
  {
    value: "0xe301017112208f28543c4fc21710ae92f18b5b595b349f4b3282db5096b736fd1ff5de6af0c4",
    label: "Calculated Shipping",
  },
] as const;

export const returnWindowOptions = [
  {
    value: "0xe3010171122051796f8b1ec20da96986dc779fbbd0d411c426e1ef0d599ee434a121853accdd",
    label: "30 Days",
  },
  {
    value: "0xe301017112207694586ce03f16119936583e1fc140ae82352084749d333bee0b4e330017a81f",
    label: "60 Days",
  },
  {
    value: "0xe301017112201758017ba4108afcaa3c8805ed28564dad36522e69d354d2e24b7d358ecb8236",
    label: "No Returns",
  },
] as const;

export const returnPolicyOptions = [
  {
    value: "0xe3010171122086e642780ffc2dbeba05807e51e7852a00b322c621c3ef208ab9b3b0167f9ff2",
    label: "Seller pays return shipping",
  },
  {
    value: "0xe30101711220266fd578013881e406fbd9003575937f0089cb81142cbcf64d5532cc96ee6700",
    label: "Buyer pays return shipping",
  },
] as const;

// Helper functions to find labels by values
export const getShippingLabel = (value: string) =>
  shippingOptions.find(option => option.value === value)?.label || "Not set";

export const getReturnWindowLabel = (value: string) =>
  returnWindowOptions.find(option => option.value === value)?.label || "Not set";

export const getReturnPolicyLabel = (value: string) =>
  returnPolicyOptions.find(option => option.value === value)?.label || "Not set";