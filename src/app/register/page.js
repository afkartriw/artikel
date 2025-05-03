import AuthForm from "@/components/AuthForm";

const RegisterPage = () => {
  return (
    <div
      className="min-h-screen bg-repeat"
      style={{
        backgroundImage:
          'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
      }}
    >
      <AuthForm type="register" />;
    </div>
  );
};

export default RegisterPage;
