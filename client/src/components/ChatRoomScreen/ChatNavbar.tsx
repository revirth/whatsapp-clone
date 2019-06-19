import React from "react";
import { History } from "history";
import styled from "styled-components";
import { Button, Toolbar } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useCallback } from "react";

const Container = styled(Toolbar)`
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: var(--primary-bg);
  color: var(--primary-text);
` as typeof Toolbar;

const BackButton = styled(Button)`
  svg {
    color: var(--primary-text);
  }
` as typeof Button;

const Picture = styled.img`
  height: 40px;
  width: 40px;
  margin-top: 3px;
  margin-left: -22px;
  object-fit: cover;
  padding: 5px;
  border-radius: 50%;
`;

const Name = styled.div`
  line-height: 56px;
`;

interface ChatNavbarProps {
  history: History;
  chat?: {
    picture?: string | null;
    name?: string | null;
  };
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({ chat, history }) => {
  const navBack = useCallback(() => {
    history.replace("/chats");
  }, [history]);

  return (
    <Container>
      <BackButton onClick={navBack}>
        <ArrowBackIcon />
      </BackButton>
      {chat && chat.picture && chat.name && (
        <React.Fragment>
          <Picture data-testid="chat-picture" src={chat.picture} />
          <Name data-testid="chat-name">{chat.name}</Name>
        </React.Fragment>
      )}
    </Container>
  );
};

export default ChatNavbar;
