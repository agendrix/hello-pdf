# HelloPdf

HTML to PDF generator using Chrome Headless for Ruby

![Tests](https://github.com/agendrix/hello-pdf/workflows/Tests/badge.svg)

## Installation

Add this line to your application's Gemfile:

```ruby
gem "hello-pdf", git: "git@github.com:agendrix/hello-pdf.git"
```

And then execute:

    $ bundle

Add hello-pdf's npm package:

    $ yarn add https://github.com/agendrix/hello-pdf.git

## Initializer

```ruby
# config/initializers/hello_pdf.rb

HelloPdf.config.layout = "layouts/pdf"

HelloPdf.config.options[:margin] = {
  top: "1cm",
  right: "1cm",
  bottom: "1.2cm",
  left: "1cm",
}

HelloPdf.config.extra_args = ["--disable-setuid-sandbox", "--no-sandbox"]

HelloPdf.config.header = {
  template: "pdf/header.pdf",
}

HelloPdf.config.footer = {
  template: "pdf/footer.pdf",
}

HelloPdf.logger = Rails.logger
```

## Usage

```ruby
render(
  pdf: {
    name: "Filename",
    template: "path/to/view.pdf"
    options: { # These options are camelized and passed to Puppeteer (https://github.com/GoogleChrome/puppeteer/blob/v1.2.0/docs/api.md#pagepdfoptions)
      margin: {
        top: "1cm"
      }
    },
    header: {
      template: "path/to/header.pdf",
      locals: {
        title: "Lorem ipsum sit dolor amet"
      }
    }
  }
)
```

### Notes

Header and footer external resources (css, images, etc.) need to be embedded directly in the html (base64 for images).
If the pdf generation hangs, it is probably due to the fact that their is some external resources in the header or the footer.

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake test` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Known issues

Currently, Puppeteer doesn't [properly handle target crashes](https://github.com/puppeteer/puppeteer/issues/1454).

This means that if errors like `out of memory` happen, the target chrome will not be closed and Puppeteer will not resolve it's promise.
To handle that, use the `timeout` option in order to kill and prevent it from hanging indefinitely.

For the memory issue, this is the result of an `Inspector.targetCrashed`:

```bash
puppeteer:protocol:RECV ◀ 
{
    "method": "Inspector.targetCrashed",
    "params": {},
    "sessionId": "B24B1E37B538487C57805BC0F4F924D0"
}
```

## Debugging

To debug Puppeteer, use the environment variable `DEBUG=*` to see all communications between Puppeteer and the Chrome instance.

You can also edit [lib/hello-pdf/generator.rb](./lib/hello-pdf/generator.rb) to use `system` instead of `Open3.capture3` in order for the logs appear in real-time instead of at the end of the execution.

```rb
# stdout, stderr, status = Open3.capture3({}, command)
success = system(command)
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/agendrix/hello-pdf.
