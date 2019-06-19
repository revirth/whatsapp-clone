import React, { useCallback } from "react";
import styled from "styled-components";
import { History } from "history";
import ChatNavbar from "./ChatNavbar";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import { useApolloClient, useQuery, useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import * as fragments from "../../graphql/fragments";
import {
  useGetChatQuery,
  useAddMessageMutation,
  ChatsQuery
} from "../../graphql/types";
import { writeMessage } from "../../services/cache.service";

const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      ...FullChat
    }
  }
  ${fragments.fullchat}
`;

const addMessageMutation = gql`
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      ...Message
    }
  }
  ${fragments.message}
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

const ChatRoomScreen: React.FC<ChatRoomScreenParams> = ({
  history,
  chatId
}) => {
  const client = useApolloClient();
  const { data, loading } = useGetChatQuery({
    variables: { chatId }
  });
  const addMessage = useAddMessageMutation();

  const onSendMessage = useCallback(
    (content: string) => {
      if (data === undefined) return null;
      const chat = data.chat;
      if (chat === null) return null;

      addMessage({
        variables: { chatId, content },
        optimisticResponse: {
          __typename: "Mutation",
          addMessage: {
            __typename: "Message",
            id: Math.random()
              .toString(36)
              .substr(2, 9),
            createdAt: new Date(),
            chat: {
              __typename: "Chat",
              id: chatId
            },
            content
          }
        },
        update: (client, { data: { addMessage } }) => {
          writeMessage(client, addMessage);
        }
      });
    },
    [data, chatId, addMessage]
  );

  if (data === undefined) return null;

  const chat = data.chat;
  const loadingChat = loading;

  if (loadingChat) return null;
  if (chat === null) return null;

  return (
    <Container>
      <ChatNavbar chat={chat} history={history} />
      {chat.messages && <MessagesList messages={chat.messages} />}
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  );
};

export default ChatRoomScreen;
