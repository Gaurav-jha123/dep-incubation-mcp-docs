import { describe, expect, it, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Dropdown } from "./Dropdown"

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock)

afterEach(() => {
  cleanup()
})

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("Dropdown Component", () => {
  it("renders trigger button", () => {
    render(
      <Dropdown>
        <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Profile</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    expect(screen.getByText("Open Menu")).toBeTruthy()
  })

  it("opens menu when trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <Dropdown.Trigger>
          Open Menu
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Profile</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

   await user.click(screen.getByTestId("dropdown-trigger"))

    expect(screen.queryByTestId("dropdown-content")).toBeTruthy()
  })

it('renders dropdown items', async ()=> {
    const user = userEvent.setup()

    render(
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    await user.click(screen.getByTestId('dropdown-trigger'))

    const items = screen.getAllByTestId('dropdown-item')

    expect(items.length).toBe(2)
  })

  
  it("calls onClick when item clicked", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onClick={handleClick}>Profile</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    await user.click(screen.getByTestId("dropdown-trigger"))
    await user.click(screen.getByText("Profile"))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

    it("does not trigger click when item disabled", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item disabled onClick={handleClick}>
            Disabled Item
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    await user.click(screen.getByTestId("dropdown-trigger"))
    await user.click(screen.getByText("Disabled Item"))

    expect(handleClick).not.toHaveBeenCalled()
  })

    it("renders divider", async () => {
    const user = userEvent.setup()

    render(
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Logout</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    await user.click(screen.getByTestId("dropdown-trigger"))

    expect(screen.getByTestId("dropdown-separator")).toBeTruthy()
  })

  // Placement tests
  it("applies bottom-start placement", async () => {
    const user = userEvent.setup()

    render(
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Content placement="bottom-start">
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    await user.click(screen.getByTestId("dropdown-trigger"))

    const content = screen.getByTestId("dropdown-content")

    expect(content.className).toContain("left-0")
    expect(content.className).toContain("mt-2")
  })

  it("applies bottom-end placement", async () => {
    const user = userEvent.setup()

    render(
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Content placement="bottom-end">
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    await user.click(screen.getByTestId("dropdown-trigger"))

    const content = screen.getByTestId("dropdown-content")

    expect(content.className).toContain("right-0")
  })


  it("applies top-start placement", async () => {
    const user = userEvent.setup()

    render(
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Content placement="top-start">
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    await user.click(screen.getByTestId("dropdown-trigger"))

    const content = screen.getByTestId("dropdown-content")

    expect(content.className).toContain("bottom-full")
  })


  it("applies top-end placement", async () => {
    const user = userEvent.setup()

    render(
      <Dropdown>
        <Dropdown.Trigger>Menu</Dropdown.Trigger>
        <Dropdown.Content placement="top-end">
          <Dropdown.Item>Item</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    )

    await user.click(screen.getByTestId("dropdown-trigger"))

    const content = screen.getByTestId("dropdown-content")

    expect(content.className).toContain("right-0")
    expect(content.className).toContain("bottom-full")
  })
})