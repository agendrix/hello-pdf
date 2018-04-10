require "hello-pdf/helpers"
require "hello-pdf/helpers/controller"

module HelloPdf
  class Railtie < ::Rails::Railtie
    initializer "helllo_pdf.initializer" do
      ActiveSupport.on_load(:action_controller) do
        prepend(::HelloPdf::Helpers::Controller)
      end
    end
  end

  if Mime::Type.lookup_by_extension(:pdf).nil?
    Mime::Type.register("application/pdf", :pdf)
  end
end
