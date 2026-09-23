import { useCookie } from '#app';
import { computed } from 'vue';

export type BusinessType = 'internTional' | 'uniVerse';

export const useBusinessContext = () => {
  const activeBusiness = useCookie<BusinessType>('active_business', {
    default: () => 'internTional',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
  
  const setBusiness = (business: BusinessType) => {
    activeBusiness.value = business;
  };

  const businessInfo = computed(() => {
    if (activeBusiness.value === 'internTional') {
      return {
        name: 'InternTional',
        tagline: 'Medical Laboratory Ecosystem',
        theme: 'bg-brand',
        textTheme: 'text-brand',
        chartColor: 'rgba(39, 98, 140, 0.8)', // #27628C
        chartBorder: 'rgba(39, 98, 140, 1)',
        icon: 'FlaskConical'
      };
    }
    return {
      name: 'UniVerse',
      tagline: 'Student Hub & Community',
      theme: 'bg-indigo-600',
      textTheme: 'text-indigo-600',
      chartColor: 'rgba(79, 70, 229, 0.8)', // indigo-600
      chartBorder: 'rgba(79, 70, 229, 1)',
      icon: 'GraduationCap'
    };
  });

  const sidebarMenu = computed(() => {
    if (activeBusiness.value === 'internTional') {
      return [
        { name: 'Overview', path: '/overview', icon: 'LayoutDashboard' },
        { name: 'Analytics', path: '/analytics', icon: 'BarChart2' },
        { name: 'Pending Users', path: '/', icon: 'Users' },
        { name: 'Active Users', path: '/users', icon: 'Users' },
        { name: 'Roles & Perms', path: '/roles', icon: 'Shield' },
        { name: 'Vault Management', path: '/vault', icon: 'Folder' },
        { name: 'Career Hub', path: '/jobs', icon: 'Briefcase' },
        { name: 'Content Mgt', path: '/content', icon: 'Layers' },
        { name: 'Enquiries', path: '/enquiries', icon: 'MessageSquare' },
        { name: 'Subscriptions', path: '/subscriptions', icon: 'CreditCard' },
        { name: 'Payments', path: '/payments', icon: 'Wallet' },
      ];
    }
    return [
      { name: 'Overview', path: '/overview', icon: 'LayoutDashboard' },
      { name: 'Analytics', path: '/analytics', icon: 'BarChart2' },
      { name: 'Universities', path: '/universities', icon: 'Building2' },
      { name: 'Students', path: '/students', icon: 'Users' },
      { name: 'Programs', path: '/programs', icon: 'GraduationCap' },
      { name: 'Events', path: '/events', icon: 'Calendar' },
      { name: 'Content Mgt', path: '/content', icon: 'Layers' },
      { name: 'Subscriptions', path: '/subscriptions', icon: 'CreditCard' },
      { name: 'Payments', path: '/payments', icon: 'Wallet' },
    ];
  });

  return {
    activeBusiness,
    setBusiness,
    businessInfo,
    sidebarMenu,
  };
};
