import { z } from "zod";

export const makeOfferTradding = z.object({
  token_price: z
    .number()
    .min(0.01, "Token price must be greater than 0"),
  token_amount: z
    .number()
    .min(1, "Number of tokens must be at least 1") // Ensure there's at least one token
});

export type makeOfferTraddingValues = z.infer<typeof makeOfferTradding>;
