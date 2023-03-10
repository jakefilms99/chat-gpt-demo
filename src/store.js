import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [
    {
      id: 1,
      name: "Startup Analyzer",
      role: "Idea to analysis",
      picture: "./images/profile-pic-1.png",
      messages: [
        {
          role: "system",
          content:
            "Act as a startup analyzer trying to help startup founders with their ideas,\n \
            by providing a report on the market, trends, features to add, etc, based on the idea they provide you with.\n \
            To help the founder, you can ask questions, give advice, or make suggestions.",
        },
        {
          role: "assistant",
          content:
            "Tell me a bit about your startup idea, I'll help you analyze it!",
        },
      ],
    },
    {
      id: 2,
      name: "Email Writer",
      role: "Draft tailored emails",
      picture: "./images/profile-pic-2.png",
      messages: [
        {
          role: "system",
          content:
            "Act as a communications professional, writing emails for the user, based on their requirements.\n \
            The user may provide the points and tone they'd like the email to be written in",
        },
        {
          role: "assistant",
          content:
            "If you can describe the email you want to write and the desired tone, I can help you write it! Include any specific points you want to make.",
        },
      ],
    },
    {
      id: 3,
      name: "Script Generator",
      role: "Perfect for short-form",
      picture: "./images/profile-pic-3.png",
      messages: [
        {
          role: "system",
          content:
            "Act as a content creator, writing scripts for the user, based on their requirements.\n \
            The user may provide the topic, tone, and talking points.",
        },
        {
          role: "assistant",
          content:
            "Let's write a script for your next video! Tell me the topic, tone, and any specific talking points.",
        },
      ],
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { contactId, message } = action.payload;
      const contact = state.contacts.find((c) => c.id === contactId);
      if (contact) {
        contact.messages.push(message);
      }
    },
  },
});

const store = configureStore({
  reducer: chatSlice.reducer,
});

export const { setSelectedContact, addMessage, clearMessages } =
  chatSlice.actions;

export default store;
