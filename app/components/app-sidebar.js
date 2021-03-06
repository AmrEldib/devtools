import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';


export default Ember.Component.extend( KeyboardShortcuts,{
  classNames: ['sidebar'],
  search: '',

  didInsertElement(){
    var ul = this.$('.side-nav');
    var top = ul.offset().top - Ember.$(document).scrollTop();
    ul.outerHeight(this.$().parent().height() - top);
    Ember.run.later(this, this.didInsertElement, 500);
  },

  isValid(route){
    var isExceptionalRoute = ['error', 'index', 'loading', 'application'].contains(route);
    var isSubstate = route.endsWith('_error') || route.endsWith('_loading');
    var includeSearch = route.toLowerCase().includes(this.get('search').toLowerCase());
    return !(isExceptionalRoute || isSubstate) && includeSearch;
  },

  routes: function(){
    var routes = this.container.lookup('router:main').router.recognizer.names;
    var keys = Object.keys(routes);
    var objects = [];
    for(var i=0; i<keys.length; i++){
      if( this.isValid(keys[i]) ){
        objects.push({
          label: keys[i],
          route: keys[i]
        });
      }
    }
    return objects.sortBy('label');
  }.property('search'),


  // keyboard accessibility
  selectedIndex: 0,
  selectedRoute: function(){
    return this.get('routes')[this.get('selectedIndex')];
  }.property('selectedIndex', 'routes'),

  // rest selected index if the search query changed
  selectedRouteReseter: function(){
    this.set('selectedIndex', 0);
  }.observes('routes'),

  actions: {
    keyboardUp: function(){
      if(this.get('selectedIndex')===0){return;}
      this.decrementProperty('selectedIndex');
    },

    keyboardDown: function(){
      if(this.get('selectedIndex')>=this.get('routes').length-1){return;}
      this.incrementProperty('selectedIndex');
    },

    keyboardEnter: function(){
      this.container.lookup('router:main').router.transitionTo(this.get('selectedRoute').route);
    }
  },

  keyboardShortcuts: {
    'up': {
      action: 'keyboardUp',
      scoped: true
    },
    'down': {
      action: 'keyboardDown',
      scoped: true
    },
    'enter': {
      action: 'keyboardEnter',
      scoped: true
    }
  }

});
