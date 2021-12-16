import { Snakelize } from "../Utils";

abstract class Result {
  readonly toJSON = () => Snakelize(this);
}

export default Result;
