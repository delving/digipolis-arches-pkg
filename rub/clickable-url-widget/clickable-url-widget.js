define(['knockout', 'underscore', 'viewmodels/widget'], function (ko, _, WidgetViewModel) {
    /**
    * registers a text-widget component for use in forms
    * @function external:"ko.components".text-widget
    * @param {object} params
    * @param {string} params.value - the value being managed
    * @param {function} params.config - observable containing config object
    * @param {string} params.config().label - label to use alongside the text input
    * @param {string} params.config().placeholder - default text to show in the text input
    */
    return ko.components.register('clickable-url-widget', {
        viewModel: function(params) {
            params.configKeys = ['link_color'];
            WidgetViewModel.apply(this, [params]);
            
            var self = this;

            this.url_preview_text = ko.computed(function() {
                return this.value();
            }, this);

        },
        template: { require: 'text!templates/views/components/widgets/clickable-url-widget.htm' }
    });
});
