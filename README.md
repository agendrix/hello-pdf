# HelloPdf

HTML to PDF generator using Chrome Headless for Ruby

## Installation

Add this line to your application's Gemfile:

```ruby
gem "hello-pdf", git: "git@github.com:agendrix/hello-pdf.git"
```

And then execute:

    $ bundle

Add hello-pdf's npm package:

    $ yarn add https://github.com/agendrix/hello-pdf.git

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

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake test` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/agendrix/hello-pdf.
