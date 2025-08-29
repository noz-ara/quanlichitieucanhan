import React from "react";
import styled from "styled-components";
import { Button, ButtonIcon } from "../ui";
import { RxCross2 } from "react-icons/rx";

const ListItem = styled.li`
  display: grid;
  grid-template-columns: 4.8rem 1fr auto auto;
  align-items: center;
  column-gap: 1.6rem;
  padding: 1.2rem;
  border-radius: 7px;
  transition: 0.5s;

  &.selected,
  &:hover {
    background-color: var(--color-brand-50);
  }
`;

const Image = styled.img`
  border-radius: 50%;
  width: 100%;
  grid-row: span 2;
`;

const Heading = styled.h3`
  grid-row: 1;
  grid-column: 2;
`;

const Paragraph = styled.p`
  grid-row: 2;
  grid-column: 2;
`;

const SplitButton = styled(Button)`
  grid-row: span 2;
  grid-column: 3;
`;

const RemoveButton = styled(Button)`
  grid-row: span 2;
  grid-column: 4;
`;

const Friend = ({ friend, onSelection, onRemove, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <ListItem className={isSelected ? "selected" : ""} onClick={() => onSelection(friend)}>
      <Image src={friend.image} alt={friend.name} />
      <Heading>{friend.name}</Heading>

      {friend.balance < 0 && (
        <Paragraph className="red">
          You owe {friend.name} {Math.abs(friend.balance)}₹
        </Paragraph>
      )}
      {friend.balance > 0 && (
        <Paragraph className="green">
          {friend.name} owes you {Math.abs(friend.balance)}₹
        </Paragraph>
      )}
      {friend.balance === 0 && <Paragraph>You and {friend.name} are even</Paragraph>}

      <ButtonIcon size="sm" color='red' onClick={() => onRemove(friend.id)}><RxCross2 /></ButtonIcon>
    </ListItem>
  );
};

export default Friend;
