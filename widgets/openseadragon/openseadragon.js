define(['knockout', 'underscore', 'viewmodels/widget', 'templates/views/components/widgets/openseadragon.htm'],
    function (ko, _, WidgetViewModel, openSeadragonTemplate) {

    const initialize = function (element, valueAccessor, allBindings) {
        var modelValue = valueAccessor();
        var value = ko.utils.unwrapObservable(valueAccessor());

        // Create an OpenSeadragon viewer
        /*const viewer = new OpenSeadragon({
            element,
            prefixUrl: '/static/node_modules/openseadragon/build/openseadragon/images/',
            prefixUrl: '/static/node_modules/openseadragon/build/openseadragon/images/',
            tileSources: value
        });*/
        const viewer = new Tify({
            container: element,
            manifestUrl: value
        });
    };

    ko.bindingHandlers.openseadragon = {
        init: (element, valueAccessor, allBindings) => {
            // openseadragon/build/openseadragon/openseadragon
            require(['tify/dist/tify'], Tify => {
                initialize(element, valueAccessor, allBindings, Tify);
            });
        }
    };

    /**
    * registers an OpenSeadragon component for use in forms
    * @function external:"ko.components".openseadragon-widget
    * @param {object} params
    * @param {string} params.value - the value being managed
    * @param {function} params.config - observable containing config object
    * @param {string} params.config().label - label to use alongside the viewer
    * @param {string} params.config().defaultValue - default image to show in the viewer
    */
    return ko.components.register('openseadragon', {
        viewModel: function (params) {
            params.configKeys = ['defaultValue'];
            WidgetViewModel.apply(this, [params]);

            const config = this.config();
            if (typeof this.value === 'function' && this.value()) {
                // In a form (or card editor?)
                this.currentImage = ko.observable(this.value());
            } else if (typeof this.value === 'object' && typeof this.value.url === 'function' && this.value.url()) {
                // In a report (or resource form?)
                this.currentImage = ko.observable(this.value.url());
            } else {
                this.currentImage = ko.observable(config.defaultValue);
            };

            this.currentImage.subscribe(newValue => {
                if (typeof this.value === 'function') {
                    this.value(newValue);
                } else if (typeof this.value === 'object' && typeof this.value.url === 'function') {
                    this.value.url(newValue);
                }
            });
        },
        template: openSeadragonTemplate
    });
});