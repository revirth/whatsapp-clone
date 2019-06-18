import React from "react";
import ChatList from "./ChatList";
import ChatNavbar from "./ChatNavbar";
import { History } from "history";

interface ChatsListScreenProps {
  history: History;
}

const ChatListScreen: React.FC<ChatsListScreenProps> = ({ history }) => (
  <div>
    <ChatNavbar />
    <ChatList history={history} />
  </div>
);

export default ChatListScreen;
