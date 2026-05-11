import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { displayName, bio } = req.body;
    const updates = {};

    if (typeof displayName === "string") updates.displayName = displayName.trim();
    if (typeof bio === "string") {
      if (bio.length > 280) {
        return res
          .status(400)
          .json({ message: "Tiểu sử tối đa 280 ký tự" });
      }
      updates.bio = bio.trim();
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    res.status(200).json({ user: user.toPublicJSON() });
  } catch (error) {
    console.error("Lỗi khi gọi updateProfile", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
