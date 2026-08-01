import useReactApexChart from '@/admin/hooks/useReactApexChart';
import MasterLayout from '@/admin/layouts/MasterLayout';
import { UserType } from '@/pwa/types/userType';
import { Icon } from '@iconify/react/dist/iconify.js';
import { router } from '@inertiajs/react';
import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartData {
    categories: string[];
    series: {
        name: string;
        data: number[];
    }[];
}

interface SummaryProps {
    user: UserType;
    totalUser: number;
    totalHealthRecord: number;
    filters: {
        period: string;
    };
    chartData: ChartData;
}

const Dashboard = ({ user, totalUser, totalHealthRecord, filters, chartData }: SummaryProps) => {
    const { enrollmentChartOptions: initialOptions, enrollmentChartSeries: initialSeries } = useReactApexChart();
    const [options, setOptions] = useState<ApexOptions>(initialOptions as ApexOptions);
    const [series, setSeries] = useState(initialSeries);
    const [filterSelected, setFilterSelected] = useState(filters.period);

    useEffect(() => {
        if (chartData && chartData.categories && chartData.series) {
            console.log('Chart Data:', chartData);
            console.log('Categories:', chartData.categories);
            console.log('Series:', chartData.series);

            setOptions((prevOptions) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: chartData.categories,
                },
                yaxis: {
                    ...(prevOptions.yaxis ?? {}),
                    min: 0,
                    labels: {
                        ...prevOptions.yaxis,
                        formatter: function (value: number) {
                            return Math.floor(value).toString();
                        },
                    },
                },
            }));

            setSeries(chartData.series);
        } else {
            setOptions((prevOptions) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: [],
                },
            }));
            setSeries([]);
        }
    }, [filterSelected, chartData]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = event.target.value;
        setFilterSelected(newPeriod);

        router.get(
            '/admin',
            { period: newPeriod },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <MasterLayout user={user}>
                <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap gap-3">
                    <h6 className="fw-semibold mb-0">Summary</h6>
                    <select
                        className="form-select form-select-sm bg-base text-secondary-light w-auto border-0"
                        value={filterSelected}
                        onChange={handleFilterChange}
                    >
                        <option value={'all'}>All</option>
                        <option value={'last-week'}>Last Week</option>
                        <option value={'last-month'}>Last Month</option>
                    </select>
                </div>
                <div className="col-xxl-12 col-xl-12">
                    <div className="row gy-4">
                        {/* Total Users */}
                        <div className="col-xxl-6 col-xl-4 col-sm-6">
                            <div className="card shadow-2 radius-8 bg-gradient-end-6 h-100 p-3">
                                <div className="card-body p-0">
                                    <div className="d-flex align-items-center justify-content-between mb-8 flex-wrap gap-1">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="w-48-px h-48-px d-flex justify-content-center align-items-center rounded-circle h6 mb-0 flex-shrink-0 bg-cyan-100 text-cyan-600">
                                                <i className="ri-group-fill" />
                                            </span>
                                            <div>
                                                <h6 className="fw-semibold mb-2">{totalUser}</h6>
                                                <span className="fw-medium text-secondary-light text-sm">Users</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-0 text-sm">
                                        <span className="text-cyan-600">{totalUser}</span> Users joined
                                        {filterSelected === 'last-week'
                                            ? ' this week'
                                            : filterSelected === 'last-month'
                                                ? ' this month'
                                                : ' in total'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total users input health records */}
                        <div className="col-xxl-6 col-xl-4 col-sm-6">
                            <div className="card shadow-2 radius-8 bg-gradient-end-1 h-100 p-3">
                                <div className="card-body p-0">
                                    <div className="d-flex align-items-center justify-content-between mb-8 flex-wrap gap-1">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="w-48-px h-48-px bg-success-100 text-success-600 d-flex justify-content-center align-items-center rounded-circle h6 mb-0 flex-shrink-0 text-white">
                                                <Icon icon="mage:heart-health" />
                                            </span>
                                            <div>
                                                <h6 className="fw-semibold mb-2">{totalHealthRecord}</h6>
                                                <span className="fw-medium text-secondary-light text-sm">User input health records</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-0 text-sm">
                                        <span className="text-success-600">{totalHealthRecord}</span> Input health record entries
                                        {filterSelected === 'last-week'
                                            ? ' this week'
                                            : filterSelected === 'last-month'
                                                ? ' this month'
                                                : ' in total'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* statistic */}
                        <div className="col-xxl-12">
                            <div className="card h-100">
                                <div className="card-header">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                        <h6 className="fw-bold mb-2 text-lg">Summary Statistic</h6>
                                        <select
                                            className="form-select form-select-sm bg-base text-secondary-light w-auto border-0"
                                            value={filterSelected}
                                            onChange={handleFilterChange}
                                        >
                                            <option value={'all'}>All Time (Monthly)</option>
                                            <option value={'last-week'}>This Week (Daily)</option>
                                            <option value={'last-month'}>This Month (Daily)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="card-body p-24">
                                    <ul className="d-flex align-items-center justify-content-center my-3 flex-wrap gap-3">
                                        <li className="d-flex align-items-center gap-2">
                                            <span className="w-12-px h-8-px rounded-pill bg-primary-600" />
                                            <span className="text-secondary-light fw-semibold text-sm">
                                                Total Users: <span className="text-primary-light fw-bold">{totalUser}</span>
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-center gap-2">
                                            <span className="w-12-px h-8-px rounded-pill bg-warning-600" />
                                            <span className="text-secondary-light fw-semibold text-sm">
                                                Input Health Records: <span className="text-primary-light fw-bold">{totalHealthRecord}</span>
                                            </span>
                                        </li>
                                    </ul>
                                    <div id="enrollmentChart" className="apexcharts-tooltip-style-1">
                                        {chartData && chartData.categories && chartData.categories.length > 0 ? (
                                            <ReactApexChart
                                                options={options as ApexOptions}
                                                series={series}
                                                type="area"
                                                height={260}
                                                width={'100%'}
                                            />
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '260px' }}>
                                                <p className="text-secondary-light">Loading chart data...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MasterLayout>
        </>
    );
};

export default Dashboard;
