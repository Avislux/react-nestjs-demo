import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string()
});
export const usersSchema = z.array(UserSchema);
export type User = z.infer<typeof UserSchema>;