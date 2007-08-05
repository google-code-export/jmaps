/* jQuery UI Menu
 * 
 * m = menu being passed in
 * o = options
 * b = trigger functions
 */

(function($){
	
	var menuItems = [];	// This is the array we will store the menu items in
	
	$.fn.clickContext = function(m,o,b) {	// Constructor for the clickContext method
		return this.each(function() {
			new $.ui.clickContext(this, m, o, b);	
		});
	}
	$.fn.hoverContext = function(m,o,b) {	// Constructor for the hoverContext method
		return this.each(function() {
			new $.ui.hoverContext(this, m, o, b);	
		});
	}
	$.fn.context = function(m,o,b) {	// Constructor for the context method
		return this.each(function() {
			new $.ui.context(this, m, o, b);	
		});
	}
	$.fn.hideContext = function(m,o,b) {	// Constructor for the hideContext method
		return this.each(function() {
			new $.ui.hideContext(this, m, o, b);	
		});
	}
	
	
	$.ui.clickContext = function(el, m, o, b) {
		var options = {}, buttons  = {};
		$.extend(options, o);
		$.extend(options, {
			timeout: 2000,
			bindto: 'click'
		});
		$.extend(buttons,b);
		$.extend(buttons, {
			_ajaxLoad: function(h, p, c, t, e) {
				self.start.apply(t, [self, e]); // Trigger the start callback
			}
		});
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;
		
		menuItems.push(m);
		console.log(menuItems);
		var x = $.ui.constructMenu(menuItems);
		console.log(x);
		//$(m).addClass('ui-toolbar-menu');
		var self = this;
		$(el).bind(options.bindto, function(){
			console.log(buttons);
			x = $(el).position();
			elBottom = x.top + $(el).height();
			elLeft = x.left;
			$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
			$(m).show('slow', function(){
				$('a#fileNewDocument').bind('click', function(e){
					console.log(this);
				});
			});
		});			
	}
	$.ui.hoverContext = function(el, m, o, b) {
		var options  = {};
		$.extend(options, o);
		$.extend(options, {
			timeout: 2000,
			bindto: 'mouseover'
		});
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;

		menuItems.push(m);
		$(m).addClass('ui-toolbar-menu');
		$(el).bind(options.bindto, function(){
			x = $(el).position();
			elBottom = x.top + $(el).height();
			elLeft = x.left;
			$(m).css({position:'absolute', top:elBottom + 1, left: elLeft})
			$(m).show('slow', function(){
				console.log('Menu Shown')
			});
		});				
	}
	$.ui.context = function(el, m, o, b) {
		var options  = {};
		$.extend(options, o);
		$.extend(options, {
			timeout: 2000,
			bindto: 'click'
		});
		var ALT = false;
		var CTRL = false;
		var SHIFT = false;

		menuItems.push(m);
		$(m).addClass('ui-toolbar-menu');
		$(el).bind(options.bindto, function(e){
			if (e.button == 0 || e.button == 2 || e.button == 3) {
				self.opos = $.ui.getPointer(e); // Get the original mouse position
				$(m).css({position:'absolute', top:self.opos[1], left:self.opos[0]})
				$(m).show('slow', function(){
					console.log('Menu Shown')
				});
			}
		});	
	}
	$.ui.hideContext = function(el, ef) {
			$(window).unbind(ef).bind(ef,function(){
				$(el).hide('fast');
			});
	}
	$.ui.constructMenu = function(el, o) {		
		var tree = el;
		$(tree).addClass('ui-tree-nodes').children('li').addClass('ui-tree-node');
		var nodes = $('ul',tree).addClass('ui-tree-nodes')
			.css('MozUserSelect', 'none').attr('unselectable', 'on');
		var node = $('li',tree).addClass('ui-tree-node')
			.css('MozUserSelect', 'none').attr('unselectable', 'on');
	}
	
	$.extend($.ui.clickContext.prototype, {
		plugins: {},
		currentTarget: null,
		lastTarget: null,
		prepareCallbackObj: function(self) {
			return {
				helper: self.helper,
				position: { left: self.pos[0], top: self.pos[1] },
				offset: self.options.cursorAt,
				menu: self	
			}			
		},
		ajaxLoad: function(that, e) {
			$(that).load(e);
			return false;
						
		}
	});
})($);