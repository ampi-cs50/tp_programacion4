module JSON
  class << self
    alias_method :original_parse, :parse

    def parse(source, opts = {})
      original_parse(source, **opts)
    end
  end
end
