import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../../tests/test-utils";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders company name", () => {
    render(<Footer />);
    expect(screen.getByText("Auto Shop Demo")).toBeInTheDocument();
  });

  it("renders company tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/serving dallas.*since 1983/i)).toBeInTheDocument();
  });

  it("renders business address", () => {
    render(<Footer />);
    expect(screen.getByText(/123 main street/i)).toBeInTheDocument();
    expect(screen.getByText(/dallas, tx 75201/i)).toBeInTheDocument();
  });

  it("renders phone number with tel link", () => {
    render(<Footer />);
    const phoneLink = screen.getByRole("link", { name: /555-123-4567/i });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute("href", "tel:555-123-4567");
  });

  it("renders email with mailto link", () => {
    render(<Footer />);
    const emailLink = screen.getByRole("link", {
      name: /info@autoshopdemo.com/i,
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:info@autoshopdemo.com");
  });

  it("renders business hours", () => {
    render(<Footer />);
    expect(screen.getByText(/monday - friday/i)).toBeInTheDocument();
    expect(screen.getByText(/8:00 am - 6:00 pm/i)).toBeInTheDocument();
    expect(screen.getByText(/saturday/i)).toBeInTheDocument();
    expect(screen.getByText(/9:00 am - 4:00 pm/i)).toBeInTheDocument();
    expect(screen.getByText(/sunday/i)).toBeInTheDocument();
    expect(screen.getByText(/closed/i)).toBeInTheDocument();
  });

  it("renders quick links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /brands/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /maintenance tips/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /coupons/i })).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`${currentYear} auto shop demo`, "i"))
    ).toBeInTheDocument();
  });
});
