import z from 'zod';

export const SubscriptionSchema = z.object({
  name: z.string().nullable(),
  userId: z.string(),
  communityId: z.string(),
});
