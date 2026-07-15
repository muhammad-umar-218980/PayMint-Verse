import { Suspense } from 'react';
import AuthUI from '@/components/AuthUI';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthUI mode="login" />
    </Suspense>
  );
}
