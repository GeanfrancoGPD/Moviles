import zod from "zod";

export default class Validator {
  constructor() {}

  async validateEmail(email) {
    const emailSchema = zod.string().email();
    return emailSchema.safeParse(email);
  }
  async validatePassword(password) {
    const passwordSchema = zod
      .string()
      .password()
      .min(8)
      .max(64)
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial");
    return passwordSchema.safeParse(password);
  }

  async validateUsername(username) {
    const usernameSchema = zod
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(30, "El nombre de usuario no puede exceder los 30 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "El nombre de usuario solo puede contener letras, números y guiones bajos"
      );
    return usernameSchema.safeParse(username);
  }

  async validateToken(token) {
    const tokenSchema = zod
      .string()
      .length(6, "El token debe tener exactamente 6 caracteres")
      .regex(
        /^[A-Z0-9]+$/,
        "El token solo puede contener letras mayúsculas y números"
      );
    return tokenSchema.safeParse(token);
  }
}
