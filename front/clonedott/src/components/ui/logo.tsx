import Link from "next/link"
import Image from "next/image"

type Props = {
    size: number;
}

export const Logo = ({size}: Props) => {
    return (
        <Link href="/">
            <Image 
                src={"/logo_dox.png"}
                alt="X"
                width={size}
                height={size}
                quality={100}
            />

        </Link>
    );
}