import type { Meta, StoryObj } from "@storybook/react-vite";
import LoginForm from "./login-form";
import { MemoryRouter } from "react-router-dom";
import { within } from "@storybook/testing-library";
import { userEvent } from "@storybook/testing-library";
// import { userEvent, within } from "@storybook/testing-library";

const meta: Meta<typeof LoginForm> = {
  title: "Forms/LoginForm",
  component: LoginForm,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="flex justify-center items-center min-h-screen">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LoginForm>;

/** Default empty form */
export const Default: Story = {};

/** Invalid email only */
export const InvalidEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByPlaceholderText("Enter email");
    const password = canvas.getByPlaceholderText("Enter password");

    await userEvent.type(email, "invalid-email");
    await userEvent.type(password, "ValidPass123!");
  },
};

/** Invalid password only */
export const InvalidPassword: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByPlaceholderText("Enter email");
    const password = canvas.getByPlaceholderText("Enter password");

    await userEvent.type(email, "user@example.com");
    await userEvent.type(password, "123"); // invalid, assuming min 6-8 chars
  },
};

/** Both email and password invalid */
export const InvalidBoth: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByPlaceholderText("Enter email");
    const password = canvas.getByPlaceholderText("Enter password");

    await userEvent.type(email, "invalid-email");
    await userEvent.type(password, "123"); // invalid
  },
};

/** Disabled submit button: invalid email but valid password */
export const DisabledButtonInvalidEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByPlaceholderText("Enter email");
    const password = canvas.getByPlaceholderText("Enter password");
    const submitButton = canvas.getByTestId("login-submit-btn");

    await userEvent.type(email, "invalid-email");
    await userEvent.type(password, "ValidPass123!");

    // submit button should be disabled
    if (!submitButton.hasAttribute("disabled")) {
      throw new Error("Submit button is not disabled with invalid email");
    }
  },
};

/** Valid login (ready to submit) */
export const ValidLogin: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByPlaceholderText("Enter email");
    const password = canvas.getByPlaceholderText("Enter password");

    await userEvent.type(email, "user@example.com");
    await userEvent.type(password, "ValidPass123!");
  },
};