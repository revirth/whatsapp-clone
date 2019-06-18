import React from "react";
import {
  BrowserRouter,
  Route,
  Redirect,
  RouteComponentProps
} from "react-router-dom";
import "./App.css";
import ChatListScreen from "./components/ChatListScreen";
import ChatRoomScreen from "./components/ChatRoomScreen";
import AnimatedSwitch from "./components/AnimatedSwitch";

const App: React.FC = () => (
  <BrowserRouter>
    <AnimatedSwitch>
      <Route exact path="/chats" component={ChatListScreen} />
      <Route
        exact
        path="/chats/:chatId"
        component={({
          match,
          history
        }: RouteComponentProps<{ chatId: string }>) => (
          <ChatRoomScreen chatId={match.params.chatId} history={history} />
        )}
      />
    </AnimatedSwitch>
    <Route exact path="/" render={redirectToChats} />
  </BrowserRouter>
);

const redirectToChats = () => <Redirect to="/chats" />;

export default App;
