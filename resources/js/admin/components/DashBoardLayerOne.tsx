import { UserData } from '@/admin/types';
import LatestRegisteredOne from './child/LatestRegisteredOne';

const DashBoardLayerOne = ({ users }: { users: UserData[] }) => {
    return (
        <>
            {/* LatestRegisteredOne */}
            <LatestRegisteredOne users={users} />
        </>
    );
};

export default DashBoardLayerOne;
