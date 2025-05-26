export type ServiceDetail = {
    id: number;
    name: string;
    description: string;
}

export type ServiceStatus = {
    name: string;
    docker_status: string;
    is_running: boolean;
    health_status: string;
    last_checked: string;
    endpoint: string;
    status: 'good' | 'warning' | 'error' | 'off';
}

export type Service = ServiceDetail & ServiceStatus;