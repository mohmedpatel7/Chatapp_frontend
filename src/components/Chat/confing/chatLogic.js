export const getSender = (loggedUserId, users) => {
  const sender = users.find((user) => user._id !== loggedUserId);
  return sender?.name || "Unknown";
};

export const getSenderFull = (loggedUserId, users) => {
  const sender = users.find((user) => user._id !== loggedUserId);
  return sender || { name: "Unknown", pic: "", email: "" }; // Return full user object with default values
};

//Logic for cheaking that user is other user not login user.
export const sameSender = (messages, m, i, userId) => {
  // Check if the next message exists and if the sender is defined
  const nextMessageSenderId = messages[i + 1]?.sender?._id;
  const currentSenderId = m.sender?._id;

  return (
    (i < messages.length - 1 && nextMessageSenderId !== currentSenderId) ||
    (nextMessageSenderId === undefined && currentSenderId !== userId)
  );
};

export const isLastMessage = (messages, i, userId) => {
  // Check if the last message exists and if the sender is defined
  const lastMessageSenderId = messages[messages.length - 1]?.sender?._id;
  const currentSenderId = messages[i]?.sender?._id;

  return (
    i === messages.length - 1 &&
    lastMessageSenderId !== userId &&
    lastMessageSenderId !== undefined
  );
};

//Margin setup
export const margin = (messages, m, i, userId) => {
  const nextMessageSenderId = messages[i + 1]?.sender?._id;
  const currentSenderId = m.sender?._id;

  if (
    i < messages.length - 1 &&
    nextMessageSenderId === currentSenderId &&
    currentSenderId !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      nextMessageSenderId !== currentSenderId &&
      currentSenderId !== userId) ||
    (i === messages.length - 1 && currentSenderId !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const sameUser = (messages, m, i) => {
  // Check if the previous message exists and if the sender is defined
  const previousMessageSenderId = messages[i - 1]?.sender?._id;
  const currentSenderId = m.sender?._id;

  return i > 0 && previousMessageSenderId === currentSenderId;
};
