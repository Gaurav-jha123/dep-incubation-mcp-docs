import type { Meta, StoryObj } from "@storybook/react-vite";
import LoginForm from "./login-form";
import { QueryProvider } from "@/providers/query-provider";
import { MemoryRouter } from "react-router-dom";
import { within } from "@storybook/testing-library";
import { userEvent } from "@storybook/testing-library";
// import { userEvent, within } from "@storybook/testing-library";

const meta: Meta<typeof LoginForm> = {
  title: "Forms/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "LoginForm documents the authentication entry flow, including empty, invalid, and ready-to-submit form states using Storybook play interactions.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryProvider>
        <MemoryRouter>
          <div className="flex justify-center items-center min-h-screen">
            <Story />
          </div>
        </MemoryRouter>
      </QueryProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LoginForm>;

async function fillValidCredentials(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const email = canvas.getByPlaceholderText("Enter email");
  const password = canvas.getByPlaceholderText("Enter password");

  await userEvent.clear(email);
  await userEvent.clear(password);
  await userEvent.type(email, "user@example.com");
  await userEvent.type(password, "ValidPass123!");

  return { canvas, email, password };
}

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
    await fillValidCredentials(canvasElement);
  },
};

/** Focus preview for the first field */
export const FocusedEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByPlaceholderText("Enter email");

    await userEvent.click(email);
  },
};

/** Focus preview for the password field */
export const FocusedPassword: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByPlaceholderText("Enter password");

    await userEvent.click(password);
  },
};

/** Hover preview on the submit button after the form becomes valid */
export const HoverSubmitReady: Story = {
  play: async ({ canvasElement }) => {
    const { canvas } = await fillValidCredentials(canvasElement);
    const submitButton = canvas.getByTestId("login-submit-btn");

    await userEvent.hover(submitButton);
  },
};
