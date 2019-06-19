import { DataProxy } from "apollo-cache";
import ApolloClient from "apollo-client";
import { useMessageAddedSubscription, MessageFragment } from "../graphql/types";
import { defaultDataIdFromObject } from "apollo-cache-inmemory";
import * as fragments from "../graphql/fragments";
import * as queries from "../graphql/queries";

type Client = ApolloClient<any> | DataProxy;

export const useCacheService = () => {
  useMessageAddedSubscription({
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      if (data) writeMessage(client, data.messageAdded);
    }
  });
};

export const writeMessage = (client: Client, message: MessageFragment) => {
  type FullChat = { [key: string]: any };
  let fullChat;
  const chatIdFromStore = defaultDataIdFromObject(message.chat);
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
  if (fullChat.messages.some((m: any) => m.id === message.id)) return;

  fullChat.messages.push(message);
  fullChat.lastMessage = message;

  client.writeFragment({
    id: chatIdFromStore,
    fragment: fragments.fullchat,
    fragmentName: "FullChat",
    data: fullChat
  });

  let data;
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
    if (message === null || message.chat === null) return -1;
    return c.id === message.chat.id;
  });
  if (chatIndex === -1) return;

  const chatWhereAdded = chats[chatIndex];
  chats.splice(chatIndex, 1);
  chats.unshift(chatWhereAdded);

  client.writeQuery({
    query: queries.chats,
    data: { chats: chats }
  });
};
