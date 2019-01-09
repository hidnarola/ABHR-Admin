import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/admin/dashboard', title: 'Dashboard', icon: 'mdi mdi-gauge', class: '',
        label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/admin/agents', title: 'Agents', icon: 'fa fa-user-circle-o', class: '',
        label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/admin/staff', title: 'Staffs', icon: 'mdi mdi-widgets', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '', title: 'Cars', icon: 'fa fa-car', class: 'has-arrow', label: '', labelClass: '', extralink: false,
        submenu: [
            {
                path: '/admin/car-rental-companies', title: 'Companies', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
        ]
    },
    {
        path: '/admin/users', title: 'Users', icon: 'fa fa-users', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    // {
    //     path: '/admin/transactions', title: 'Transactions', icon: 'fa fa-credit-card',
    // class: '', label: '', labelClass: '', extralink: false, submenu: []
    // },
    {
        path: '/admin/reports', title: 'Reports', icon: 'fa fa-file-text-o', class: 'has-arrow',
    label: '', labelClass: '', extralink: false, submenu: [
        {
            path: '/admin/transactions', title: 'Transaction Reports', icon: '',
            class: '', label: '', labelClass: '', extralink: false, submenu: []
        }
    ]
    },
    // {
    //     path: '/admin/operations', title: 'Operations', icon: 'mdi mdi-widgets',
    // class: '', label: '', labelClass: '', extralink: false, submenu: []
    // },
    // {
    //     path: '/admin/settings', title: 'Settings', icon: 'fa fa-gear', class: '',
    // label: '', labelClass: '', extralink: false, submenu: []
    // },
];

export const COMPANY_ROUTES: RouteInfo[] = [
    {
        path: '/company/dashboard', title: 'Dashboard', icon: 'mdi mdi-gauge', class: '',
        label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/company/car', title: 'Cars', icon: 'fa fa-car', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
];
