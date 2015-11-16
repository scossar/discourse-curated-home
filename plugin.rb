# name: discourse-curated-home
# about: shows a curated home in a different style
# version: 0.1
# authors: Benjamin Kampmann

enabled_site_setting :curated_home_enabled

register_asset "curated_home_style.scss"
register_asset "javascripts/curated-dialect.js", :server_side

after_initialize do

  Topic.class_eval do
    require_dependency 'nokogiri'

    def full_excerpt
      post = posts.first.cooked
      doc = Nokogiri::HTML(post)
      excerpt = doc.css('.curated-excerpt').children
      excerpt ? excerpt.to_s : post
    end
  end

  require_dependency File.expand_path('../integrate.rb', __FILE__)
end


# Odd, but we have to register first, otherwise routes won't pick it up
Discourse.filters << "curated"

# Allow anonymous access
Discourse.anonymous_filters << "curated"
