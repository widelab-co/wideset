import { cn } from 'src/lib/utils';

import { useNavigationBarItemContext } from './NavigationBar.context';
import type { NavigationBarIconProps } from './NavigationBar.types';
import { navigationBarIconVariants } from './NavigationBar.variants';

const NavigationBarIcon = ({ icon: Icon, className, ...props }: NavigationBarIconProps) => {
  const { active } = useNavigationBarItemContext();

  return (
    <Icon
      aria-hidden="true"
      focusable="false"
      data-slot="navigation-bar-icon"
      className={cn(navigationBarIconVariants({ active }), className)}
      {...props}
    />
  );
};

NavigationBarIcon.displayName = 'NavigationBar.Icon';

export { NavigationBarIcon };
