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
    // {
    //     path: '/admin/staff', title: 'Staffs', icon: 'mdi mdi-widgets', class: '', label: '', labelClass: '',
    // extralink: false, submenu: []
    // },
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
    {
        path: '/admin/transactions', title: 'Transactions', icon: 'fa fa-credit-card',
        class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/admin/reports', title: 'Reports', icon: 'fa fa-file-text-o', class: 'has-arrow',
        label: '', labelClass: '', extralink: false, submenu: [
            {
                path: '/admin/reports/car-reports', title: 'Car Reports', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
            {
                path: '/admin/reports/user-reports', title: 'User Reports', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
            {
                path: '/admin/reports/transaction-reports', title: 'Transaction Reports', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
        ]
    },

    // {
    //     path: '/admin/keywords', title: 'Keywords', icon: 'fa fa-language', class: '',
    //     label: '', labelClass: '', extralink: false, submenu: []
    // },
    {
        path: '/admin/operations', title: 'Operations', icon: 'mdi mdi-widgets',
        class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [

            {
                path: '/admin/operations/car-delivering', title: 'Delivering  Cars', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
            {
                path: '/admin/operations/car-returning', title: 'Returning Cars', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
        ]
    },
    {
        path: '/admin/coupons', title: 'Coupons', icon: 'mdi mdi-cards', class: '', label: '',
        labelClass: '', extralink: false, submenu: []
    },
    // {
    //     path: '/admin/settings', title: 'Settings', icon: 'fa fa-gear', class: '',
    // label: '', labelClass: '', extralink: false, submenu: []
    // },
    {
        path: '/admin/feedback', title: 'Feedback', icon: 'mdi mdi-message-draw',
        class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
            {
                path: '/admin/feedback/category', title: 'Category', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
            {
                path: '/admin/feedback/reported-cars', title: 'Reported Cars', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            }
        ]
    },
    {
        path: '/admin/help', title: 'Help', icon: 'fa fa-question-circle',
        class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
            {
                path: '/admin/help/article-list', title: 'Article List', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            }
        ]
    },

];

export const COMPANY_ROUTES: RouteInfo[] = [
    {
        path: '/company/dashboard', title: 'Dashboard', icon: 'mdi mdi-gauge', class: '',
        label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/company/car', title: 'Cars', icon: 'fa fa-car', class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/company/transactions', title: 'Transactions', icon: 'fa fa-credit-card',
        class: '', label: '', labelClass: '', extralink: false, submenu: []
    },
    {
        path: '/company/reports', title: 'Reports', icon: 'fa fa-file-text-o', class: 'has-arrow',
        label: '', labelClass: '', extralink: false, submenu: [
            {
                path: '/company/reports/car-reports', title: 'Car Reports', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
            {
                path: '/company/reports/user-reports', title: 'User Reports', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },
            {
                path: '/company/reports/transaction-reports', title: 'Transaction Reports', icon: '',
                class: '', label: '', labelClass: '', extralink: false, submenu: []
            },

        ]
    },
    // {
    //     path: '/company/keywords', title: 'Keywords', icon: 'fa fa-language', class: '',
    //     label: '', labelClass: '', extralink: false, submenu: []
    // },
    {
        path: '/company/cancellation_charge', title: 'Cancellation Charge', icon: 'fa fa-money', class: '',
        label: '', labelClass: '', extralink: false, submenu: []
    },
];
