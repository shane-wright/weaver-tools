import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import ChatDialog from "./ChatDialog";

export default {
title: "Components/ChatDialog",
component: ChatDialog,
} as Meta;

const Template: StoryFn = (args) => <ChatDialog {...args} />;

export const Default = Template.bind({});
Default.args = {};

