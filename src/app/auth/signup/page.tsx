import { Suspense } from 'react';
import AuthUI from '@/components/AuthUI';

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <AuthUI mode="signup" />
    </Suspense>
  );
}
