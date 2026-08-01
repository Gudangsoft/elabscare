import MasterLayout from '@/admin/layouts/MasterLayout';
import { UserType } from '@/pwa/types/userType';
import { Link } from '@inertiajs/react';

interface HealthRecord {
    id: number;
    name: string;
    latest_health_record?: {
        sugar_fasting: number;
        sugar_random: number;
        cholesterol_total: number;
        triglycerides: number;
        hdl: number;
        ldl: number;
        uric_acid: number;
        created_at: string;
    };
}

const HealthRecord = ({ user, healthRecords }: { healthRecords: HealthRecord[], user: UserType }) => {
    console.log(healthRecords);
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout user={user}>
                <h5>Latest Health Records</h5>
                <div className="col-xxl-12 col-xl-12">
                    <div className="card h-100">
                        <div className="card-body p-24">
                            <div className="tab-content" id="pills-tabContent ">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-to-do-list"
                                    role="tabpanel"
                                    aria-labelledby="pills-to-do-list-tab"
                                    tabIndex={0}
                                >
                                    <div className="table-responsive scroll-sm">
                                        <table className="bordered-table sm-table mb-0 table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">User </th>
                                                    <th scope="col" style={{ width: '20px' }}>
                                                        Sugar Fasting
                                                    </th>
                                                    <th scope="col" style={{ width: '20px' }}>
                                                        Sugar Random
                                                    </th>
                                                    <th scope="col" style={{ width: '20px' }}>
                                                        Cholesterol Total
                                                    </th>
                                                    <th scope="col">Triglycerides</th>
                                                    <th scope="col" style={{ width: '20px' }}>
                                                        HDL
                                                    </th>
                                                    <th scope="col" style={{ width: '20px' }}>
                                                        LDL
                                                    </th>
                                                    <th scope="col" style={{ width: '20px' }}>
                                                        Uric Acid
                                                    </th>
                                                    <th scope="col">Created At</th>
                                                    <th scope="col" className="text-center">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {healthRecords.map((healthRecord) => (
                                                    <tr key={healthRecord.id}>
                                                        <td>{healthRecord.name}</td>
                                                        <td>
                                                            {healthRecord.latest_health_record?.sugar_fasting
                                                                ? `${healthRecord.latest_health_record.sugar_fasting} mg/dL`
                                                                : '-'}
                                                        </td>
                                                        <td>
                                                            {healthRecord.latest_health_record?.sugar_random
                                                                ? `${healthRecord.latest_health_record.sugar_random} mg/dL`
                                                                : '-'}
                                                        </td>
                                                        <td>
                                                            {healthRecord.latest_health_record?.cholesterol_total
                                                                ? `${healthRecord.latest_health_record.cholesterol_total} mg/dL`
                                                                : '-'}
                                                        </td>
                                                        <td>
                                                            {healthRecord.latest_health_record?.triglycerides
                                                                ? `${healthRecord.latest_health_record.triglycerides} mg/dl`
                                                                : '-'}
                                                        </td>
                                                        <td>
                                                            {healthRecord.latest_health_record?.hdl
                                                                ? `${healthRecord.latest_health_record.hdl} mg/dL`
                                                                : '-'}
                                                        </td>
                                                        <td>
                                                            {healthRecord.latest_health_record?.ldl
                                                                ? `${healthRecord.latest_health_record.ldl} mg/dL`
                                                                : '-'}
                                                        </td>
                                                        <td>
                                                            {healthRecord.latest_health_record?.uric_acid
                                                                ? `${healthRecord.latest_health_record.uric_acid} mg/dL`
                                                                : '-'}
                                                        </td>
                                                        <td>
                                                            {healthRecord.latest_health_record?.created_at
                                                                ? new Date(healthRecord.latest_health_record.created_at).toLocaleDateString('en-US', {
                                                                      day: 'numeric',
                                                                      month: 'long',
                                                                      year: 'numeric',
                                                                  })
                                                                : '-'}
                                                        </td>
                                                        <td className="text-center">
                                                            {healthRecord.latest_health_record ? (
                                                                <Link href={`/admin/health-records/${healthRecord.id}`}>
                                                                    <button className="btn btn-primary">View All</button>
                                                                </Link>
                                                            ) : (
                                                                <button className="btn btn-secondary" disabled>
                                                                    No Data
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-recent-leads"
                                    role="tabpanel"
                                    aria-labelledby="pills-recent-leads-tab"
                                    tabIndex={0}
                                >
                                    <div className="table-responsive scroll-sm">
                                        <table className="bordered-table sm-table mb-0 table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Users </th>
                                                    <th scope="col">Registered On</th>
                                                    <th scope="col">Plan</th>
                                                    <th scope="col" className="text-center">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            {/* <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src="/assets/images/users/user1.png"
                                                            alt="WowDash React Vite"
                                                            className="w-40-px h-40-px rounded-circle me-12 flex-shrink-0 overflow-hidden"
                                                        />
                                                        <div className="flex-grow-1">
                                                            <h6 className="text-md fw-medium mb-0">{user.name}</h6>
                                                            <span className="text-secondary-light fw-medium text-sm">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>27 Mar 2024</td>
                                                <td>Free</td>
                                                <td className="text-center">
                                                    <span className="bg-success-focus text-success-main rounded-pill fw-medium px-24 py-4 text-sm">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody> */}
                                        </table>
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

export default HealthRecord;
