import LogoImg from "../assets/logo.svg";

export function Logo() {
  return (
    <div className="logo" aria-label="Lendsqr">
     <img src={LogoImg} alt="Lendsqr" />
    </div>
  );
}

