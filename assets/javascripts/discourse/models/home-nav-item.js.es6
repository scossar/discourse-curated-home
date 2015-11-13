export default Discourse.NavItem.extend({
  href: function() {
    return this.get('href');
  }.property('href')
});