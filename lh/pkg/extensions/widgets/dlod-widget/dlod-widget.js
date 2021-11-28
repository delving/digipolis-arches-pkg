define([
    'knockout',
    'underscore',
    'viewmodels/widget',
    'plugins/knockout-select2'

], function (ko, _, WidgetViewModel) {
    /**
    * registers a text-widget component for use in forms
    * @function external:"ko.components".text-widget
    * @param {object} params
    * @param {string} params.value - the value being managed
    * @param {function} params.config - observable containing config object
    * @param {string} params.config().label - label to use alongside the text input
    * @param {string} params.config().placeholder - default text to show in the text input
    */
    return ko.components.register('dlod-widget', {
        viewModel: function(params) {
            params.configKeys = ['dlod_datatype'];
            WidgetViewModel.apply(this, [params]);
            var self = this;
            this.ark = ko.observable();
            this.name = ko.observable();
            this.suggestValue = ko.observable();

            if (this.value()) {
                    this.suggestValue = this.value;
                    var data = JSON.parse(this.value());
                    this.ark = ko.observable(data.id);
                    this.name = ko.observable(data.name);
            };

            this.suggestValue.subscribe(
                function(newValue) {
                    this.value(newValue);
            }.bind(this));

            this.value.subscribe(
                function(newValue) {
                    var data = JSON.parse(newValue);
                    if (!data) {
                        data = {"id": "", "name": ""};
                    };
                    this.ark(data.id);
                    this.name(data.name);
            }.bind(this));


            this.displayValue = ko.computed(function() {
                return this.name();
            }, this);


            this.preview = ko.computed(function() {
                return "name: "+this.name();
            }, this);

            this.select2Config = {
                clickBubble: true,
                disabled: false,
                minimumInputLength: 1,
                // data: this.options,
                value: this.suggestValue,
                multiple: false,
                placeholder: 'select one',
                allowClear: true,
                // clear: function(){
                    // this.suggestValue('');
                // },
                ajax: {
                    url: "https://hub3.mpm.delving.io/api/suggest",
                    dataType: 'json',
                    delay: 250,
                    data: function (term, page) {
                        return {
                            query: term, // search term
                            page: page
                        };
                    },
                    results: function (data) {
                        // parse the results into the format expected by Select2
                        // since we are using custom formatting functions we do not need to
                        // alter the remote JSON data, except to indicate that infinite
                        // scrolling can be used
                        // params.page = params.page || 1;

                        return {
                            results: data.results,
                            pagination: {
                                more: false
                            }
                        };
                    },
                    cache: true
                },
                id: function(item) {
                    return item.json;
                },
                formatResult: function(item) {
                    return item.text;
                },
                formatSelection: function(item) {
                    return item.text;
                },
                // TODO: implement me
                initSelection: function() {
                    return;
                }
            };
    
            console.log(this);
        },
        template: { require: 'text!templates/views/components/widgets/dlod-widget.htm' }
    });
});
