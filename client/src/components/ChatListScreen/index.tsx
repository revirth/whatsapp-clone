import React from "react";
import ChatList from "./ChatList";
import ChatNavbar from "./ChatNavbar";

const ChatListScreen: React.FC = () => (
  <div>
    <ChatNavbar />
    <ChatList />
  </div>
);

export default ChatListScreen;
