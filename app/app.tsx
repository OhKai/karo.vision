import ResizeObserver from "./resize-observer";

const App = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <ResizeObserver>{children}</ResizeObserver>;
};

export default App;
