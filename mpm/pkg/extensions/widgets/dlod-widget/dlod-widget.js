define([
    'knockout',
    'underscore',
    'viewmodels/widget',
    'select2'
    // 'plugins/knockout-select2'

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
            // console.log("creating viewmodel");
            // console.log('params: ', params);
            params.configKeys = ['placeholder', 'width', 'maxLength', 'defaultValue', 'uneditable'];


            WidgetViewModel.apply(this, [params]);
            var self = this;
            this.ark = ko.observable();
            this.name = ko.observable();
            this.hasCapacity = ko.observable();
            this.brocadeID = ko.observable();
            this.suggestValue = ko.observable();
            this.capacityName = ko.observable();
            this.archivesSpaceID = ko.observable();
            this.removedCapacity = false;
            this.suggestCapacity = ko.observable();
            this.dlodURL = ko.unwrap(this.placeholder);
            this.dlodSuggestType = ko.unwrap(this.maxLength);

            function trimPrefix(str, prefix) {
                if (str.startsWith(prefix)) {
                    return str.slice(prefix.length)
                } else {
                    return str
                }
            }

            if (this.value()) {
                // console.log("setting default values on startup")
                this.suggestValue(this.value());
                var data = JSON.parse(trimPrefix(this.value(), "dlod="));
                this.ark = ko.observable(data.id);
                this.brocadeID = ko.observable(data.brocadeID);
                this.name = ko.observable(data.name);
                this.capacityName = ko.observable(data.capacity);
                this.hasCapacity = ko.observable(data.hasCapacity);
                this.archivesSpaceID = ko.observable(data.archivesSpaceID);

                if (data.capacity) {
                    this.suggestCapacity(this.value());
                }

            };

            this.suggestValue.subscribe(
                function(newValue) {
                    // console.log("setting suggestValue: ", newValue, this.value())
                    if (!newValue) {
                        this.suggestCapacity(null);
                    }
                    this.value(newValue);
            }.bind(this));

            this.getData = function(jsonID) {
                if (!jsonID) {
                    return {}
                }

                return JSON.parse(trimPrefix(jsonID, "dlod="))
            }

            this.suggestCapacity.subscribe(
                function(newValue) {
                    // console.log("setting suggestCapacity: ", newValue, this)
                    // console.log("setting ", this.value())
                    if (!newValue) {
                        // console.log("removing capacity: ", newValue, this.value());
                        data = this.getData(this.value());
                        data.capacity = '';
                        data.capacityID = '';
                        var jsonData = "dlod=" + JSON.stringify(data);
                        this.value(jsonData)
                        return
                    } 
                    this.value(newValue);
            }.bind(this));

            this.value.subscribe(
                function(newValue) {
                    // console.log("subscription value")
                    var data = {"id": "", "name": "", "hasCapacity": false};
                    if (newValue) {
                        data = this.getData(newValue);
                    }
                    this.ark(data.id);
                    this.name(data.name);
                    this.capacityName(data.capacity);
                    if (!data.capacity) {
                        this.suggestCapacity('');
                    }
                    this.brocadeID(data.brocadeID);
                    this.archivesSpaceID(data.archivesSpaceID);
                    this.hasCapacity(data.hasCapacity);
            }.bind(this));


            this.displayValue = ko.computed(function() {
                if (this.capacityName()) {
                    return this.name() + " (" + this.capacityName() +")";
                };
                return this.name();
            }, this);

            this.showCapacity = ko.computed(function(){
                return this.hasCapacity() || this.ark() !== ""
            }, this);


            this.preview = ko.computed(function() {
                if (this.capacityName()) {
                    return this.name() + " (" + this.capacityName() +")";
                };
                return this.name();
            }, this);


            this.resolveURI = ko.computed(function() {
                return this.dlodURL + this.archivesSpaceID();
            }, this);

            this.isAgent = ko.computed(function() {
                return this.dlodSuggestType === "agent";
            }, this);

            this.select2Config = {
                clickBubble: true,
                disabled: false,
                minimumInputLength: 0,
                value: self.suggestValue,
                multiple: false,
                placeholder: 'select one',
                allowClear: true,
                ajax: {
                    url: this.dlodURL + "/api/suggest",
                    dataType: 'json',
                    delay: 250,
                    data: function (term, page) {
                        return {
                            query: term, // search term
                            page: page || 1,
                            type: self.dlodSuggestType
                        };
                    },
                    results: function (data) {
                        return {
                            results: data.results,
                            pagination: data.pagination
                        };
                    },
                    cache: true
                },
                id: function(item) {
                    return item.json;
                },
                formatResult: function(item) {
                    // console.log("result item: ", item, self);
                    return item.name + "<br/><div style=\"margin-left:40px\" <small>identifier: " + item.brocadeID + "</small>";
                },
                formatSelection: function(item) {
                    // console.log("selection item: ", item);
                    return item.name + ": " + item.brocadeID;
                },
                initSelection: function(element, callback) {
                    // console.log("initSeloction agent: ", element);
                    if (element[0].value !== '') {
                        for (const [key, value] of Object.entries(element[0])) { 
                            if(key && key.indexOf('jQuery') >= 0 && typeof value['select2'] == 'object'){
                                // console.log('setting default agent');
                                var data = self.getData(element[0].value)
                                value.select2.updateSelection(data);
                            }
                        }
                    }
                    return;
                }
            };


            this.select2capacity = {
                clickBubble: true,
                disabled: false,
                minimumInputLength: 0,
                value: this.suggestCapacity,
                multiple: false,
                placeholder: 'select one',
                allowClear: true,
                ajax: {
                    url: this.dlodURL + "/api/suggest",
                    dataType: 'json',
                    delay: 250,
                    data: function (term, page) {
                        return {
                            query: term, // search term
                            page: page || 1,
                            type: self.dlodSuggestType,
                            filterID: self.ark() || ""
                        };
                    },
                    results: function (data) {
                        return {
                            results: data.results,
                            pagination: data.pagination
                        };
                    },
                    cache: false
                },
                id: function(item) {
                    return item.json;
                },
                formatResult: function(item) {
                        return item.capacity;
                },
                formatSelection: function(item) {
                    return item.capacity;
                },
                initSelection: function(element, callback) {
                    // console.log("initSelection capacity: ", element);
                    if (element[0].value !== '') {
                        for (const [key, value] of Object.entries(element[0])) { 
                            if(key && key.indexOf('jQuery') >= 0 && typeof value['select2'] == 'object'){
                                var data = self.getData(element[0].value)
                                // console.log('setting default capacity');
                                value.select2.updateSelection(data);
                            }
                        }
                    }
                    return;
                }
            };

            console.log(this);
        },
        template: { require: 'text!templates/views/components/widgets/dlod-widget.htm' }
    });
});
