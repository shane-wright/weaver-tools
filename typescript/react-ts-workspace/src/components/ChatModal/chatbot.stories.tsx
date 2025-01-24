import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import ChatModal from "./ChatModal";

export default {
  title: "Components/ChatModal",
  component: ChatModal,
} as Meta;

const Template: StoryFn = (args) => <ChatModal {...args} />;

export const Default = Template.bind({});
Default.args = {};