const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 });

/** A number of tokens as it is read: "21.4K", "200K". */
export const formatTokens = (tokens: number) => compact.format(tokens);

/** A share of the window: "29%". */
export const formatShare = (share: number) => percent.format(share);
