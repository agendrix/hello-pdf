lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "hello-pdf/version"

Gem::Specification.new do |s|
  s.name          = "hello-pdf"
  s.version       = HelloPdf::VERSION
  s.authors       = ["Charles Vallières"]
  s.email         = ["charles@agendrix.com"]

  s.summary       = "HTML to PDF generator using Chrome Headless for Ruby"
  s.description   = "HTML to PDF generator using Chrome Headless for Ruby"
  s.homepage      = "https://github.com/agendrix/hello-pdf"

  s.require_paths = ["lib"]
  s.files         = Dir["README.md", "lib/**/*", "package/**/*"]

  s.bindir        = "exe"
  s.executables   = s.files.grep(%r{^exe/}) { |f| File.basename(f) }

  s.add_dependency "activesupport", ">= 4.2"

  s.add_development_dependency "bundler", "~> 1.16"
  s.add_development_dependency "rake", "~> 10.0"
  s.add_development_dependency "minitest", "~> 5.0"
end
