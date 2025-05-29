interface BackgroundWidgetProps {
  title: string;
  message: React.ReactNode;
  component: React.ReactNode;
}

export const BasePage = ({
  title,
  message,
  component,
}: BackgroundWidgetProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 max-w-xl">
      <div className="bg-gray-100 rounded-lg shadow-md md:py-16 py-12 md:px-12 px-5 text-center">
        <div className="mb-6 flex items-center justify-center">{component}</div>
        <h2 className="text-xl font-bold text-gray-600 mb-6">{title}</h2>
        <div className="text-sm font-semibold text-gray-500">{message}</div>
      </div>
    </div>
  );
};
