import AuthForm from '@/components/AuthForm';

const AdminRegisterPage = () => {
  return <AuthForm type="register" isAdminRegister={true} />;
};

export default AdminRegisterPage;