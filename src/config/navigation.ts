export { default as HomeIcon } from '@/assets/icons/home.svg'
export { default as OfferIcon } from '@/assets/icons/home-01.svg'
export { default as PackageIcon } from '@/assets/icons/package.svg'
export { default as PaymentIcon } from '@/assets/icons/payment-02.svg'
export { default as ShareIcon } from '@/assets/icons/share-01.svg'
export { default as ProfileIcon } from '@/assets/icons/profile.svg'
export { default as ReportIcon } from '@/assets/icons/analytic-up.svg'
export { default as BellIcon } from '@/assets/icons/bell.svg'


export interface NavItem {
  name: string;
  path: string;
  icon: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    group: 'main',
    items: [
      {
        name: 'Home',
        path: '/',
        icon: 'HomeIcon'
      },
      {
        name: 'Offer',
        path: '/offer',
        icon: 'OfferIcon'
      },
      {
        name: 'Package',
        path: '/package',
        icon: 'PackageIcon'
      }
    ]
  },
  {
    group: 'activity',
    items: [
      {
        name: 'Task',
        path: '/task',
        icon: 'ProfileIcon'
      },
      {
        name: 'Referral',
        path: '/referral',
        icon: 'ShareIcon'
      },
      {
        name: 'Accounting',
        path: '/accounting',
        icon: 'PaymentIcon'
      },
      {
        name: 'Report',
        path: '/report',
        icon: 'ReportIcon'
      }
    ]
  },
  {
    group: 'others',
    items: [
      {
        name: 'Notification',
        path: '/notification',
        icon: 'BellIcon'
      },
      {
        name: 'My Account',
        path: '/my-account',
        icon: 'ProfileIcon'
      }
    ]
  }
];

export const groupedNavItems = navGroups.reduce((acc, group) => {
  acc[group.group] = group.items;
  return acc;
}, {} as Record<string, NavItem[]>);