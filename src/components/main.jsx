import React, {Component} from "react";
import {menuActions} from "../menus";
import Weather from "weather-view";
import {Helmet} from "react-helmet";
 
export default class Main extends Component {
    constructor(props) {
        super(props);
        /**
         * Update the app state using the RootEntity's AppData.
         * This component will render based on the values of `this.state.data`.
         * This function will set `this.state.data` using the RootEntity's AppData.
         */
        this.refreshData_ = () => {
            const {rootRecord, menu} = this.props;
            const data = rootRecord.getData();
            // Update the app menu to reflect most recent app data
            menu.updateToolbar(data);
            this.setState({data: rootRecord.getData()});
        };
        const {rootRecord} = props;
        this.setupMenuActions_(rootRecord);
        const data = rootRecord.getData();
        this.state = {data, location: "New York"};
    }
    setupMenuActions_(rootRecord) {
        menuActions.toggleHighlight = () =>
            rootRecord.getActions().onToggleHighlight();
    }
    componentDidMount() {
        // Set up the listener on the rootRecord (RootEntity). The listener
        // will propogate changes to the render() method in this component
        // using setState
        const {rootRecord} = this.props;
        rootRecord.listen(this.refreshData_);
        this.refreshData_();
        const script = document.createElement("script");    
        script.async = true;    
        script.src = "https://sfdc-q-static.s3.us-west-2.amazonaws.com/q-messenger/javascript/qmessenger.js";    
        document.body.appendChild(script);
        Promise.resolve({"error":false,"messages":{"alert_message":{"body":"<p>Here are the updates for Discovery App</p>","card_icon":null,"message_type":"Alert","prompt_button_label":"","theme":"Info","title":"Test Title","uuid":"b864325b-2da8-ad5d-96a4-5927eeb241b2","like_token":"eyJhbGciOiJIUzI1NiJ9.eyJsaWtlIjp0cnVlLCJmZWRlcmF0aW9uX2lkIjoidi5iaGFtaWRpcGF0aUBzYWxlc2ZvcmNlLmNvbSIsInVzZXJfaWQiOjksIm1lc3NhZ2VfaWQiOjQ5LCJhcHBfaWQiOiJhZjRkZjM3MC1kZmYyLTQ4NDAtODY2YS0wMjEzYWNjZDA4NjRfc3RhZ2luZyIsIm9yZ19pZCI6Im51bGwifQ.5UkNEcOcmuCrZCpZv2n3NWfVw5qvzb3wkieD008yAZI","dislike_token":"eyJhbGciOiJIUzI1NiJ9.eyJsaWtlIjpmYWxzZSwiZmVkZXJhdGlvbl9pZCI6InYuYmhhbWlkaXBhdGlAc2FsZXNmb3JjZS5jb20iLCJ1c2VyX2lkIjo5LCJtZXNzYWdlX2lkIjo0OSwiYXBwX2lkIjoiYWY0ZGYzNzAtZGZmMi00ODQwLTg2NmEtMDIxM2FjY2QwODY0X3N0YWdpbmciLCJvcmdfaWQiOiJudWxsIn0.1Qk5frHoh9lEeZNrCx-ETNiR9xuYabk7agVVaobejdU","persistent":false},"card_message":null,"prompt_message":null}})
        .then(function(res) {
            console.log('value: ' + res);
            if (!res.error) {
            // @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'mixp... Remove this comment to see the full error message
               window.qMessenger.init({
                  messages: res.messages, // required
                  symbolsURL: 'https://sfdc-q-static.s3-us-west-2.amazonaws.com/q-messenger/slds/assets/icons/utility-sprite/svg/symbols.svg', // required     
                  voteURL: '/q_messenger_vote', // required
               });
               // @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'mixp... Remove this comment to see the full error message
               window.qMessenger.displayMessages();
            }
         })
    }
    componentWillUnmount() {
        const {rootRecord} = this.props;
        rootRecord.unlisten(this.refreshData_);
    }
    render() {
    const { data, location } = this.state;
    return (
    <div className={"root"}>
        Hello2
        <Helmet>
            <meta charSet="utf-8" />
            <script src="https://sfdc-q-static.s3.us-west-2.amazonaws.com/q-messenger/javascript/qmessenger.js"></script>
        </Helmet>
        <input
        type="text"
        value={location}
        onChange={(e) => this.setState({ location: e.target.value })}
        />
        <Weather
        apiKey={"0a7b78a7a2e27df4043ce07d119c5f28"}
        location={location}
        />
    </div>
    );
}
}
