type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
};

const getInitials = (name?: string | null, email?: string | null) => {
  if (name) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase()).join("");
  }

  if (email) {
    return email.slice(0, 2).toUpperCase();
  }

  return "AD";
};

export default function UserAvatar({ name, email }: UserAvatarProps) {
  const initials = getInitials(name, email);

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-xs font-semibold uppercase text-slate-900 shadow">
      {initials}
    </div>
  );
}
