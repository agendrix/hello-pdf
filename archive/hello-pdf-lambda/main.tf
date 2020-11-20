locals {
  function_name         = "hello-pdf"
  hello_pdf_lambda_dist = "${path.module}/lambda/target/lambda.zip"
}

resource "aws_api_gateway_rest_api" "api" {
  name               = "hello-pdf-api"
  binary_media_types = ["application/pdf"]
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  content_handling        = "CONVERT_TO_BINARY"
  uri                     = aws_lambda_function.hello_pdf_lambda.invoke_arn
}

# START Acces to root (/)

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_rest_api.api.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration_root" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_method.proxy_root.resource_id
  http_method = aws_api_gateway_method.proxy_root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  content_handling        = "CONVERT_TO_BINARY"
  uri                     = aws_lambda_function.hello_pdf_lambda.invoke_arn
}

# END Acces to root (/)

resource "aws_api_gateway_deployment" "deployment" {
   depends_on = [aws_api_gateway_integration.integration_root, aws_api_gateway_integration.integration]

   rest_api_id = aws_api_gateway_rest_api.api.id
   stage_name  = "hello-pdf"
}

resource "aws_lambda_permission" "lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.hello_pdf_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}


resource "aws_iam_role" "hello_pdf" {
  name = "${title(var.vpc_name)}RoleForHelloPdf"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.hello_pdf.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_cloudwatch_log_group" "hello_pdf" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "hello_pdf_lambda" {
  filename      = local.hello_pdf_lambda_dist
  function_name = local.function_name
  role          = aws_iam_role.hello_pdf.arn
  handler       = "index.handler"
  memory_size   = 2048
  timeout       = 60

  source_code_hash = filebase64sha256(local.hello_pdf_lambda_dist)

  runtime = "nodejs12.x"

  depends_on = [aws_iam_role_policy_attachment.lambda_logs, aws_cloudwatch_log_group.hello_pdf]
}
