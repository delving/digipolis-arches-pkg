define(['knockout', 'viewmodels/widget'], function (ko, WidgetViewModel) {
    var name = 'urldatatype_tw';
    ko.components.register(name, {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['url_placeholder', 'link_color'];
            params.valueProperties = ['url'];
            WidgetViewModel.apply(this, [params]);

            this.url_preview_text = ko.pureComputed(function() {
                if (this.url()) {
                    if (this.url_label && this.url_label()) {
                        return this.url_label();
                    } else if (this.url && this.url()) {
                        return this.url();
                    };
                }
            }, this);
        },
        template: { require: 'text!templates/views/components/widgets/urldatatype_tw.htm' }
    });
    return name;
});
