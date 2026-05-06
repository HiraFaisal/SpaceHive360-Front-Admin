import axiosInstance from './axios';

export const bookingApi = {
    getAll: (search?: string, page = 1, pageSize = 10) => 
        axiosInstance.get('/api/Bookings', { params: { search, page, pageSize } }).then(res => res.data),
    
    getPayments: (page = 1, pageSize = 10) => 
        axiosInstance.get('/api/Bookings/payments', { params: { page, pageSize } }).then(res => res.data),
    
    getCalendar: () => 
        axiosInstance.get('/api/Bookings/calendar').then(res => res.data),
    
    getStats: () => 
        axiosInstance.get('/api/Bookings/stats').then(res => res.data)
};
