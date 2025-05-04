import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";

const RegisterPage = () => {
  return (
    <div
      className="h-screen overflow-hidden bg-repeat"
      style={{
        backgroundImage:
          'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
      }}
    > <Navbar />
      <AuthForm type="register" />;
    </div>
  );
};

export default RegisterPage;
