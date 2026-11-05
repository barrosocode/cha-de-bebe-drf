import { z } from "zod";

const phoneSchema = z.string().refine((value) => value === "" || /^\(\d{2}\) \d \d{4}-\d{4}$/.test(value), {
  message: "Use o formato (99) 9 9999-9999",
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Informe o usuário"),
  password: z.string().min(1, "Informe a senha"),
  remember: z.boolean(),
});

export const guestSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome").max(255, "O nome pode ter no máximo 255 caracteres"),
  age: z.enum(["adult", "kid"], { required_error: "Selecione a idade" }),
  category: z.enum(["family", "friend", "church"], { required_error: "Selecione a categoria" }),
  phone: phoneSchema,
  invite: z.string().uuid("Selecione um convite"),
});

export const inviteSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do convite").max(255, "O nome pode ter no máximo 255 caracteres"),
});

export const giftSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do presente").max(100, "O nome pode ter no máximo 100 caracteres"),
  description: z.string().max(5000, "A descrição está longa demais"),
  link: z.string().trim().url("Informe um link válido").max(200, "O link pode ter no máximo 200 caracteres"),
  limit: z.coerce
    .number({ invalid_type_error: "Informe um número inteiro" })
    .int("O limite deve ser um número inteiro")
    .positive("O limite deve ser maior que zero"),
  tag_names: z.array(z.string().trim().min(1).max(100)).default([]),
});

export const inviteCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6}$/, "O código tem 6 letras ou números");

export type LoginValues = z.infer<typeof loginSchema>;
export type GuestValues = z.infer<typeof guestSchema>;
export type InviteValues = z.infer<typeof inviteSchema>;
export type GiftValues = z.infer<typeof giftSchema>;
