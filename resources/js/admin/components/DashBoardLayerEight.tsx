import AvailableTreatments from './child/AvailableTreatments';
import EarningStatistic from './child/EarningStatistic';
import HealthReportsDocument from './child/HealthReportsDocument';
import LatestAppointmentsOne from './child/LatestAppointmentsOne';
import PatientVisitByGender from './child/PatientVisitByGender';
import PatientVisitedDepartment from './child/PatientVisitedbyDepartment';
import TopPerformanceTwo from './child/TopPerformanceTwo';
import TotalIncome from './child/TotalIncome';
import UnitCountSix from './child/UnitCountSix';

const DashBoardLayerEight = () => {
    return (
        <>
            <div className="row gy-4">
                <div className="col-xxxl-9">
                    <div className="row gy-4">
                        {/* UnitCountSix */}
                        <UnitCountSix />
                        {/* Earning Statistic */}
                        <EarningStatistic />

                        {/* PatientVisitedDepartment */}
                        <PatientVisitedDepartment />

                        {/* PatientVisitByGender */}
                        <PatientVisitByGender />

                        {/* TopPerformanceTwo */}
                        <TopPerformanceTwo />

                        {/* LatestAppointmentsOne */}
                        <LatestAppointmentsOne />
                    </div>
                </div>
                <div className="col-xxxl-3">
                    <div className="row gy-4">
                        {/* TotalIncome */}
                        <TotalIncome />

                        {/* AvailableTreatments */}
                        <AvailableTreatments />

                        {/* HealthReportsDocument */}
                        <HealthReportsDocument />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashBoardLayerEight;
