import React, { useCallback } from "react";
import styled from "styled-components";
import { History } from "history";
import ChatNavbar from "./ChatNavbar";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import { useApolloClient, useQuery, useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import * as queries from "../../graphql/queries";
import * as fragments from "../../graphql/fragments";
import { defaultDataIdFromObject } from "apollo-cache-inmemory";
import {
  useGetChatQuery,
  useAddMessageMutation,
  ChatsQuery
} from "../../graphql/types";

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

interface ChatsResult {
  chats: any[];
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
            content
          }
        },
        update: (client, { data: { addMessage } }) => {
          type FullChat = { [key: string]: any };
          let fullChat;
          const chatIdFromStore = defaultDataIdFromObject(addMessage.chat);
          if (chatIdFromStore === null) return;

          try {
            fullChat = client.readFragment<FullChat>({
              id: chatIdFromStore,
              fragment: fragments.fullchat,
              fragmentName: "FullChat"
            });
          } catch (e) {
            return;
          }

          if (fullChat === null || fullChat.messages === null) return;
          if (
            fullChat.messages.messages.some((m: any) => m.id === addMessage.id)
          )
            return;

          fullChat.messages.messages.push(addMessage);
          fullChat.lastMessage = addMessage;

          client.writeFragment({
            id: chatIdFromStore,
            fragment: fragments.fullchat,
            fragmentName: "FullChat",
            data: fullChat
          });

          let data: ChatsQuery | null;
          try {
            data = client.readQuery({
              query: queries.chats
            });
          } catch (e) {
            return;
          }
          if (!data || !data.chats) return null;
          const chats = data.chats;

          const chatIndex = chats.findIndex((c: any) => {
            if (addMessage === null || addMessage.chat === null) return -1;
            return c.id === addMessage.chat.chatId;
          });
          if (chatIndex === -1) return;

          const chatWhereAdded = chats[chatIndex];
          chats.splice(chatIndex, 1);
          chats.unshift(chatWhereAdded);

          client.writeQuery({
            query: queries.chats,
            data: { chats: chats }
          });
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
