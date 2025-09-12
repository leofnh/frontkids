interface MainProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export function Main({ children, className, style }: MainProps) {
  const combinedClassName = `w-full min-h-screen text-app-text-color ${className}`;
  return (
    <main className={combinedClassName} style={style}>
      {children}
    </main>
  );
}
