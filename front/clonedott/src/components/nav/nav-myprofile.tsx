import { user } from "@/data/user";
import Link from "next/link";
import "./nav-myprofile.css";

export const NavMyProfile = () => {
  return (
    <div className="maincontainer">
      <div className="containerimagem">
        <Link href={`/${user.slug}`}>
          <img src={user.avatar} alt={user.name} />
        </Link>
      </div>
      <div className="containerfinal">
        <Link href={`/${user.slug}`} className="namelink">
            {user.name}
        </Link>
        <div className="textoarroba namelink">@{user.slug}</div>
      </div>
    </div>
  );
};
