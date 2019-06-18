import React, { useCallback } from "react";
import styled from "styled-components";
import { History } from "history";
import ChatNavbar from "./ChatNavbar";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import { useApolloClient, useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";

const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      name
      picture
      messages {
        id
        content
        createdAt
      }
    }
  }
`;

const Container = styled.div`
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`;

interface ChatRoomScreenParams {
  chatId: string;
  history: History;
}

export interface ChatQueryMessage {
  id: string;
  content: string;
  createdAt: number;
}

export interface ChatQueryResult {
  id: string;
  name: string;
  picture: string;
  messages: Array<ChatQueryMessage>;
}

type OptionalChatQueryResult = ChatQueryResult | null;

const ChatRoomScreen: React.FC<ChatRoomScreenParams> = ({
  history,
  chatId
}) => {
  const client = useApolloClient();
  const {
    data: { chat }
  } = useQuery<any>(getChatQuery, {
    variables: { chatId }
  });

  const onSendMessage = useCallback(
    (content: string) => {
      if (!chat) return null;

      const message = {
        id: (chat.messages.length + 10).toString(),
        createdAt: Date.now(),
        content,
        __typename: "Chat"
      };

      client.writeQuery({
        query: getChatQuery,
        variables: { chatId },
        data: {
          chat: {
            ...chat,
            messages: chat.messages.concat(message)
          }
        }
      });
    },
    [chat, chatId, client]
  );

  if (!chat) return null;

  return (
    <Container>
      <ChatNavbar chat={chat} history={history} />
      {chat.messages && <MessagesList messages={chat.messages} />}
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  );
};

export default ChatRoomScreen;
