module HelloPdf
  module Helpers
    module Controller
      def self.prepended(base)
        base.class_eval do
          after_action :hello_pdf_cleanup
        end
      end

      def render(options = nil, *args, &block)
        if options.is_a?(Hash) && options.key?(:pdf)
          render_pdf(options[:pdf])
        else
          super(options, *args, &block)
        end
      end

      def render_pdf(options)
        options = HelloPdf.config.to_h.deep_merge(options)
        html = render_to_string(
          formats: options[:formats],
          layout: options[:layout],
          template: options[:template]
        )

        if options[:show_as_html]
          render(
            inline: html,
            content_type: "text/html"
          )
        else
          header_html = options[:header] ? render_to_string({ formats: options[:formats] }.merge(options[:header])) : nil
          footer_html = options[:footer] ? render_to_string({ formats: options[:formats] }.merge(options[:footer])) : nil

          @_hello_pdf_generator = HelloPdf::Generator.new(
            html: html,
            header_html: header_html,
            footer_html: footer_html,
            options: options[:options]
          )

          pdf = @_hello_pdf_generator.pdf
          filename = "#{options[:name]}.pdf"
          send_data(pdf.read, filename: filename, type: "application/pdf", disposition: options[:disposition])
        end
      end

      private

      def hello_pdf_cleanup
        @_hello_pdf_generator&.cleanup!
      end
    end
  end
end
