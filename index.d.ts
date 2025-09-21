// Extend Window interface for Telegram WebApp
interface Window {
  Telegram?: {
    WebApp?: {
      DeviceStorage?: {
        setItem: (
          key: string,
          value: string,
          callback?: (error?: Error, ok?: boolean) => void
        ) => void;
        getItem: (
          key: string,
          callback?: (error?: Error, value?: string) => void
        ) => void;
      };
    };
  };
}
