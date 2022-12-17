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
            // main block
            this.ark = ko.observable();
            this.uri= ko.observable();
            this.name = ko.observable();
            this.id = ko.observable();
            this.nameWithContext = ko.observable();

            // agent
            this.capacityName = ko.observable();
            this.hasCapacity = ko.observable();

            // archive resource
            this.resourceName = ko.observable();
            this.resourceArk = ko.observable();
            this.resourceID = ko.observable();
            this.resourceURI = ko.observable();

            // system fields
            this.suggestValue = ko.observable();
            this.suggestCapacity = ko.observable();
            this.dlodURL = ko.unwrap(this.placeholder);
            this.dlodSuggestType = ko.unwrap(this.maxLength);

            const labels = new Map([
                ["accessions", "Titel"],
                ["agent", "Naam"],
                ["archive", "Archief"],
                ["archiveobject", "Archiefonderdeel"],
                ["place", "Naam"],
                ["all", "Actors, plaatsen, en onderwerpen"],
                ["topic", "Topic"]
            ]);

            this.formattedDlodType = ko.computed(function(){
                if (this.dlodSuggestType) {
                    var label = this.dlodSuggestType;
                    var displayLabel = labels.get(label);
                    if (displayLabel  !== undefined) {
                        return displayLabel;
                    }

                    return this.dlodSuggestType.replace(/^\w/, (c) => c.toUpperCase())
                }

                return "not configured";
            }, this);

            this.isArchive = ko.computed(function() {
                return this.dlodSuggestType === "archive";
            }, this);

            this.isNoArchive = ko.computed(function() {
                return this.dlodSuggestType !== "archive";
            }, this);

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
                // main
                this.ark = ko.observable(data.ark);
                this.id = ko.observable(data.id);
                this.name = ko.observable(data.name);
                this.uri = ko.observable(data.uri);
                this.nameWithContext = ko.observable(data.nameWithContext);

                // agent capacity
                this.capacityName = ko.observable(data.capacity);
                this.hasCapacity = ko.observable(data.hasCapacity);
                if (data.capacity) {
                    this.suggestCapacity(this.value());
                }

                // archive resource
                this.resourceName = ko.observable(data.resourceName);
                this.resourceID = ko.observable(data.resourceID);
                this.resourceArk = ko.observable(data.resourceArk);
                this.resourceURI = ko.observable(data.resourceURI);
            };

            this.suggestValue.subscribe(
                function(newValue) {
                    // console.log("setting suggestValue: ", newValue, this.value())
                    if (!newValue) {
                        this.suggestCapacity(null);
                    }
                    this.value(newValue);
            }.bind(this));

            this.callURL = function(){
                return true;
            };

            this.getData = function(jsonID) {
                if (!jsonID) {
                    return {}
                }

                return JSON.parse(trimPrefix(jsonID, "dlod="))
            }

            this.filterID = ko.computed(function() {
                // if (this.isArchive()) {
                    // return this.resourceArk();
                // }
                // return this.ark();
                return "";
            }, this);

            this.suggestCapacity.subscribe(
                function(newValue) {
                    // console.log("setting suggestCapacity: ", newValue, this)
                    // console.log("setting ", this.value())
                    if (!newValue) {
                        // console.log("removing capacity: ", newValue, this.value());
                        data = this.getData(this.value());
                        data.capacity = '';
                        data.capacityID = '';
                        if (this.isArchive()){
                            data.name = '';
                            data.id = '';
                            data.uri = '';
                            data.ark = '';
                            data.nameWithContext = '';
                        }
                        var jsonData = "dlod=" + JSON.stringify(data);
                        this.value(jsonData);
                        return
                    } 
                    // console.log("suggestCapacity: ", this.isArchive(), this.resourceArk())
                    if (this.isArchive() && !this.resourceArk()) {
                        this.suggestValue(newValue);
                    } else {
                        this.value(newValue);
                    }
            }.bind(this));

            this.value.subscribe(
                function(newValue) {
                    // console.log("subscription value")
                    var data = {"id": "", "name": "", "hasCapacity": false};
                    if (newValue) {
                        data = this.getData(newValue);
                    }
                    // main
                    this.ark(data.ark);
                    this.name(data.name);
                    this.id(data.id);
                    this.uri(data.uri);
                    this.nameWithContext(data.nameWithContext);

                    // agent capacity
                    this.capacityName(data.capacity);
                    if (!data.capacity) {
                        this.suggestCapacity('');
                    }
                    this.hasCapacity(data.hasCapacity);

                    // archive resource
                    this.resourceName(data.resourceName);
                    this.resourceArk(data.resourceArk);
                    this.resourceID(data.resourceID);
                    this.resourceURI(data.resourceURI);
            }.bind(this));


            this.displayValue = ko.computed(function() {
                if (this.isArchive() && this.capacityName()) {
                    return this.resourceName() + " (" + this.capacityName() +")";
                }
                if (this.isArchive() && !this.capacityName()) {
                    return this.resourceName();
                }
                if (this.capacityName()) {
                    return this.name() + " (" + this.capacityName() +")";
                };
                return this.name();
            }, this);


            this.nameWithContextRaw = ko.computed(function(){
                if (!this.nameWithContext()) {
                    return [];
                }

                this.nameWithContext().unshift(this.resourceName());

                function addLeaders(value, index, array) {
                    return "-".repeat(index+1) + " " + value;
                } 
                return this.nameWithContext().map(addLeaders);
            }, this);

            this.agentNameWithContext = ko.computed(function(){
                if (this.nameWithContext()) {
                    return this.nameWithContext().join(", ");
                }
                return "";
            }, this);

            this.showCapacity = ko.computed(function(){
                return this.hasCapacity() || this.ark() !== ""
            }, this);

            
            // preview is the view in the overview page and sidebar
            this.preview = ko.computed(function() {
                if (this.isArchive() && this.capacityName()) {
                    return this.resourceName() + " (" + this.capacityName() +")";
                }
                if (this.capacityName()) {
                    return this.name() + " (" + this.capacityName() +")";
                };
                return this.name();
            }, this);

            // previewID returns the object (now brocade) identifier for the overview.
            // It calculates which level for archives
            this.previewID = ko.computed(function() {
                return this.id();
            }, this);

            this.previewResolveURI = ko.computed(function() {
                var target = self.dlodURL + self.uri() + '?format=redirect';
                return target;
            }, this);

            this.anetResolveURI = ko.computed(function() {
                if (this.dlodSuggestType == "accessions") {
                    return "";
                }
                var target = self.dlodURL + self.uri() + '?format=anet';
                return target;
            }, this);

            this.resolveURI = function(datatype) {
                var uri = '';
                if (datatype === 'archive' && self.isArchive()) {
                    uri = self.resourceURI();
                } else {
                    uri = self.uri();
                }
                var target = self.dlodURL + uri + '?format=redirect';
                window.open(target);
            };

            this.isAgent = ko.computed(function() {
                return this.dlodSuggestType === "agent";
            }, this);

            this.mainSearch = ko.computed(function() {
                if (this.dlodSuggestType !== "archive") {
                    return this.dlodSuggestType;
                }

                return "archiveresource";
            }, this);

            this.subSelectionSearch = ko.computed(function() {
                if (this.dlodSuggestType !== "archive") {
                    return this.dlodSuggestType;
                }

                return "archiveobject";
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
                            type: self.mainSearch
                        };
                    },
                    results: function (data, page) {
                        return {
                            results: data.results,
                            more: data.pagination.more
                        };
                    },
                    cache: true
                },
                id: function(item) {
                    return item.json;
                },
                formatResult: function(item) {
                    var label = item.name;
                    if (item.id) {
                        label += "<br/><div style=\"margin-left:40px\"> <small>identifier: " + item.id + "</small>";
                    }
                    if (item.nameWithContext) {
                        if (self.dlodSuggestType == "archive") {
                            label += ";<br/><div style=\"margin-left:40px\"><small>context2: " + item.nameWithContext.join(" > ") + "</small></div>";

                        } else {
                            label += "; <small>alternatieve namen: " + item.nameWithContext.join(", ") + "</small>";
                        }
                    }
                    if (item.id) {
                        label += "</div>"
                    }
                    // console.log("result item: ", item, self);
                    return label;
                },
                formatSelection: function(item) {
                    // console.log("selection item: ", item, self.isArchive());
                    if (self.isArchive()) {
                        return item.resourceName + ": " + item.resourceID;
                    }
                    return item.name + ": " + item.id;
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
                            type: self.subSelectionSearch,
                            filterID: self.filterID() || ""
                        };
                    },
                    results: function (data, page) {
                        return {
                            results: data.results,
                            more: data.pagination.more
                        };
                    },
                    cache: false
                },
                id: function(item) {
                    return item.json;
                },
                formatResult: function(item) {
                    var label = item.capacity;
                    label += "<br/><div style=\"margin-left:40px\"> <small>identifier: " + item.id + "</small>";
                    if (item.resourceName) {
                        if (self.dlodSuggestType == "archive") {
                            label += ";<br/><small>archiefnaam: " + item.resourceName + "</small>";
                        }
                    }
                    if (item.nameWithContext) {
                        if (self.dlodSuggestType == "archive") {
                            label += ";<br/><small>context: " + item.nameWithContext.join(" > ") + "</small>";
                        }
                    }
                    return label;
                },
                formatSelection: function(item) {
                    if (self.isArchive()) {
                        return item.capacity+ ": " + item.id;
                    }
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

            // console.log(this);
        },
        template: { require: 'text!templates/views/components/widgets/dlod-widget.htm' }
    });
});
