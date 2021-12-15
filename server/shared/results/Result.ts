import Snakelize from "./Snakelise";

abstract class Result {
  readonly toJSON = () => Snakelize(this);
}

export default Result;
