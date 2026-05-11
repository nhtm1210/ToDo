import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      setSubmitting(true);
      await login(identifier.trim(), password);
      toast.success("Đăng nhập thành công");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fefcff] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 border-0 bg-gradient-card shadow-custom-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-primary bg-clip-text text-transparent">
            Đăng nhập
          </h1>
          <p className="text-sm text-muted-foreground">
            Chào mừng bạn quay lại
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Username hoặc Email</label>
            <Input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Nhập username hoặc email"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mật khẩu</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
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
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
