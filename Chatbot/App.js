import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from "react-native-dialogflow";
import {dialogflowConfig} from './env';

const botAvatar = require('./mascot.png');
const BOT = {
  _id: 2,
  name: 'Mr.David',
  avatar: botAvatar,
};
class App extends Component {

  state = {
    messages: [
      {
        _id: 1,
        text: `Hello, My name is Mr. David`,
        createdAt: new Date().getTime(),
        user: BOT,
      },
      
    ],
    id: 1,
    name: '',
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];

    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg = {
      _id:this.state.messages.length + 1,
      text,
      createdAt: new Date().getTime(),
      user: BOT,
    };
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, [msg]),
    }));
  }

  onSend(messages = []) {
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, messages),
    }));

    let text = messages[0].text;

    Dialogflow_V2.requestQuery(
      text,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error),
    );
  }

  onQuickReply(quickReply) {
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, quickReply),
    }));

    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error),
    );
  }

  render() {
    return (
      
      <View style={{flex: 1, backgroundColor: '#fff'}}>
          <GiftedChat
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
          renderBubble={this.renderBubble}
          user={{_id: 1}}
        />
      </View>
      
    )
  }
}

export default App;