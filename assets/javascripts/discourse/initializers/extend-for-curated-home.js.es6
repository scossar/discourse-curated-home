import TopicModel from "discourse/models/topic";
import TopicController from "discourse/controllers/topic";
import DiscoveryTopicsController from "discourse/controllers/discovery/topics";

export default {
  name: "extend-for-curated-home",

  initialize() {
    Discourse.DiscoveryCuratedRoute.reopen({
      renderTemplate() {
        this.render("navigation/default", { outlet: "navigation-bar" });
        this.render("curated-home", { controller: "discovery/topics", outlet: "list-container"});
      }
    });

    TopicModel.reopen({
      setCustomField(property, value) {
        this.set(property, value);
        return Discourse.ajax(this.get("url") + "/custom_field", {
          type: "PUT",
          data: {field: property, value: value}
        });
      },

      cleanedExcerpt: function() {
        return this.get('excerpt').replace("[image]", "");
      }.property('excerpt'),
    });

    TopicController.reopen({
      actions: {
        toggleCustomField(property) {
          let model = this.get("content");
          model.setCustomField(property, !model.get(property));
        }
      }
    });

    DiscoveryTopicsController.reopen({
      loading: function() {
        return !this.get('model.loaded');
      }.property('model.loaded'),

      loaded: function() {
        return this.get('model.loaded');
      }.property('model.loaded'),

      blogExcerpt: function() {
        return "this is a test";
      }.property()

    });
  }
}