import React, { useState } from "react";
import styled from "styled-components";
import FormAddFriend from '../split-bills/AddFriend';
import FriendsList from '../split-bills/FriendsList';
import FormSplitBill from '../split-bills/SplitBillForm';
import { Button, Header, Heading, Row } from "../ui";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "/faces/christian-buehner-DItYlc26zVI-unsplash.jpeg",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "/faces/camp.jpg",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "/faces/christian.jpg",
    balance: 0,
  },
];

const StyledContainer = styled.div`
  min-height: 60vh;
  display: grid;
  /* place-items: center; */
  grid-template-columns: 50rem 30rem;
  column-gap: 4rem;
  align-items: start;
`

const Sidebar = styled.div`
  width: fit-content;
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 1.4rem;
    margin-bottom: 2rem;
  }
  
  li {
    display: grid;
    grid-template-columns: 4.8rem 1fr auto;
    align-items: center;
    column-gap: 1.6rem;
    padding: 1.2rem;
    border-radius: 7px;
    transition: 0.5s;

    &.selected,
    &:hover {
      background-color: var(--color-lightest);
    }
  }

  img {
    border-radius: 50%;
    width: 100%;
    grid-row: span 2;
  }

  h3 {
    grid-row: 1;
    grid-column: 2;
  }

  p {
    grid-row: 2;
    grid-column: 2;
  }

  .button {
    grid-row: span 2;
    grid-column: 3;
  }

  > .button {
    float: right;
    margin-right: 1.2rem;
  }

  .green {
    color: #66a80f;
  }

  .red {
    color: #e03131;
  }
`;

const Title = styled.h2`
  grid-column: 1 / -1;
  font-size: 2.2rem;
  text-transform: capitalize;
  letter-spacing: -0.5px;
  margin-bottom: 1.6rem;
`;

const SplitBill = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleShowAddFriend = () => {
    setShowAddFriend(show => !show);
  };

  const handleAddFriend = (friend) => {
    setFriends(friends => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleSelection = (friend) => {
    setSelectedFriend(cur => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  };

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Split Bills</Heading>
      </Row>
      <StyledContainer>
        <Sidebar>
          <Title>Friends</Title>
          <FriendsList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelection={handleSelection}
          />

          {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

          <Button variation='text' onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add friend"}
          </Button>
        </Sidebar>

        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </StyledContainer>
    </>
  );
};

export default SplitBill;
