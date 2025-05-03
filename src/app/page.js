import AuthForm from '@/components/AuthForm';

const LoginPage = () => {
  return (
    <div
      className="min-h-screen bg-repeat"
      style={{
        backgroundImage: 'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
      }}
    >
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage;
