import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { OutcomeState } from "./index";

type OutcomeStateProps = ComponentProps<typeof OutcomeState>;

const renderOutcomeState = (props: OutcomeStateProps) => {
  const router = createMemoryRouter([
    {
      element: <OutcomeState {...props} />,
      path: "/",
    },
  ]);

  return render(<RouterProvider router={router} />);
};

describe("OutcomeState", () => {
  it("announces error kind as an assertive alert with a visible title", () => {
    renderOutcomeState({ kind: "error", title: "Something went wrong" });

    const alert = screen.getByRole("alert");
    const heading = screen.getByRole("heading", {
      name: "Something went wrong",
    });

    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(alert).toHaveAttribute("aria-atomic", "true");
    expect(alert).toHaveAttribute("aria-labelledby", heading.id);
    expect(heading).toBeInTheDocument();
  });

  it("announces empty kind as a polite status", () => {
    renderOutcomeState({ kind: "empty", title: "No vans yet" });

    const status = screen.getByRole("status");

    expect(status).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("heading", { name: "No vans yet" })
    ).toBeInTheDocument();
  });

  it("announces no-match kind as a polite status", () => {
    renderOutcomeState({ kind: "no-match", title: "No matching vans" });

    const status = screen.getByRole("status");

    expect(status).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("heading", { name: "No matching vans" })
    ).toBeInTheDocument();
  });

  it("associates a description with the section when one is provided", () => {
    renderOutcomeState({
      description: "Try listing a van to get started.",
      kind: "empty",
      title: "No vans yet",
    });

    const status = screen.getByRole("status");
    const description = screen.getByText("Try listing a van to get started.");
    const descriptionId = status.getAttribute("aria-describedby");

    expect(description).toBeInTheDocument();
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId ?? "")).toBe(description);
  });

  it("omits aria-describedby when there is no description", () => {
    renderOutcomeState({ kind: "empty", title: "No vans yet" });

    expect(
      screen.getByRole("status").getAttribute("aria-describedby")
    ).toBeNull();
  });

  it("renders metadata in an aside", () => {
    renderOutcomeState({
      kind: "empty",
      metadata: "Last synced 2 hours ago",
      title: "No vans yet",
    });

    expect(
      screen.getByText("Last synced 2 hours ago").closest("aside")
    ).toBeInTheDocument();
  });

  it("renders a primary reload action as a link with the given href", () => {
    renderOutcomeState({
      kind: "error",
      primaryAction: { kind: "reload", label: "Try again", to: "/vans" },
      title: "Something went wrong",
    });

    expect(screen.getByRole("link", { name: "Try again" })).toHaveAttribute(
      "href",
      "/vans"
    );
    expect(
      screen.getByRole("navigation", { name: "Recovery actions" })
    ).toBeInTheDocument();
  });

  it("omits the metadata aside and recovery nav when there is no metadata or actions", () => {
    renderOutcomeState({ kind: "empty", title: "No vans yet" });

    expect(
      screen.getByRole("complementary", { name: "Empty state" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("complementary")).toHaveLength(1);
    expect(
      screen.queryByRole("navigation", { name: "Recovery actions" })
    ).not.toBeInTheDocument();
  });
});
