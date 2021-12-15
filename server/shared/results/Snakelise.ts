const toSnakeCase = (s: string) => s.replace(/([A-Z])/g, "_$1").toLowerCase();

const isArray = (e: any) => Array.isArray(e);

const isObject = (e: any) => e === Object(e) && !isArray(e) && typeof e !== "function";

const snakelise = (e: any) => {
  if (isObject(e)) {
    const snakeCaseObject: Record<string, any> = {};

    Object.keys(e).forEach((key) => {
      snakeCaseObject[toSnakeCase(key)] = snakelise(e[key]);
    });

    return snakeCaseObject;
  } else if (isArray(e)) {
    return e.map((child: any) => snakelise(child));
  }

  return e;
};

export default snakelise;
