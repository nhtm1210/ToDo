import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

const ProfilePage = () => {
  const { user, saving, updateProfile } = useProfile();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setBio(user.bio || "");
    }
  }, [user]);

  if (!user) return null;

  const isDirty =
    displayName !== (user.displayName || "") || bio !== (user.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ displayName, bio });
      toast.success("Đã cập nhật profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-primary bg-clip-text text-transparent">
              Hồ sơ
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý thông tin tài khoản
            </p>
          </div>

          <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg space-y-4">
            <div className="grid gap-1 text-sm">
              <div>
                <span className="text-muted-foreground">Username: </span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tham gia: </span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên hiển thị</label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tên hiển thị"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tiểu sử{" "}
                  <span className="text-xs text-muted-foreground">
                    ({bio.length}/280)
                  </span>
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Vài dòng về bạn..."
                  maxLength={280}
                  className="min-h-24"
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={!isDirty || saving}
              >
                <Save className="size-4" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
