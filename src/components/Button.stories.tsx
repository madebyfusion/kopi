import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from './Button';

export default {
  title: 'Button Component',
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Primary',
  variant: 'primary',
};
