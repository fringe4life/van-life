import { describe, expect, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { VanType } from "~/db/enums";
import { VanForm } from "./van-form";

type VanFormProps = ComponentProps<typeof VanForm>;

const noopSubmit: VanFormProps["onSubmit"] = () => undefined;

const renderVanForm = (props: Partial<VanFormProps> = {}) => {
  const router = createMemoryRouter([
    {
      element: (
        <VanForm
          fetcherState="idle"
          isPending={false}
          onSubmit={noopSubmit}
          {...props}
        />
      ),
      path: "/",
    },
  ]);

  return render(<RouterProvider router={router} />);
};

describe("VanForm", () => {
  it("renders labeled fields, type options, and an enabled submit on the idle empty form", () => {
    renderVanForm();

    expect(screen.getByRole("form", { name: "Add Van" })).toHaveAttribute(
      "method",
      "post"
    );
    expect(
      screen.getByRole("heading", { name: "Add Van" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Price ($/day)")).toHaveAttribute(
      "type",
      "number"
    );
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText("Image URL")).toHaveAttribute("type", "url");
    expect(screen.getByLabelText("Type")).toHaveDisplayValue("");
    expect(screen.getByLabelText("Discount (%)")).toHaveValue(0);

    const typeListId = screen.getByLabelText("Type").getAttribute("list");
    expect(typeListId).toBeTruthy();
    const typeList = document.getElementById(typeListId ?? "");
    expect(typeList).not.toBeNull();
    expect(typeList).toContainHTML(`value="${VanType.SIMPLE}"`);
    expect(typeList).toContainHTML(`value="${VanType.RUGGED}"`);
    expect(typeList).toContainHTML(`value="${VanType.LUXURY}"`);

    expect(screen.getByRole("button", { name: "Add your van" })).toBeEnabled();
  });

  it("echoes formDataDefaults into the fields", () => {
    renderVanForm({
      formDataDefaults: {
        description: "A rugged weekender",
        discount: "10",
        imageUrl: "https://images.unsplash.com/van.jpg",
        name: "Silver Bullet",
        price: "80",
        type: VanType.SIMPLE,
      },
    });

    expect(screen.getByLabelText("Name")).toHaveValue("Silver Bullet");
    expect(screen.getByLabelText("Price ($/day)")).toHaveValue(80);
    expect(screen.getByLabelText("Description")).toHaveValue(
      "A rugged weekender"
    );
    expect(screen.getByLabelText("Image URL")).toHaveValue(
      "https://images.unsplash.com/van.jpg"
    );
    expect(screen.getByLabelText("Type")).toHaveValue(VanType.SIMPLE);
    expect(screen.getByLabelText("Discount (%)")).toHaveValue(10);
  });

  it("surfaces field errors on the matching controls", () => {
    renderVanForm({
      fieldErrors: {
        name: "Name is required",
        price: "Price must be a number",
      },
    });

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Price must be a number")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInvalid();
    expect(screen.getByLabelText("Price ($/day)")).toBeInvalid();
    expect(screen.getByLabelText("Description")).toBeValid();
  });

  it("announces a form-level error on the form", () => {
    renderVanForm({ formError: "Could not save van" });

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Could not save van");
    expect(screen.getByRole("form", { name: "Add Van" })).toHaveAttribute(
      "aria-describedby",
      alert.id
    );
  });

  it("disables submit while the fetcher or transition is pending", () => {
    const { unmount } = renderVanForm({ fetcherState: "submitting" });
    expect(screen.getByRole("button", { name: "Add your van" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Add your van" })
    ).toHaveAttribute("aria-busy", "true");
    unmount();

    renderVanForm({ isPending: true });
    expect(screen.getByRole("button", { name: "Add your van" })).toBeDisabled();
  });

  it("disables submit after success or error until auto-idle", () => {
    const { unmount } = renderVanForm({ ok: true });
    expect(screen.getByRole("button", { name: "Add your van" })).toBeDisabled();
    unmount();

    renderVanForm({ ok: false });
    expect(screen.getByRole("button", { name: "Add your van" })).toBeDisabled();
  });

  it("calls onSubmit when the user clicks Add your van", async () => {
    const user = userEvent.setup();
    const onSubmit = mock<VanFormProps["onSubmit"]>((event) => {
      event.preventDefault();
    });

    renderVanForm({ onSubmit });
    await user.click(screen.getByRole("button", { name: "Add your van" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
