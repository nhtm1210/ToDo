import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    try {
      setSubmitting(true);
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        displayName: form.displayName.trim(),
      });
      toast.success("Đăng ký thành công");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fefcff] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 border-0 bg-gradient-card shadow-custom-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-primary bg-clip-text text-transparent">
            Đăng ký
          </h1>
          <p className="text-sm text-muted-foreground">
            Tạo tài khoản mới để bắt đầu
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Username *</label>
            <Input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="3-30 ký tự"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email *</label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="bạn@example.com"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mật khẩu *</label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tên hiển thị{" "}
              <span className="text-xs text-muted-foreground">(tuỳ chọn)</span>
            </label>
            <Input
              name="displayName"
              type="text"
              value={form.displayName}
              onChange={handleChange}
              placeholder="Tên bạn muốn hiển thị"
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="xl"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
