import dotenv from "dotenv";

type EnvironmentVars = {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
};

function getEnvVar<Key extends keyof EnvironmentVars>(
  key: Key,
  defaultValue?: EnvironmentVars[Key],
): EnvironmentVars[Key] {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`La variable d'environnement ${key} n'est pas définie`);
    }
    return defaultValue;
  }
  // Conversion de la valeur en fonction du type attendu
  if (key === "PORT") {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new Error(
        `La variable d'environnement ${key} n'est pas un nombre valide`,
      );
    }
    return parsedValue as EnvironmentVars[Key];
  }
  return value as EnvironmentVars[Key];
}

dotenv.config();

export const ENV = {
  PORT: getEnvVar("PORT", 3000),
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
};
