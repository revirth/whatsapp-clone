import { GraphQLDateTime } from "graphql-iso-date";
import { Message, chats, messages } from "../db";
import { Resolvers } from "../types/graphql";

const resolvers: Resolvers = {
  Date: GraphQLDateTime,

  Message: {
    chat(message) {
      return chats.find(c => c.messages.some(m => m === message.id)) || null;
    }
  },

  Chat: {
    messages(chat) {
      return messages.filter(m => chat.messages.includes(m.id));
    },

    lastMessage(chat) {
      const lastMessage = chat.messages[chat.messages.length - 1];

      return messages.find(m => m.id === lastMessage) || null;
    }
  },

  Query: {
    chats() {
      return chats;
    },

    chat(root, { chatId }) {
      return chats.find(c => c.id === chatId) || null;
    }
  },

  Mutation: {
    addMessage(root, { chatId, content }, { pubsub }) {
      const chatIndex = chats.findIndex(c => c.id === chatId);

      if (chatIndex === -1) return null;

      const chat = chats[chatIndex];
      const lastMessageId = chat.messages[chat.messages.length - 1];
      const messageId = String(Number(lastMessageId) + 1);
      const message: Message = {
        id: messageId,
        createdAt: new Date(),
        content
      };

      messages.push(message);
      chat.messages.push(messageId);

      chats.splice(chatIndex, 1);
      chats.unshift(chat);

      pubsub.publish("messageAdded", {
        messageAdded: message
      });

      return message;
    }
  },

  Subscription: {
    messageAdded: {
      subscribe: (root, args, { pubsub }) =>
        pubsub.asyncIterator("messageAdded")
    }
  }
};

export default resolvers;
