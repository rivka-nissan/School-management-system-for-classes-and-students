import { Alert, Spin } from 'antd';

interface Props {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  children: React.ReactNode;
}

export function QueryWrapper({ isLoading, isError, errorMessage, children }: Props) {
  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (isError) return <Alert type="error" message={errorMessage ?? 'שגיאה בטעינת הנתונים'} />;
  return <>{children}</>;
}
