import { camelCase } from "lodash";

const IsArray = (e: any) => Array.isArray(e);

const IsObject = (e: any) => e === Object(e) && !IsArray(e) && typeof e !== "function";

const ToSnakeCase = (s: string) => s.replace(/([A-Z])/g, "_$1").toLowerCase();

const Snakelize = (e: any) => {
  if (IsObject(e)) {
    const snakeCaseObject: Record<string, any> = {};

    Object.keys(e).forEach((key) => {
      snakeCaseObject[ToSnakeCase(key)] = Snakelize(e[key]);
    });

    return snakeCaseObject;
  } else if (IsArray(e)) {
    return e.map((child: any) => Snakelize(child));
  }

  return e;
};

const Camelize = (e: any) => {
  if (IsObject(e)) {
    const snakeCaseObject: Record<string, any> = {};

    Object.keys(e).forEach((key) => {
      snakeCaseObject[camelCase(key)] = Camelize(e[key]);
    });

    return snakeCaseObject;
  } else if (IsArray(e)) {
    return e.map((child: any) => Camelize(child));
  }

  return e;
};

export { Snakelize, Camelize };
