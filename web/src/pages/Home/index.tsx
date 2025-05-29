import { useQuery } from "@tanstack/react-query";
import logo from "../../assets/Logo.svg";
import type { Link } from "../../interface";
import { api } from "../../services/api";
import { ListLinks } from "./components/ListLinks";
import { NewLink } from "./components/NewLink";

interface GetLinksResponse {
  links: Link[];
}

export const Home: React.FC = () => {
  const getLinks = async () => {
    const { data } = await api.get<GetLinksResponse>("/links");
    return data.links;
  };

  const {
    data: links = [],
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["listLinks"], queryFn: getLinks });

  return (
    <div className="h-full w-full flex flex-col items-center md:my-20 my-8 px-3">
      <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch w-full md:items-start">
        <div>
          <div className="mb-8 md:justify-items-start justify-items-center">
            <img src={logo} className="h-6" alt="Logo" />
          </div>

          <NewLink onSuccess={refetch} />
        </div>

        <ListLinks isLoading={isLoading} links={links} onDelete={refetch} />
      </div>
    </div>
  );
};
