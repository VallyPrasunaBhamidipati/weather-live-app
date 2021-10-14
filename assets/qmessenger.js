//Hello
var qMessenger = (function () {
    return {

        // Setters
        setIsDebbuging(debug) { this.isDebbuging = debug; },
        setCardContainerId(id) { this.cardContainerId = id; },
        setSymbolsURL(url) { this.symbolsURL = url; },
        setCsrfToken(token) { this.csrfToken = token; },
        setVoteURL(url) { this.voteURL = url; },
        setMessages(mess) { this.messages = mess; },

        // Getters
        getIsDebbuging() { return this.isDebbuging; },
        getCardContainerId() { return this.cardContainerId; },
        getSymbolsURL() { return this.symbolsURL; },
        getCsrfToken() { return this.csrfToken; },
        getVoteURL() { return this.voteURL; },
        getMessages() { return this.messages; },


        messengerLog(functionName, content, isError) {
            if (this.isDebbuging) {
                if (isError) {
                    console.log("%c" + "Q-Messenger ERROR :: " + functionName + " :: " + content, "color: #ff0000;" );
                } else {
                    console.log("Q-Messenger Log :: " + functionName + " :: " + content);
                }
            }
        },


        setTheIconValues() {
            this.messengerLog("setTheIconValues", "Function call", false);
            try {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", this.symbolsURL);
                xhr.onload = () => {
                    if (xhr.status != 200) {
                        this.messengerLog("setTheIconValues", "Error getting svg icons", true);
                    } else {
                        this.messengerLog("setTheIconValues", "Parsing returned XML for icons", false );
                        var elemDiv = document.createElement("svg");
                        elemDiv.innerHTML = xhr.response;
                        document.getElementById("quip-element-root").prepend(elemDiv);
                        //document.body.insertBefore(elemDiv, document.body.firstChild);
                        this.messengerLog("setTheIconValues", "Icon values set", false);
                    }
                };
                xhr.send();
            } catch (ex) {
                this.messengerLog("setTheIconValues", "Error getting svg icons: " + ex, true);
            }
        },


        displayAlertMessage(message) {
            if (!message.persistent && message.localStorage.dismissed) {
                return;
            }

            this.messengerLog("displayAlertMessage", "Function call", false);
            var theme = this.getStyleClassFromTheme(message.theme);
            var html =
                '<div id="alert_message" class="qmessenger">' +
                '<div class="slds-notify slds-notify_alert ' + theme + '" role="alert">' +
                '<div class="">' +
                '<h2 class="slds-text-body_regular slds-truncate"><strong>' + message.title + '</strong></h2>' +
                '<div class="slds-text-body_small is-markdown">' + message.body + '</div>' +
                "</div>" +
                '<div class="slds-notify__close">' +
                '<div class="slds-button-group" role="group">' +
                '<button id="alert_like_button" class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled upvote_button" title="This was helpful" aria-pressed="false">' +
                '<svg class="slds-button__icon" aria-hidden="true">' +
                '<use xlink:href="#like">' +
                "</use>" +
                "</svg>" +
                '<span class="slds-assistive-text">Helpful</span>' +
                "</button>" +
                '<button id="alert_dislike_button" class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled downvote_button" title="This was useless" aria-pressed="false">' +
                '<svg class="slds-button__icon" aria-hidden="true">' +
                '<use xlink:href="#dislike">' +
                "</use>" +
                "</svg>" +
                '<span class="slds-assistive-text">Useless</span>' +
                "</button>" +
                "</div>" +
                '<button id="alert_close_button" class="slds-button slds-button_icon slds-button_icon-small slds-button_icon-inverse" title="Close">' +
                '<svg class="slds-button__icon" aria-hidden="true">' +
                '<use xlink:href="#close">' +
                "</use>" +
                "</svg>" +
                '<span class="slds-assistive-text">Close</span>' +
                "</button>" +
                "</div>" +
                "</div>" +
                "</div>";

            var elemDiv = document.createElement("div");
            elemDiv.innerHTML = html;
            document.getElementById("quip-element-root").prepend(elemDiv);
            //document.body.insertBefore(elemDiv, document.body.firstChild);

            if (message.localStorage.like) { document.getElementById("alert_like_button").classList.add("slds-is-selected"); }
            if (message.localStorage.dislike) { document.getElementById("alert_dislike_button").classList.add("slds-is-selected"); }

            var self = this;
            document.getElementById("alert_close_button").addEventListener("click", function () {
                self.messengerLog("displayAlertMessage", "Close alert", false);
                document.getElementById("alert_message").style.display = "none";
                self.messages.alert_message.localStorage.dismissed = true;
                const record = quip.apps.getRootRecord();
                record.set('qmessenger', { ['qmessenger_' + self.messages.alert_message.uuid]: JSON.stringify(self.messages.alert_message.localStorage)});
                //window.localStorage.setItem('qmessenger_' + self.messages.alert_message.uuid, JSON.stringify(self.messages.alert_message.localStorage));
            }, false );

            document.getElementById("alert_like_button").addEventListener("click", function () {
                self.messengerLog("displayAlertMessage", "Like alert", false);
                self.messages.alert_message.localStorage.dislike = false;
                self.messages.alert_message.localStorage.like = !self.messages.alert_message.localStorage.like;
                if (self.messages.alert_message.localStorage.like) {
                    document.getElementById("alert_like_button").classList.add("slds-is-selected");
                    document.getElementById("alert_dislike_button").classList.remove("slds-is-selected");
                    self.voteForMessage(self.messages.alert_message.like_token);
                } else {
                    document.getElementById("alert_like_button").classList.remove("slds-is-selected");
                    document.getElementById("alert_dislike_button").classList.remove("slds-is-selected");
                }
                const record = quip.apps.getRootRecord();
                record.set('qmessenger', { ['qmessenger_' + self.messages.alert_message.uuid]: JSON.stringify(self.messages.alert_message.localStorage)});
                //window.localStorage.setItem('qmessenger_' + self.messages.alert_message.uuid, JSON.stringify(self.messages.alert_message.localStorage));
            },false);

            document.getElementById("alert_dislike_button").addEventListener("click", function () {
                self.messengerLog("displayAlertMessage", "Dislike alert", false);
                self.messages.alert_message.localStorage.like = false;
                self.messages.alert_message.localStorage.dislike = !self.messages.alert_message.localStorage.dislike;
                if (self.messages.alert_message.localStorage.dislike) {
                    document.getElementById("alert_like_button").classList.remove("slds-is-selected");
                    document.getElementById("alert_dislike_button").classList.add("slds-is-selected");
                    self.voteForMessage(self.messages.alert_message.dislike_token);
                } else {
                    document.getElementById("alert_like_button").classList.remove("slds-is-selected");
                    document.getElementById("alert_dislike_button").classList.remove("slds-is-selected");
                }
                const record = quip.apps.getRootRecord();
                record.set('qmessenger', { ['qmessenger_' + self.messages.alert_message.uuid]: JSON.stringify(self.messages.alert_message.localStorage)});
                //window.localStorage.setItem('qmessenger_' + self.messages.alert_message.uuid, JSON.stringify(self.messages.alert_message.localStorage));
            }, false);

        },


        displayPromptMessage(message) {
            if (!message.persistent && message.localStorage.dismissed) {
                return;
            }

            var checkboxStr = '';
            if (!message.persistent) {
                checkboxStr = '<div class="slds-form-element slds-text-body_small slds-text-color_weak">' +
                    '<div class="slds-form-element__control">' +
                    '<div class="slds-checkbox">' +
                    '<input type="checkbox" name="options" id="doNotShowAgain" checked="" />' +
                    '<label class="slds-checkbox__label" for="doNotShowAgain">' +
                    '<span class="slds-checkbox_faux"></span>' +
                    '<span class="slds-text-body_small slds-text-color_weak">Don\'t show me this again</span>' +
                    '</label>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }

            var theme = this.getStyleClassFromTheme(message.theme);
            this.messengerLog("displayPromptMessage", "Function call", false);
            var html = '<div id="prompt_message" class="qmessenger">' +
                '<section role="alertdialog" tabindex="0" aria-labelledby="prompt-heading_q-messenger" aria-describedby="prompt-message-wrapper_q-messenger" class="slds-modal slds-fade-in-open slds-modal_prompt q-messenger-prompt" aria-modal="true">' +
                '<div class="slds-modal__container">' +
                '<header class="slds-modal__header ' + theme + '">' +
                '<button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" title="Close" id="prompt_close_buttom">' +
                '<svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">' +
                '<use xlink:href="#close"></use>' +
                '</svg>' +
                '<span class="slds-assistive-text">Close</span>' +
                '</button>' +
                '<h2 class="slds-text-heading_medium slds-truncate" id="prompt-heading_q-messenger">' + message.title + '</h2>' +
                '</header>' +
                '<div class="slds-modal__content slds-p-around_medium" id="prompt-message-wrapper_q-messenger">' +
                '<div class="slds-text-longform is-markdown">' + message.body + '</div>' +
                '<div class="slds-grid slds-grid_align-spread slds-m-top_large slds-grid_vertical-align-center slds-gutters_direct-small slds-wrap">' +
                '<div class="slds-col ">' +
                checkboxStr +
                '</div>' +
                '<div class="slds-col">' +
                '<span class="slds-text-body_small slds-text-color_weak slds-p-right_xx-small">Was this helpful?</span>' +
                '<div class="slds-button-group" role="group">' +
                '<button class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled upvote_button" title="This was helpful" aria-pressed="false" id="prompt_like_button">' +
                '<svg class="slds-button__icon" aria-hidden="true">' +
                '<use xlink:href="#like"></use>' +
                '</svg>' +
                '<span class="slds-assistive-text">Helpful</span>' +
                '</button>' +
                '<button class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled downvote_button" title="This was useless" aria-pressed="false" id="prompt_dislike_button">' +
                '<svg class="slds-button__icon" aria-hidden="true">' +
                '<use xlink:href="#dislike"></use>' +
                '</svg>' +
                '<span class="slds-assistive-text">Useless</span>' +
                '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<footer class="slds-modal__footer slds-theme_default">' +
                '<button class="slds-button slds-button_neutral" id="prompt_button">' + message.prompt_button_label + '</button>' +
                '</footer>' +
                '</div>' +
                '</section>' +
                '<div class="slds-backdrop slds-backdrop_open q-messenger-prompt-slds-background"></div>' +
                '</div>';
            
            var elemDiv = document.createElement("div");
            elemDiv.innerHTML = html;
            document.body.appendChild(elemDiv);

            if (!message.persistent) {
                document.getElementById("doNotShowAgain").checked = false;
            }

            if (message.localStorage.like) { document.getElementById("prompt_like_button").classList.add("slds-is-selected"); }
            if (message.localStorage.dislike) { document.getElementById("prompt_dislike_button").classList.add("slds-is-selected"); }

            var self = this;
            document.getElementById("prompt_close_buttom").addEventListener("click", function () {
                self.messengerLog("displayPromptMessage", "Close prompt", false);
                document.getElementById("prompt_message").style.display = "none";
                self.messages.prompt_message.localStorage.dismissed = true;
                const record = quip.apps.getRootRecord();
                record.set('qmessenger', { ['qmessenger_' + self.messages.prompt_message.uuid]: JSON.stringify(self.messages.prompt_message.localStorage)});
                //window.localStorage.setItem('qmessenger_' + self.messages.prompt_message.uuid, JSON.stringify(self.messages.prompt_message.localStorage));
            }, false);

            document.getElementById("prompt_button").addEventListener("click", function () {
                self.messengerLog("displayPromptMessage", "Close prompt", false);
                document.getElementById("prompt_message").style.display = "none";
                if (!message.persistent && document.querySelector('#doNotShowAgain').checked) {
                    self.messages.prompt_message.localStorage.dismissed = true;
                    const record = quip.apps.getRootRecord();
                    record.set('qmessenger', { ['qmessenger_' + self.messages.prompt_message.uuid]: JSON.stringify(self.messages.prompt_message.localStorage)});
                    //window.localStorage.setItem('qmessenger_' + self.messages.prompt_message.uuid, JSON.stringify(self.messages.prompt_message.localStorage));
                }
            }, false);

            document.getElementById("prompt_like_button").addEventListener("click", function () {
                self.messengerLog("displayPromptMessage", "Like prompt", false);
                self.messages.prompt_message.localStorage.dislike = false;
                self.messages.prompt_message.localStorage.like = !self.messages.prompt_message.localStorage.like;
                if (self.messages.prompt_message.localStorage.like) {
                    document.getElementById("prompt_like_button").classList.add("slds-is-selected");
                    document.getElementById("prompt_dislike_button").classList.remove("slds-is-selected");
                    self.voteForMessage(self.messages.prompt_message.like_token);
                } else {
                    document.getElementById("prompt_like_button").classList.remove("slds-is-selected");
                    document.getElementById("prompt_dislike_button").classList.remove("slds-is-selected");
                }
                const record = quip.apps.getRootRecord();
                record.set('qmessenger', { ['qmessenger_' + self.messages.prompt_message.uuid]: JSON.stringify(self.messages.prompt_message.localStorage)});
                //window.localStorage.setItem('qmessenger_' + self.messages.prompt_message.uuid, JSON.stringify(self.messages.prompt_message.localStorage));
            }, false);

            document.getElementById("prompt_dislike_button").addEventListener("click", function () {
                self.messengerLog("displayPromptMessage", "Dislike prompt", false);
                self.messages.prompt_message.localStorage.like = false;
                self.messages.prompt_message.localStorage.dislike = !self.messages.prompt_message.localStorage.dislike;
                if (self.messages.prompt_message.localStorage.dislike) {
                    document.getElementById("prompt_like_button").classList.remove("slds-is-selected");
                    document.getElementById("prompt_dislike_button").classList.add("slds-is-selected");
                    self.voteForMessage(self.messages.prompt_message.dislike_token);
                } else {
                    document.getElementById("prompt_like_button").classList.remove("slds-is-selected");
                    document.getElementById("prompt_dislike_button").classList.remove("slds-is-selected");
                }
                const record = quip.apps.getRootRecord();
                record.set('qmessenger', { ['qmessenger_' + self.messages.prompt_message.uuid]: JSON.stringify(self.messages.prompt_message.localStorage)});
                //window.localStorage.setItem('qmessenger_' + self.messages.prompt_message.uuid, JSON.stringify(self.messages.prompt_message.localStorage));
            }, false);
        },


        displayCardMessage(message) {
            try {
                this.messengerLog("displayCardMessage", "Function call", false);
                var theme = this.getStyleClassFromTheme(message.theme);
                var card_html = '<div id="card_message" class="qmessenger">' +
                    '<article class="slds-card slds-color__border_gray-5 ' + theme + '">' +
                    '<div class="slds-card__header slds-grid">' +
                    '<header class="slds-media slds-media_center slds-has-flexi-truncate">' +
                    '<div class="slds-media__figure">' +
                    '<span class="slds-icon_container slds-icon-utility-setup_assistant_guide" title="Warning">' +
                    '<svg class="slds-icon slds-icon_small" aria-hidden="true">' +
                    '<use xlink:href="#' + message.card_icon + '"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Warning</span>' +
                    '</span>' +
                    '</div>' +
                    '<div class="slds-media__body" >' +
                    '<h2 class="slds-card__header-title">' +
                    '<div class="slds-truncate">' +
                    '<span>' + message.title + '</span>' +
                    '</div>' +
                    '</h2>' +
                    '</div>' +
                    '<div class="slds-no-flex">' +
                    '<div class="slds-button-group" role="group">' +
                    '<button class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled upvote_button" title="This was helpful" aria-pressed="false" id="card_like_button">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#like"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Helpful</span>' +
                    '</button>' +
                    '<button class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled downvote_button" title="This was useless" aria-pressed="false" id="card_dislike_button">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#dislike"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Useless</span>' +
                    '</button>' +
                    '</div>' +
                    '<div class="slds-button-group" role="group">' +
                    '<button class="slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small collapse-card_button" title="Collapse/Expand" id="minimize_card_button">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#dash"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Collapse/Expand</span>' +
                    '</button>' +
                    '</div>' +
                    '</div>' +
                    '</header>' +
                    '</div>' +
                    '<div class="slds-card__body slds-card__body_inner slds-theme_default slds-p-vertical_medium slds-scrollable_y" style="max-height: 25rem;">' +
                    '<div class="slds-text-longform is-markdown">' +
                    message.body +
                    '</div>' +
                    '</div>' +
                    '</article>' +
                    '</div>';

                var card_html_inline = '<div class="slds-card__header slds-grid">' +
                    '<header class="slds-media slds-media_center slds-has-flexi-truncate">' +
                    '<div class="slds-media__figure">' +
                    '<span class="slds-icon_container slds-icon-utility-setup_assistant_guide" title="Warning">' +
                    '<svg class="slds-icon slds-icon_small" aria-hidden="true">' +
                    '<use xlink:href="#' + message.card_icon + '"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Warning</span>' +
                    '</span>' +
                    '</div>' +
                    '<div class="slds-media__body" >' +
                    '<h2 class="slds-card__header-title">' +
                    '<div class="slds-truncate">' +
                    '<span>' + message.title + '</span>' +
                    '</div>' +
                    '</h2>' +
                    '</div>' +
                    '<div class="slds-no-flex">' +
                    '<div class="slds-button-group" role="group">' +
                    '<button class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled upvote_button" title="This was helpful" aria-pressed="false" id="card_like_button">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#like"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Helpful</span>' +
                    '</button>' +
                    '<button class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled downvote_button" title="This was useless" aria-pressed="false" id="card_dislike_button">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#dislike"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Useless</span>' +
                    '</button>' +
                    '</div>' +
                    '<div class="slds-button-group" role="group">' +
                    '<button class="slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small collapse-card_button" title="Collapse/Expand" id="minimize_card_button">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#dash"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Collapse/Expand</span>' +
                    '</button>' +
                    '</div>' +
                    '</div>' +
                    '</header>' +
                    '</div>' +
                    '<div class="slds-card__body slds-card__body_inner slds-theme_default slds-p-vertical_medium slds-scrollable_y" style="max-height: 25rem;">' +
                    '<div class="slds-text-longform is-markdown">' +
                    message.body +
                    '</div>' +
                    '</div>';

                var minimized_card = '<div class="qmessenger">' +
                    '<article class="slds-card slds-color__border_gray-5 ' + theme + '">' +
                    '<div class="slds-card__header slds-grid">' +
                    '<header class="slds-media slds-media_center slds-has-flexi-truncate">' +
                    '<div class="slds-media__figure">' +
                    '<span class="slds-icon_container slds-icon-utility-setup_assistant_guide" title="Warning">' +
                    '<svg class="slds-icon slds-icon_small" aria-hidden="true">' +
                    '<use xlink:href="#' + message.card_icon + '"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Warning</span>' +
                    '</span>' +
                    '</div>' +
                    '<div class="slds-media__body" >' +
                    '<h2 class="slds-card__header-title">' +
                    '<div class="slds-truncate">' +
                    '<span>' + message.title + '</span>' +
                    '</div>' +
                    '</h2>' +
                    '</div>' +
                    '<div class="slds-no-flex">' +
                    '<div class="slds-button-group" role="group">' +
                    '<button class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled upvote_button" title="This was helpful" aria-pressed="false" id="card_like_button_min">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#like"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Helpful</span>' +
                    '</button>' +
                    '<button class="slds-button slds-button_icon slds-button_icon-x-small slds-button_icon-border-filled downvote_button" title="This was useless" aria-pressed="false" id="card_dislike_button_min">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#dislike"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Useless</span>' +
                    '</button>' +
                    '</div>' +
                    '<div class="slds-button-group" role="group">' +
                    '<button class="slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small collapse-card_button" title="Collapse/Expand" id="open_card_button">' +
                    '<svg class="slds-button__icon" aria-hidden="true">' +
                    '<use xlink:href="#add"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Collapse/Expand</span>' +
                    '</button>' +
                    '</div>' + 
                    '</div>' +
                    '</header>' +
                    '</div>' +
                    '</article>' +
                    '</div>';


                if (this.cardContainerId != null && this.cardContainerId != '') {
                    this.messengerLog("displayCardMessage", "Adding card message to element with id: " + this.cardContainerId, false);
                    var elemDiv = document.createElement("article");
                    elemDiv.innerHTML = card_html_inline;
                    elemDiv.className = "slds-card slds-color__border_gray-5 " + theme;
                    elemDiv.id = "card_message"
                    document.getElementById(this.cardContainerId).appendChild(elemDiv);
                    document.getElementById("card_message").style.display = "none";
                } else {
                    this.messengerLog("displayCardMessage", "Adding card message to body", false);
                    var elemDiv = document.createElement("div");
                    elemDiv.innerHTML = card_html;
                    elemDiv.className = 'slds-card q-messenger-fixed-card';
                    document.body.insertBefore(elemDiv, document.body.firstChild);
                    document.getElementById("card_message").style.display = "none";
                }

                // Add the minimized card
                this.messengerLog("displayCardMessage", "Creating minimized card", false);
                var minimizedElemDiv = document.createElement("div");
                minimizedElemDiv.innerHTML = minimized_card;
                minimizedElemDiv.className = 'slds-card q-messenger-fixed-card';
                minimizedElemDiv.id = "minimized_card_message";
                minimizedElemDiv.style.display = "none";
                document.body.insertBefore(minimizedElemDiv, document.body.firstChild);

                if (message.localStorage.like) { 
                    document.getElementById("card_like_button").classList.add("slds-is-selected");
                    document.getElementById("card_like_button_min").classList.add("slds-is-selected");
                }
                if (message.localStorage.dislike) { 
                    document.getElementById("card_dislike_button").classList.add("slds-is-selected"); 
                    document.getElementById("card_dislike_button_min").classList.add("slds-is-selected");
                }

                if (message.localStorage.minimized && (this.cardContainerId == null || this.cardContainerId == '')) {
                    document.getElementById("minimized_card_message").style.display = "block";
                } else {
                    document.getElementById("card_message").style.display = "block";
                }

                var self = this;
                document.getElementById("minimize_card_button").addEventListener("click", function () {
                    self.messengerLog("displayCardMessage", "Minimize card", false);
                    document.getElementById("card_message").style.display = "none";
                    document.getElementById("minimized_card_message").style.display = "block";
                    self.messages.card_message.localStorage.minimized = !self.messages.card_message.localStorage.minimized;
                    const record = quip.apps.getRootRecord();
                    record.set('qmessenger', { ['qmessenger_' + self.messages.card_message.uuid]: JSON.stringify(self.messages.card_message.localStorage)});
                    //window.localStorage.setItem('qmessenger_' + self.messages.card_message.uuid, JSON.stringify(self.messages.card_message.localStorage));
                }, false);

                document.getElementById("open_card_button").addEventListener("click", function () {
                    self.messengerLog("displayCardMessage", "Open card", false);
                    document.getElementById("card_message").style.display = "block";
                    document.getElementById("minimized_card_message").style.display = "none";
                    self.messages.card_message.localStorage.minimized = !self.messages.card_message.localStorage.minimized;
                    record.set('qmessenger', { ['qmessenger_' + self.messages.card_message.uuid]: JSON.stringify(self.messages.card_message.localStorage)});
                    //window.localStorage.setItem('qmessenger_' + self.messages.card_message.uuid, JSON.stringify(self.messages.card_message.localStorage));
                }, false);

                document.getElementById("card_like_button").addEventListener("click", function () {
                    self.messengerLog("displayCardMessage", "Like card", false);
                    self.messages.card_message.localStorage.dislike = false;
                    self.messages.card_message.localStorage.like = !self.messages.card_message.localStorage.like;
                    if (self.messages.card_message.localStorage.like) {
                        document.getElementById("card_like_button").classList.add("slds-is-selected");
                        document.getElementById("card_like_button_min").classList.add("slds-is-selected");
                        document.getElementById("card_dislike_button").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button_min").classList.remove("slds-is-selected");
                        self.voteForMessage(self.messages.card_message.like_token);
                    } else {
                        document.getElementById("card_like_button").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button").classList.remove("slds-is-selected");
                        document.getElementById("card_like_button_min").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button_min").classList.remove("slds-is-selected");
                    }
                    const record = quip.apps.getRootRecord();
                    record.set('qmessenger', { ['qmessenger_' + self.messages.card_message.uuid]: JSON.stringify(self.messages.card_message.localStorage)});
                    //window.localStorage.setItem('qmessenger_' + self.messages.card_message.uuid, JSON.stringify(self.messages.card_message.localStorage));
                }, false);

                document.getElementById("card_dislike_button").addEventListener("click", function () {
                    self.messengerLog("displayCardMessage", "Dislike card", false);
                    self.messages.card_message.localStorage.like = false;
                    self.messages.card_message.localStorage.dislike = !self.messages.card_message.localStorage.dislike;
                    if (self.messages.card_message.localStorage.dislike) {
                        document.getElementById("card_like_button").classList.remove("slds-is-selected");
                        document.getElementById("card_like_button_min").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button").classList.add("slds-is-selected");
                        document.getElementById("card_dislike_button_min").classList.add("slds-is-selected");
                        self.voteForMessage(self.messages.card_message.dislike_token);
                    } else {
                        document.getElementById("card_like_button").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button").classList.remove("slds-is-selected");
                        document.getElementById("card_like_button_min").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button_min").classList.remove("slds-is-selected");
                    }
                    const record = quip.apps.getRootRecord();
                    record.set('qmessenger', { ['qmessenger_' + self.messages.card_message.uuid]: JSON.stringify(self.messages.card_message.localStorage)});
                    //window.localStorage.setItem('qmessenger_' + self.messages.card_message.uuid, JSON.stringify(self.messages.card_message.localStorage));
                }, false);

                document.getElementById("card_like_button_min").addEventListener("click", function () {
                    self.messengerLog("displayCardMessage", "Like card", false);
                    self.messages.card_message.localStorage.dislike = false;
                    self.messages.card_message.localStorage.like = !self.messages.card_message.localStorage.like;
                    if (self.messages.card_message.localStorage.like) {
                        document.getElementById("card_like_button").classList.add("slds-is-selected");
                        document.getElementById("card_like_button_min").classList.add("slds-is-selected");
                        document.getElementById("card_dislike_button").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button_min").classList.remove("slds-is-selected");
                        self.voteForMessage(self.messages.card_message.like_token);
                    } else {
                        document.getElementById("card_like_button").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button").classList.remove("slds-is-selected");
                        document.getElementById("card_like_button_min").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button_min").classList.remove("slds-is-selected");
                    }
                    const record = quip.apps.getRootRecord();
                    record.set('qmessenger', { ['qmessenger_' + self.messages.card_message.uuid]: JSON.stringify(self.messages.card_message.localStorage)});
                    //window.localStorage.setItem('qmessenger_' + self.messages.card_message.uuid, JSON.stringify(self.messages.card_message.localStorage));
                }, false);

                document.getElementById("card_dislike_button_min").addEventListener("click", function () {
                    self.messengerLog("displayCardMessage", "Dislike card", false);
                    self.messages.card_message.localStorage.like = false;
                    self.messages.card_message.localStorage.dislike = !self.messages.card_message.localStorage.dislike;
                    if (self.messages.card_message.localStorage.dislike) {
                        document.getElementById("card_like_button").classList.remove("slds-is-selected");
                        document.getElementById("card_like_button_min").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button").classList.add("slds-is-selected");
                        document.getElementById("card_dislike_button_min").classList.add("slds-is-selected");
                        self.voteForMessage(self.messages.card_message.dislike_token);
                    } else {
                        document.getElementById("card_like_button").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button").classList.remove("slds-is-selected");
                        document.getElementById("card_like_button_min").classList.remove("slds-is-selected");
                        document.getElementById("card_dislike_button_min").classList.remove("slds-is-selected");
                    }
                    const record = quip.apps.getRootRecord();
                    record.set('qmessenger', { ['qmessenger_' + self.messages.card_message.uuid]: JSON.stringify(self.messages.card_message.localStorage)});
                    //window.localStorage.setItem('qmessenger_' + self.messages.card_message.uuid, JSON.stringify(self.messages.card_message.localStorage));
                }, false);
            } catch(ex) {
                this.messengerLog("displayCardMessage", ex, true);
            }
        },


        init(obj) {
            this.hasErrors = false;
            this.messengerLog("init", "Q-Messenger init() called: obj", false);

            if (obj.isDebbuging != undefined && obj.isDebbuging != null) {
                this.isDebbuging = obj.isDebbuging;
                this.messengerLog("init", "isDebbuging set", false);
            } else {
                this.isDebbuging = false;
            }
            if (obj.csrfToken != undefined && obj.csrfToken != null) {
                this.csrfToken = obj.csrfToken;
                this.messengerLog("init", "csrfToken set", false);
            } else {
                this.csrfToken = '';
            }
            if (obj.messages != undefined && obj.messages != null) {
                this.messengerLog("init", "Messages set", false);
                this.messages = obj.messages;
            } else {
                this.hasErrors = true;
                this.messengerLog("init", "Messages cannot be null or undefined", true);
            }
            if (obj.symbolsURL != undefined && obj.symbolsURL != null) {
                this.messengerLog("init", "symbolsURL set", false);
                this.symbolsURL = obj.symbolsURL;
            } else {
                this.hasErrors = true;
                this.messengerLog("init", "symbolsURL is null or undefined.", true);
            }
            if (obj.voteURL != undefined && obj.voteURL != null) {
                this.messengerLog("init", "voteURL set", false);
                this.voteURL = obj.voteURL;
            } else {
                this.hasErrors = true;
                this.messengerLog("init", "voteURL is null or undefined.", true);
            }
            if (obj.cardContainerId != undefined && obj.cardContainerId != null && obj.cardContainerId != '') {
                if (document.getElementById(obj.cardContainerId) != null) {
                    this.messengerLog("init", "cardContainerId set", false);
                    this.cardContainerId = obj.cardContainerId;
                } else {
                    this.messengerLog("init", "cardContainerId could not be found, are you sure you provided the right id?", true);
                    this.cardContainerId = '';
                }
            } else {
                this.cardContainerId = '';
            }

            this.setTheIconValues();
            if (this.messages.alert_message != null) { this.messages.alert_message = this.appendLocalStorageToMessages(this.messages.alert_message); }
            if (this.messages.card_message != null) { this.messages.card_message = this.appendLocalStorageToMessages(this.messages.card_message); }
            if (this.messages.prompt_message != null) { this.messages.prompt_message = this.appendLocalStorageToMessages(this.messages.prompt_message); }
            this.messengerLog("init", "Q-Messenger init() completed.", false);
        },


        getStyleClassFromTheme(theme) {
            switch(theme) {
                case 'Info': return 'slds-theme_alt-inverse';
                case 'Success': return 'slds-theme_success';
                case 'Warning': return 'slds-theme_warning';
                case 'Error': return 'slds-theme_error';
            }
        },


        voteForMessage(token) {
            if (this.csrfToken == '') {
                try {
                    this.csrfToken = document.getElementsByName("csrf-token")[0].getAttribute("content");
                } catch(ex) {
                    this.messengerLog("voteForMessage", "Could not get csrf token from document", true);
                    this.csrfToken = '';
                }
            }
            try {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", this.voteURL);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("x-csrf-token", this.csrfToken);
                xhr.onload = () => {
                    console.log('voteForMessage callback.');
                }
                xhr.send(JSON.stringify({
                    token: token
                }));
            } catch(ex) {
                this.messengerLog("voteForMessage", "displayMessages called", true);
            }
        },


        appendLocalStorageToMessages(message) {
            var messageKey = 'qmessenger_' + message.uuid;
            const record = quip.apps.getRootRecord();
            if (record.get('qmessenger') === null) {
            //if (localStorage.getItem(messageKey) === null) {
                var obj = {
                    minimized: false,
                    dismissed: false,
                    like: false,
                    dislike: false
                }
                record.set('qmessenger', { [messageKey]: JSON.stringify(obj)});
                //window.localStorage.setItem(messageKey, JSON.stringify(obj));
                message.localStorage = obj;
            } else {
                var obj = record.get('qmessenger')[messageKey];//window.localStorage.getItem(messageKey);
                console.log(obj)
                message.localStorage = JSON.parse(obj);
            }
            return message;
        },


        displayMessages() {
            this.messengerLog("displayMessages", "displayMessages called", false);
            console.log('Q-Messages :: ' , this.messages);
            if (!this.hasErrors) {
                if (this.messages.alert_message != null) { this.displayAlertMessage(this.messages.alert_message); }
                if (this.messages.card_message != null) { this.displayCardMessage(this.messages.card_message); }
                if (this.messages.prompt_message != null) { this.displayPromptMessage(this.messages.prompt_message); }
            } else {
                this.messengerLog("displayMessages", "displayMessages called but there are existing errors.", true);
            }
        }
    };
})(qMessenger || {});