﻿define(["jquery", "originalmarionette", "core/utils", "modelBinder", "backbone"], function($, Marionette, Utils, ModelBinder, Backbone) {

    $.support.cors = true;

    Marionette.Renderer.render = function (template, data, context) {
         return $.render[template](data, data, context);
    };

    Marionette.Region.prototype.open = function (view) {

        this.$el.hide();
        this.$el.html(view.el);
        
        if (view.model != null) {
            view.modelBinder = new Backbone.ModelBinder();
            var bindings = ModelBinder.createDefaultBindings(view.el, 'name');
            view.modelBinder.bind(view.model, view.el, bindings);
        }

        this.$el.fadeIn("slow");
    };
    
    Marionette.Region.prototype.open = function (view) {

        this.$el.hide();
        this.$el.html(view.el);
        
        if (view.model != null) {
            view.modelBinder = new Backbone.ModelBinder();
            var bindings = ModelBinder.createDefaultBindings(view.el, 'name');
            view.modelBinder.bind(view.model, view.el, bindings);
        }

        this.$el.fadeIn("slow");
    };

    Backbone.Model.prototype.copyAttributesToEntity = function(entity) {

        function copyAttributes(e, m) {
            for (var p in m.attributes) {
                var attr = m.attributes[p];

                if (attr != null) {
                    if (attr.attributes != null) {
                        if (e[p] == null)
                            e[p] = new attr.Entity();

                        copyAttributes(e[p], attr);
                    } else {
                        e[p] = attr;
                    }
                }
            }
        }

        copyAttributes(entity, this);
    };
    
 
    Backbone.Marionette.MultiRegion = Backbone.Marionette.Region.extend({
        currentView: [],

        open: function (view) {
            this.ensureEl();
            this.$el.append(view.el);
        },

        close: function (views) {
            if (typeof views === "object") {
                views = [views];
            }
            else if (!views || !_.isArray(views)) {
                views = this.currentView;
            }

            _.each(views, this._closeView, this);

            this._removeViews(views);
            Marionette.triggerMethod.call(this, "close", views);

            return this;
        },

        show: function (views) {
            if (typeof views === "object") {
                views = [views];
            }
            else if (!views || !_.isArray(views)) {
                this.renderAll();
                return this;
            }

            _.each(views, this._showView, this);

            this._addViews(views);
            Marionette.triggerMethod.call(this, "show", views);

            return this;
        },

        _closeView: function (view) {
            if (view.close) {
                view.close();
            }
            else {
                // If it doesn't have a `close` method, at least remove them from the DOM with Backbone.View's `remove`
                view.remove();
            }

            Marionette.triggerMethod.call(this, "close", view);
        },

        _showView: function (view) {
            view.render();
            this.open(view);

            Marionette.triggerMethod.call(view, "show");
            Marionette.triggerMethod.call(this, "show", view);
        },

        _removeViews: function (views) {
            this.currentView = _.difference(this.currentView, views);
        },

        _addViews: function (views) {
            _.union(this.currentView, views);
        },

        attachView: function (view) {
            this.open(view);
            this.currentView.push(view);

            return this;
        },

        renderAll: function () {
            _.each(this.currentView, function (view) {
                view.render();
            });

            return this;
        }
    });
    
    return Marionette;
});