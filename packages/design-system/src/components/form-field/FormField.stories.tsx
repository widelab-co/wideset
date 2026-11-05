import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import { Calendar } from '../calendar/Calendar';
import { Checkbox } from '../checkbox/Checkbox';
import { DatePicker } from '../datepicker/DatePicker';
import { FileItem } from '../file-upload/FileItem';
import { FileUpload } from '../file-upload/FileUpload';
import { MultiSelect } from '../multi-select/MultiSelect';
import { RadioButton } from '../radio-button/RadioButton';
import { Select } from '../select/Select';
import { TextInput } from '../text-input/TextInput';
import { Textarea } from '../textarea/Textarea';
import StatesExample from './examples/form-field/states';
import statesSource from './examples/form-field/states?raw';
import VariantsExample from './examples/form-field/variants';
import variantsSource from './examples/form-field/variants?raw';
import { FormField } from './FormField';

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          'FormField groups a control with its label, helper text, and validation message. Use it to build a complete form field. Use a native label when the surrounding layout already provides helper text and validation relationships.',
      },
    },
  },
  title: 'Form/FormField',
  tags: ['autodocs'],
  component: FormField,
  argTypes: {
    htmlFor: {
      control: 'text',
      description: "ID of the labeled control. Match this to the control's id.",
      table: { category: 'Behavior', type: { summary: 'string' } },
    },
    variant: {
      description: 'Layout variant of the form field.',
      table: { category: 'Appearance' },
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
    className: { table: { category: 'Appearance' }, control: 'text' },
    WrapperComponent: {
      table: { category: 'Behavior' },
      control: 'radio',
      options: ['div', 'fieldset'],
    },
    errorText: { table: { category: 'Content' }, control: 'text' },
    helperText: { table: { category: 'Content' }, control: 'text' },
    helperTextId: {
      control: false,
      table: { category: 'Behavior', type: { summary: 'string' } },
    },
    children: {
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    label: { table: { category: 'Content' }, control: 'text' },
    required: {
      description:
        'Displays the required marker beside the label. Set required on the control separately.',
      table: { category: 'Behavior', type: { summary: 'boolean' } },
      control: 'boolean',
    },
    suffix: {
      table: { category: 'Content', type: { summary: 'string' } },
      control: 'text',
    },
    tooltip: { table: { category: 'Content' }, control: 'text' },
    tooltipAriaLabel: { table: { category: 'Behavior' }, control: 'text' },
    aside: { table: { category: 'Content' }, control: 'text' },
  },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Minimal example with editable controls.' } } },
  render: (args) => (
    <div className="max-w-xs">
      <FormField {...args} />
    </div>
  ),
  args: {
    label: 'Label',
    children: <TextInput id="text-input" />,
    htmlFor: 'text-input',
    variant: 'vertical',
    WrapperComponent: 'div',
    helperText: 'Helper text',
    errorText: '',
    helperTextId: '',
  },
};

export const Variants: Story = {
  ...exampleStory(VariantsExample, variantsSource),
  args: { label: '', children: null },
};

export const States: Story = {
  ...exampleStory(StatesExample, statesSource),
  args: { label: '', children: null },
};

export const Composition: Story = {
  args: { ...Default.args },
  parameters: {
    docs: {
      description: {
        story:
          'Build a settings form with radio and checkbox groups, text, file, calendar, select, date, and custom action controls. Give native controls matching IDs and connect help through aria-describedby.',
      },
    },
  },
  render: function Render() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const locationOptions = [
      { label: 'Poland', value: 'poland' },
      { label: 'Germany', value: 'germany' },
      { label: 'United States', value: 'united-states' },
      { label: 'Canada', value: 'canada' },
    ];
    return (
      <div className="gap-ws-8 flex max-w-3xl flex-col">
        <FormField
          label="Payment method"
          WrapperComponent="fieldset"
          helperText="Select one option"
          helperTextId="payment-help"
        >
          <RadioButton.Group
            aria-label="Payment method"
            aria-describedby="payment-help"
            defaultValue="card"
          >
            <RadioButton value="card" label="Card" />
            <RadioButton value="bank-transfer" label="Bank transfer" />
          </RadioButton.Group>
        </FormField>
        <FormField
          label="Agreements"
          htmlFor="terms"
          helperText="Accept if you agree"
          helperTextId="terms-help"
        >
          <Checkbox
            id="terms"
            aria-describedby="terms-help"
            label="I accept terms and conditions"
          />
        </FormField>
        <FormField
          label="Your comment"
          htmlFor="comment"
          helperText="Max 100 characters"
          helperTextId="comment-help"
        >
          <Textarea id="comment" aria-describedby="comment-help" maxLength={100} />
        </FormField>
        <FormField
          label="Actions"
          helperText="FormField can wrap custom content, not only classic inputs."
        >
          <div className="gap-ws-3 flex flex-wrap items-center">
            <Button>Approve</Button>
            <Button preset="ghost">Reject</Button>
          </div>
        </FormField>
        <FormField
          label="Attachments"
          helperText="Upload supporting assets as PDF, PNG, or JPG files."
        >
          <div className="gap-ws-7 flex flex-col">
            <FileUpload browse onBrowse={() => {}} />
            <FileItem onRemove={() => {}}>
              <FileItem.Thumbnail name="project-brief.pdf" />
              <FileItem.Title>project-brief.pdf</FileItem.Title>
              <FileItem.Description>2.4MB</FileItem.Description>
            </FileItem>
            <FileItem isLoading>
              <FileItem.Thumbnail name="homepage-mockup.png" />
              <FileItem.Title>homepage-mockup.png</FileItem.Title>
              <FileItem.Description>8.1MB{'12 seconds left'}</FileItem.Description>
            </FileItem>
          </div>
        </FormField>
        <FormField label="Publish date" helperText="Choose when this content should go live.">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            footer={selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` : 'Pick a date'}
          />
        </FormField>
        <FormField
          label="Country"
          htmlFor="country-select"
          helperText="Select your billing country."
        >
          <Select
            id="country-select"
            className="w-full"
            options={locationOptions}
            placeholder="Select country"
            defaultValue="poland"
          />
        </FormField>
        <FormField
          label="Markets"
          htmlFor="markets-select"
          helperText="Select one or more launch markets."
        >
          <MultiSelect
            id="markets-select"
            className="w-full"
            options={locationOptions}
            placeholder="Select markets"
            defaultValue={['poland', 'germany']}
            hasSearch
            hasSelectAll
          />
        </FormField>
        <FormField label="Due date">
          <DatePicker
            className="w-full"
            aria-label="Due date"
            placeholder="Pick a date"
            defaultSelected="2026-05-20"
          />
        </FormField>
      </div>
    );
  },
};
