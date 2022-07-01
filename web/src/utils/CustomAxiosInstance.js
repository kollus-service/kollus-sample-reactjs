import React from 'react';
import axios from 'axios';

export default function CustomAxiosInstance() {
    const axiosInstance = axios.create();
    const onFulfilled = (response) => response;
    const retry = (errorConfig) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('retry');
                resolve(axiosInstance.request(errorConfig));
            }, 5000);
        });
    }
    const onRejected = (error) => {
        if (error.config) {
            return retry(error.config);
        }
        
        return Promise.reject(error);
    };
    axiosInstance.interceptors.response.use(
        onFulfilled,
        onRejected,
    );
    return axiosInstance;
};

/*
import CustomAxiosInstance from './components/Utils/CustomAxiosInstance';
const apiRequest = CustomAxiosInstance();
*/