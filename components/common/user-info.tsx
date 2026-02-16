import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function UserInfo({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string | null;
}) {
  const nameInitials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={image ?? undefined} alt={name} />
        <AvatarFallback className="rounded-lg">{nameInitials}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        <span className="text-muted-foreground truncate text-xs">{email}</span>
      </div>
    </div>
  );
}
