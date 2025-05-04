import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/Navbar";

const AdminRegisterPage = () => {
  return (
    <div
      className="h-screen overflow-hidden bg-repeat"
      style={{
        backgroundImage:
          'url("https://sso.uns.ac.id/module.php/uns/img/symphony.png")',
      }}
    > <Navbar />
      <AuthForm type="register" isAdminRegister={true} />{" "}
    </div>
  );
};

export default AdminRegisterPage;
