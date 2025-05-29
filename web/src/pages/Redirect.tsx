import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import icon from "../assets/logo-icon.svg";
import { BasePage } from "../components/BasePage";
import type { ApiError, Link } from "../interface";
import { api } from "../services/api";

interface GetLinkResponse {
  link: Link;
}

export function Redirect() {
  const { link } = useParams();

  const getLink = async () => {
    try {
      const { data } = await api.get<GetLinkResponse>(`/links/${link}`);
      return data;
    } catch (err) {
      const error = err as ApiError;

      if (error?.response?.status === 404) {
        window.location.replace("not-found");
        return;
      }

      toast.error("Erro ao consultar o link.");
    }
  };

  const { data: linkData } = useQuery({
    queryKey: ["linkData", "redirect"],
    queryFn: getLink,
    enabled: !!link,
  });

  const { mutate: incrementAccessCount } = useMutation({
    mutationKey: ["incrementAccessCount"],
    mutationFn: (shortUrl: string) => api.patch(`/links/${shortUrl}/access`),
  });

  useEffect(() => {
    if (!linkData) return;

    incrementAccessCount(linkData.link.shortUrl, {
      onSettled: () => {
        setTimeout(() => {
          window.location.replace(linkData.link.originalUrl);
        }, 2000);
      },
    });
  }, [linkData, incrementAccessCount]);

  return (
    <BasePage
      title="Redirecionando..."
      message={
        <>
          <p>O link será aberto automaticamente em alguns instantes.</p>
          <p>
            Não foi redirecionado?
            <a
              href={linkData?.link.originalUrl}
              className="pl-1 text-primary-500 underline hover:brightness-150 transition-colors duration-200"
            >
              Acesse aqui
            </a>
          </p>
        </>
      }
      component={<img className="h-12" src={icon} alt="Not Found" />}
    />
  );
}
