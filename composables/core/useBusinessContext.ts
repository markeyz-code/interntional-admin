import { useCookie } from '#app';
import { computed } from 'vue';
import { useAuth } from './useAuth';

export type BusinessType = 'internTional' | 'uniVerse';

export const useBusinessContext = () => {
  const activeBusiness = useCookie<BusinessType>('active_business', {
    default: () => 'internTional',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
  
  const { user } = useAuth();
  
  const canSwitchBusiness = computed(() => {
    if (!user.value || !user.value.adminPlatform) return true;
    return user.value.adminPlatform === 'both';
  });

  // Automatically enforce business if restricted
  if (user.value && user.value.adminPlatform && user.value.adminPlatform !== 'both') {
    if (user.value.adminPlatform === 'interntional' && activeBusiness.value !== 'internTional') {
      activeBusiness.value = 'internTional';
    } else if (user.value.adminPlatform === 'universe' && activeBusiness.value !== 'uniVerse') {
      activeBusiness.value = 'uniVerse';
    }
  }

  const setBusiness = (business: BusinessType) => {
    if (!canSwitchBusiness.value) return;
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
    const rawMenu = activeBusiness.value === 'internTional' ? [
      { name: 'Overview', path: '/overview', icon: 'LayoutDashboard' }, // everyone can see overview
      { name: 'Analytics', path: '/analytics', icon: 'BarChart2', permission: 'view_analytics' },
      { name: 'Pending Users', path: '/', icon: 'Users', permission: 'manage_users' },
      { name: 'Active Users', path: '/users', icon: 'Users', permission: 'manage_users' },
      { name: 'Roles & Perms', path: '/roles', icon: 'Shield', permission: 'manage_roles' },
      { name: 'Vault Management', path: '/vault', icon: 'Folder', permission: 'manage_content' },
      { name: 'Career Hub', path: '/jobs', icon: 'Briefcase', permission: 'manage_jobs' },
      { name: 'Mentorship', path: '/mentorship', icon: 'Users', permission: 'manage_users' },
      { name: 'Courses', path: '/courses', icon: 'BookOpen', permission: 'manage_content' },
      { name: 'Marketplace', path: '/marketplace', icon: 'ShoppingBag', permission: 'manage_content' },
      { name: 'Bounties', path: '/bounties', icon: 'Target', permission: 'manage_content' },
      { name: 'Events', path: '/events', icon: 'Calendar', permission: 'manage_content' },
      { name: 'Content Mgt', path: '/content', icon: 'Layers', permission: 'manage_content' },
      { name: 'Forms', path: '/forms', icon: 'ClipboardList', permission: 'manage_content' },
      { name: 'Enquiries', path: '/enquiries', icon: 'MessageSquare', permission: 'manage_enquiries' },
      { name: 'Notifications', path: '/notifications', icon: 'Bell', permission: 'manage_users' },
      { name: 'Subscriptions', path: '/subscriptions', icon: 'CreditCard', permission: 'manage_subscriptions' },
      { name: 'Payments', path: '/payments', icon: 'Wallet', permission: 'manage_payments' },
    ] : [
      { name: 'Overview', path: '/overview', icon: 'LayoutDashboard' },
      { name: 'Analytics', path: '/analytics', icon: 'BarChart2', permission: 'view_analytics' },
      { name: 'Universities', path: '/universities', icon: 'Building2', permission: 'manage_users' },
      { name: 'Students', path: '/students', icon: 'Users', permission: 'manage_users' },
      { name: 'Programs', path: '/programs', icon: 'GraduationCap', permission: 'manage_content' },
      { name: 'Roles & Perms', path: '/roles', icon: 'Shield', permission: 'manage_roles' },
      { name: 'Vault Management', path: '/vault', icon: 'Folder', permission: 'manage_content' },
      { name: 'Career Hub', path: '/jobs', icon: 'Briefcase', permission: 'manage_jobs' },
      { name: 'Mentorship', path: '/mentorship', icon: 'Users', permission: 'manage_users' },
      { name: 'Courses', path: '/courses', icon: 'BookOpen', permission: 'manage_content' },
      { name: 'Marketplace', path: '/marketplace', icon: 'ShoppingBag', permission: 'manage_content' },
      { name: 'Bounties', path: '/bounties', icon: 'Target', permission: 'manage_content' },
      { name: 'Events', path: '/events', icon: 'Calendar', permission: 'manage_content' },
      { name: 'Content Mgt', path: '/content', icon: 'Layers', permission: 'manage_content' },
      { name: 'Forms', path: '/forms', icon: 'ClipboardList', permission: 'manage_content' },
      { name: 'Enquiries', path: '/enquiries', icon: 'MessageSquare', permission: 'manage_enquiries' },
      { name: 'Notifications', path: '/notifications', icon: 'Bell', permission: 'manage_users' },
      { name: 'Subscriptions', path: '/subscriptions', icon: 'CreditCard', permission: 'manage_subscriptions' },
      { name: 'Payments', path: '/payments', icon: 'Wallet', permission: 'manage_payments' },
    ];

    if (!user.value) return [];
    if (user.value.role && user.value.role.toUpperCase() === 'SUPER_ADMIN') return rawMenu;

    return rawMenu.filter(item => {
      if (!item.permission) return true; // Items without required permission are visible
      return user.value?.permissions?.includes(item.permission);
    });
  });

  return {
    activeBusiness,
    setBusiness,
    businessInfo,
    sidebarMenu,
    canSwitchBusiness,
  };
};
