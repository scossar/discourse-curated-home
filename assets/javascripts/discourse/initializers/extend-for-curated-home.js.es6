import TopicModel from "discourse/models/topic";
import TopicController from "discourse/controllers/topic";
import DiscoveryTopicsController from "discourse/controllers/discovery/topics";
import NavItemModel from 'discourse/models/nav-item';
import HomeNavItem from 'discourse/plugins/discourse-curated-home/discourse/models/home-nav-item';
import NavigationDefaultController from 'discourse/controllers/navigation/default';
import NavigationCategoryController from 'discourse/controllers/navigation/category';
import NavigationCategoriesController from 'discourse/controllers/navigation/categories';

export default {
  name: "extend-for-curated-home",

  initialize() {
    Discourse.DiscoveryCuratedRoute.reopen({
      renderTemplate() {
        this.render("navigation/default", { outlet: "navigation-bar" });
        this.render("curated-home", { controller: "discovery/topics", outlet: "list-container"});
      }
    });

    NavItemModel.reopen({
      homeNavItem: function() {
        return this.get('name') === 'home';
      }.property('name'),
    });

    NavItemModel.reopenClass({
      buildList: function(category, args) {
        let list = this._super(category, args);
        list = list.filter(i => i.get("name") !== "curated");
        //list.unshift(HomeNavItem.create({href: '/', name: "home"}));
        return list;
      },
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
        return "this is a test";
      }.property('views'),

      createdAt: function() {
        return new Date(this.get('created_at')).toLocaleDateString();
      }.property('created_at'),
    });

    TopicController.reopen({
      actions: {
        toggleCustomField(property) {
          let model = this.get("content");
          model.setCustomField(property, !model.get(property));
        }
      },

    });

    DiscoveryTopicsController.reopen({
      loading: function() {
        return !this.get('model.loaded');
      }.property('model.loaded'),

      loaded: function() {
        return this.get('model.loaded');
      }.property('model.loaded'),
    });

    // Try to get a plugin outlet added to `discovery.hbs` before the navigation bar to clean this up
    NavigationDefaultController.reopen({
      homeNavLinkContent: function() {
        return HomeNavItem.create({href: '/', name: "home"});
      }.property(),
    });

    NavigationCategoryController.reopen({
      homeNavLinkContent: function() {
        return HomeNavItem.create({href: '/', name: "home"});
      }.property(),
    });

    NavigationCategoriesController.reopen({
      homeNavLinkContent: function() {
        return HomeNavItem.create({href: '/', name: "home"});
      }.property(),
    });
  }
}