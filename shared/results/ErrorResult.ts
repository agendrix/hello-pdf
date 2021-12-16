import Result from "./Result";

class ErrorResult extends Result {
  constructor(private errorMessage: string) {
    super();
  }
}

export default ErrorResult;
