require "open3"
require "tempfile"

module HelloPdf
  class Generator
    def initialize(html:, header_html: nil, footer_html: nil, options: {}, extra_args: [])
      @html = html
      @header_html = header_html
      @footer_html = footer_html
      @options = options
      @extra_args= extra_args
    end

    def pdf
      execute
      output_file
    end

    def logger
      ::HelloPdf.logger
    end

    def cleanup!
      @header_file&.close!
      @footer_file&.close!
      @html_file&.close!
      @output_file&.close!
    end

    private

    def header_file
      return nil if @header_html.nil?
      @header_file ||= create_html_tempfile(@header_html)
    end

    def footer_file
      return nil if @footer_html.nil?
      @footer_file ||= create_html_tempfile(@footer_html)
    end

    def html_file
      @html_file ||= create_html_tempfile(@html)
    end

    def output_file
      @output_file ||= Tempfile.new(["pdf", ".pdf"])
    end

    def create_html_tempfile(html)
      file = Tempfile.new(["html", ".html"])
      file.write(html)
      file.close
      file
    end

    def execute
      command = generate_command
      logger.debug "Generating pdf ..."
      logger.debug command

      sterr, stdout, status = Open3.capture3({}, command)

      if status.success?
        logger.debug "PDF generated to #{output_file.path}"
      else
        logger.error "PDF Generation failed:\n#{sterr}\n#{stdout}"
      end

      raise Error, "PDF Generation failed:\n#{sterr}\n#{stdout}" unless status.success?
      status.success?
    end

    def generate_command
      options_json = @options.transform_keys { |k| k.to_s.camelize(:lower) }.to_json
      command = ["yarn", "hello-pdf"]
      command << "-i" << html_file.path
      command << "-o" << output_file.path
      command << "-h" << header_file.path if header_file
      command << "-f" << footer_file.path if footer_file
      command << "--pdf-options" << "'#{options_json}'" unless @options.empty?
      command << "--extra-args" << "'#{@extra_args.to_json}'" unless @extra_args.empty?
      command.join(" ")
    end
  end
end
