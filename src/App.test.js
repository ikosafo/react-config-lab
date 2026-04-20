import { render, screen } from "@testing-library/react";
import App from "./App";

const testConfig = {
  environment: "development",
  apiUrl: "http://localhost:3000/api",
  appName: "React Config Lab",
  logLevel: "info",
  analyticsEnabled: false
};

test("renders dashboard message", () => {
  render(<App config={testConfig} isDevelopment={true} />);
  const linkElement = screen.getByText(/Hello from my local machine/i);
  expect(linkElement).toBeInTheDocument();
});
