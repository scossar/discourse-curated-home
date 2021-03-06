# add our curated list
module CuratedTopicQuery
  def list_curated
    on_home = TopicCustomField.where("name = 'is_on_home' AND value = 'true'")
    return list_latest unless on_home.first

    create_list(:curated, :topic_ids => on_home.pluck(:topic_id))
  end
end

module AddTopicCreatedBy
  def self.included(base)
    base.attributes :created_by
  end

  def created_by
    BasicUserSerializer.new(object.user, scope: scope, root: false)
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

module AddCustomFieldUpdater
  def custom_field
    params.require(:field)
    params.require(:value)
    field, value, topic_id = params[:field], params[:value], params[:topic_id].to_i
    @topic = Topic.find_by(id: topic_id)
    @topic.custom_fields[field] = value
    @topic.save!
    render nothing: true
  end
end

TopicViewSerializer.send(:include, AddTopicIsOnHome)
TopicListItemSerializer.send(:include, AddTopicCreatedBy)
TopicListItemSerializer.send(:include, AddFullExcerpt)
TopicsController.send(:include, AddCustomFieldUpdater)
TopicQuery.send(:include, CuratedTopicQuery)

Discourse::Application.routes.append do
  put "t/:slug/:topic_id/custom_field" => "topics#custom_field", constraints: {topic_id: /\d+/}
end
