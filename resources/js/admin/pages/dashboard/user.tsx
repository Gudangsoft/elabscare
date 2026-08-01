import Breadcrumb from '@/admin/components/Breadcrumb';
import { UserData } from '@/admin/types';
import DashBoardLayerOne from '../../components/DashBoardLayerOne';
import MasterLayout from '../../layouts/MasterLayout';
import { UserType } from '@/pwa/types/userType';

interface UserProps {
    user: UserType;
    users: UserData[];
}
const User = ({ user, users }: UserProps) => {
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout user={user}>
                {/* Breadcrumb */}
                <Breadcrumb title="Users" />
                {/* DashBoardLayerEight */}
                <DashBoardLayerOne users={users} />
            </MasterLayout>
        </>
    );
};

export default User;
