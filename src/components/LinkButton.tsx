'use client';
import * as React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export interface LinkButtonProps extends ButtonProps {
  href?: string;
}

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>((props, ref) => {
  const router = useRouter();

  const navigate = React.useCallback(() => {
    router.push(props.href ?? '/');
  }, [props.href, router]);

  return <Button ref={ref} {...props} onClick={navigate} />;
});
LinkButton.displayName = 'LinkButton';

export { LinkButton };
