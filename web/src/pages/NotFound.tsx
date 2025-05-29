import { Link } from "react-router";
import notFound from "../assets/404.svg";
import { BasePage } from "../components/BasePage";

export function NotFound() {
  return (
    <BasePage
      title="Link não encontrado"
      message={
        <p>
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em
          <Link
            to="/"
            className="pl-1 text-primary-500 underline hover:brightness-150 transition-colors duration-200"
          >
            brev.ly
          </Link>
          .
        </p>
      }
      component={<img className="h-20" src={notFound} alt="Not Found" />}
    />
  );
}
