import { render, screen } from "@testing-library/react";

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    REACT_APP_ENV: "development",
    REACT_APP_API_URL: "http://localhost:3000/api"
  };
});

afterEach(() => {
  process.env = originalEnv;
});

test("renders dashboard message", () => {
  const App = require("./App").default;
  render(<App />);
  const linkElement = screen.getByText(/Hello from my local machine/i);
  expect(linkElement).toBeInTheDocument();
});
