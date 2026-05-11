import * as React from "react";
import { Link, useNavigate } from "react-router";
import { BarChart3, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { useAuth } from "@/hooks/useAuth";

const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const name = user?.displayName || user?.username || "";

  return (
    <div className="flex items-center justify-between">
      <Link
        to="/"
        className="text-3xl font-bold text-transparent bg-primary bg-clip-text"
      >
        ToDo
      </Link>

      {user && (
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 transition rounded-full bg-white/60 hover:bg-white/80 shadow-custom-md"
            >
              <div className="flex items-center justify-center text-sm font-semibold text-white rounded-full size-8 bg-primary">
                {initials(name)}
              </div>
              <span className="hidden text-sm font-medium sm:inline">
                {name}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-56 p-2"
          >
            <div className="px-2 py-2 border-b">
              <div className="text-sm font-medium truncate">{name}</div>
              <div className="text-xs truncate text-muted-foreground">
                {user.email}
              </div>
            </div>
            <div className="pt-1 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start w-full"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                <User className="size-4" />
                Hồ sơ
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start w-full"
                onClick={() => {
                  setOpen(false);
                  navigate("/stats");
                }}
              >
                <BarChart3 className="size-4" />
                Thống kê
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start w-full text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Đăng xuất
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
