import React, {Component} from "react";
import {menuActions} from "../menus";
import Weather from "weather-view";
import {Helmet} from "react-helmet";
import axios from 'axios';
const jwt = require("jsonwebtoken");
import * as Constants from '../model/consts';
 
export default class Main extends Component {
    constructor(props) {
        super(props);
        /**
         * Update the app state using the RootEntity's AppData.
         * This component will render based on the values of `this.state.data`.
         * This function will set `this.state.data` using the RootEntity's AppData.
         */
        this.test2 = this.test2.bind(this)
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

        //qMessenger fetch api
        console.log(Constants.Q_MESSENGER_APP_UUID, Consts.Q_MESSENGER_SECRET_KEY)
        var userFederationId = Constants.Q_MESSENGER_FEDERATION_ID;
        var userRole = null;
        var qMessengerUuid = Constants.Q_MESSENGER_APP_UUID;
        var qMessengerSecretKey = Constants.Q_MESSENGER_SECRET_KEY;
        var qMessengerAlgorithm = Constants.Q_MESSENGER_ALGO;
        var org_id = null;

        var token = jwt.sign({ 
            user_federation_id: userFederationId, 
            user_role: userRole, 
            app_uuid: qMessengerUuid, 
            org_id: org_id },
            qMessengerSecretKey, { algorithm: qMessengerAlgorithm }
        );

        var urlString = Constants.REACT_APP_Q_MESSENGER_URL + 
            "?app_uuid=" + qMessengerUuid + 
            "&user_federation_id=" + userFederationId + 
            "&user_role=" + userRole +
            "&org_id=" + org_id;
        console.log("Hellooo")
        let opts = { headers: { "Content-Type": "application/json", Authorization: "Basic " + token, 'Access-Control-Allow-Origin' : '*' } };
        axios.get( urlString, opts).then(res => {
            console.log("%%%", res.data)
        }).catch(err => {
            console.log(err)
        })
       
        setTimeout(this.test2,5000);
    }
    test2 = () =>
    {
        //qMessenger Plugin test
        console.log('value: ',window.qMessenger);
        const res = {"error":false,"messages":{"alert_message":{"body":"<p>Here are the updates for Discovery App</p>","card_icon":null,"message_type":"Alert","prompt_button_label":"","theme":"Info","title":"Test Title","uuid":"b864325b-2da8-ad5d-96a4-5927eeb241b2","like_token":"eyJhbGciOiJIUzI1NiJ9.eyJsaWtlIjp0cnVlLCJmZWRlcmF0aW9uX2lkIjoidi5iaGFtaWRpcGF0aUBzYWxlc2ZvcmNlLmNvbSIsInVzZXJfaWQiOjksIm1lc3NhZ2VfaWQiOjQ5LCJhcHBfaWQiOiJhZjRkZjM3MC1kZmYyLTQ4NDAtODY2YS0wMjEzYWNjZDA4NjRfc3RhZ2luZyIsIm9yZ19pZCI6Im51bGwifQ.5UkNEcOcmuCrZCpZv2n3NWfVw5qvzb3wkieD008yAZI","dislike_token":"eyJhbGciOiJIUzI1NiJ9.eyJsaWtlIjpmYWxzZSwiZmVkZXJhdGlvbl9pZCI6InYuYmhhbWlkaXBhdGlAc2FsZXNmb3JjZS5jb20iLCJ1c2VyX2lkIjo5LCJtZXNzYWdlX2lkIjo0OSwiYXBwX2lkIjoiYWY0ZGYzNzAtZGZmMi00ODQwLTg2NmEtMDIxM2FjY2QwODY0X3N0YWdpbmciLCJvcmdfaWQiOiJudWxsIn0.1Qk5frHoh9lEeZNrCx-ETNiR9xuYabk7agVVaobejdU","persistent":false},"card_message":null,"prompt_message":null}};
        window.qMessenger.init({
            messages: res.messages, // required
            symbolsURL: 'https://sfdc-q-static.s3-us-west-2.amazonaws.com/q-messenger/slds/assets/icons/utility-sprite/svg/symbols.svg', // required     
            voteURL: '/q_messenger_vote', // required
        });
        window.qMessenger.displayMessages();
    }
    componentWillUnmount() {
        const {rootRecord} = this.props;
        rootRecord.unlisten(this.refreshData_);
    
    }
    render() {
    const { data, location } = this.state;
    return (
    <div className={"root"}>
        {/* Loading plugin through helmet */}
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
