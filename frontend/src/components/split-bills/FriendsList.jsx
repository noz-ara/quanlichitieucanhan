import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Friend from './Friend';

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 1.4rem;
  margin-bottom: 2rem;
  /* border: 1px solid var(--color-silver-100); */
`;

const FriendsList = ({ friends, onSelection, selectedFriend }) => {
    const [updatedFriends, setUpdatedFriends] = useState(friends);

     // Update updatedFriends when friends prop changes
     useEffect(() => {
        setUpdatedFriends(friends);
    }, [friends]);

    const handleRemoveFriend = (friendId) => {
        setUpdatedFriends(prevFriends => prevFriends.filter((friend) => friend.id !== friendId));
    };
    

    return (
        <List>
            {updatedFriends.map((friend) => (
                <Friend
                    friend={friend}
                    key={friend.id}
                    selectedFriend={selectedFriend}
                    onSelection={onSelection}
                    onRemove={handleRemoveFriend}
                />
            ))}
        </List>
    );
};

export default FriendsList;
