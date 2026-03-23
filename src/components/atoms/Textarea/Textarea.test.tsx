import { describe, expect, it, afterEach} from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Textarea } from "./Textarea"

afterEach(() => {
  cleanup()
})

describe("Textarea Component", () => {

  it("renders textarea", () => {
    render(<Textarea />)

    const textarea = screen.getByTestId("textarea")

    expect(textarea).toBeTruthy()
    expect(textarea.className.includes("border-neutral-700")).toBe(true)
  })

  it("renders label", () => {
    render(<Textarea label="Message" />)

    expect(screen.getByText("Message")).toBeTruthy()
  })

  it("renders helper text", () => {
    render(
      <Textarea
        label="Description"
        helperText="Maximum 500 characters"
      />
    )

    const helperText = screen.getByText("Maximum 500 characters")

    expect(helperText).toBeTruthy()
  })

  it("renders error message", () => {
    render(
      <Textarea
        label="Description"
        error="Description is required"
      />
    )

    const errorText = screen.getByText("Description is required")

    expect(errorText).toBeTruthy()
  })

  it("allows typing", async () => {
    const user = userEvent.setup()

    render(<Textarea />)

    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement

    await user.type(textarea, "Hello world")

    expect(textarea.value).toBe("Hello world")
  })

  it("should be disabled", () => {
    render(<Textarea disabled />)

    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement

    expect(textarea.disabled).toBe(true)
  })

  it("shows required indicator", () => {
    render(<Textarea label="Comment" required />)

    const requiredIndicator = screen.getByText("*")

    expect(requiredIndicator).not.toBeNull()
  })

  it("renders with default rows", () => {
    render(<Textarea />)

    const textarea = screen.getByTestId("textarea")

    expect(textarea.getAttribute("rows")).toBe("3")
  })
})