# add our curated list
module CuratedTopicQuery
  def list_curated
    on_home = TopicCustomField.where("name = 'is_on_home' AND value = 'true'")
    return list_latest unless on_home.first

    create_list(:curated, :topic_ids => on_home.pluck(:topic_id))
  end
  def list_sidebar
    in_sidebar = TopicCustomField.where("name = 'is_in_sidebar' AND value = 'true'")
    return list_latest unless in_sidebar.first

    create_list(:curated, :topic_ids => in_sidebar.pluck(:topic_id))
  end

end

module AddTopicCreatedBy
  def self.included(base)
    base.attributes :created_by
  end

  def created_by
    BasicUserSerializer.new(object.user, scope: scope, root: false)
  end

  def include_excerpt?
    pinned || object.custom_fields["is_on_home"]
  end
end

module AddFullExcerpt
  def self.included(base)
    base.attributes :full_excerpt
  end
end

module AddTopicIsOnHome
  def self.included(base)
    base.attributes :is_on_home
  end

  def is_on_home
    object.topic.custom_fields["is_on_home"] || false
  end
end

module AddTopicIsInSidebar
  def self.included(base)
    base.attributes :is_in_sidebar
  end

  def is_in_sidebar
    object.topic.custom_fields["is_in_sidebar"] || false
  end
end

module AddCustomFieldUpdater
  def custom_field
    params.require(:field)
    params.require(:value)
    field, value, topic_id = params[:field], params[:value], params[:topic_id].to_i

    @topic = Topic.find_by(id: topic_id)
    @topic.custom_fields[field] = value
    key = "custom_field_#{field}_updating"
    send(key) if respond_to? key
    @topic.save!
    render nothing: true
  end

  def custom_field_is_on_home_updating
    @topic.excerpt = @topic.ordered_posts.first.excerpt
  end

  def custom_field_is_in_sidebar_updating
    @topic.excerpt = @topic.ordered_posts.first.excerpt
  end
end

TopicViewSerializer.send(:include, AddTopicIsOnHome)
TopicViewSerializer.send(:include, AddTopicIsInSidebar)
TopicListItemSerializer.send(:include, AddTopicCreatedBy)
TopicListItemSerializer.send(:include, AddFullExcerpt)
TopicsController.send(:include, AddCustomFieldUpdater)
TopicQuery.send(:include, CuratedTopicQuery)
# Topic.send(:include, AddFullExcerpt)
# BasicTopicSerializer.send(:include, AddFullExcerpt)


Discourse::Application.routes.append do
  put "t/:slug/:topic_id/custom_field" => "topics#custom_field", constraints: {topic_id: /\d+/}
end
