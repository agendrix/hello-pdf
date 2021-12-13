require "active_support/core_ext/module/attribute_accessors"
require "active_support/logger"
require "active_support/json/encoding"
require "active_support/configurable"

module HelloPdf
  include ActiveSupport::Configurable

  config.formats = [:pdf, :html]
  config.disposition = :inline
  config.options = {
    print_background: true,
    landscape: false,
    margin: {
      top: "1cm",
      right: "1cm",
      bottom: "1cm",
      left: "1cm"
    }
  }

  cattr_accessor(:logger) { ActiveSupport::Logger.new(STDOUT) }
end

require "hello-pdf/version"
require "hello-pdf/error"
require "hello-pdf/generator"
require "hello-pdf/railtie" if defined?(::Rails::Railtie)
