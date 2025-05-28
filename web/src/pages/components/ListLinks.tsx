import {
  CircleNotch,
  DownloadSimple,
  Link as LinkIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ApiError, Link } from "../../interface";
import { api } from "../../services/api";
import { LinkItem } from "./LinkItem";

interface ListLinksProps {
  links: Link[];
  isLoading: boolean;
  onDelete: () => void;
}

interface ExportCSVResponse {
  reportUrl: string;
}

const exportCSVApi = () => {
  return api.post<ExportCSVResponse>("/links/exports");
};

export const ListLinks: React.FC<ListLinksProps> = ({
  links,
  isLoading,
  onDelete,
}) => {
  const { mutate: exportCsv, isPending: isExporting } = useMutation({
    mutationKey: ["exportLinks"],
    mutationFn: exportCSVApi,
    onSuccess: ({ data }) => {
      const download = data?.reportUrl;

      if (download) {
        window.location.href = download;
      }
    },
    onError: (err) => {
      const error = err as ApiError;
      toast.error(error?.response?.data?.message ?? "Erro ao baixar o csv.");
    },
  });

  const ExportButton = () => (
    <button
      type="button"
      disabled={isExporting || isLoading}
      className="text-sm font-semibold bg-gray-200 px-3 rounded-md hover:bg-gray-300 transition h-8!"
      onClick={() => exportCsv()}
    >
      <div className="flex justify-start items-center gap-2 ">
        {isExporting ? (
          <CircleNotch size={16} className="text-gray-600 animate-spin" />
        ) : (
          <DownloadSimple size={16} className="text-gray-600" />
        )}
        <p className="text-gray-500">Baixar CSV</p>
      </div>
    </button>
  );

  const LoadingLinks = () => (
    <div className="flex flex-col items-center justify-center text-gray-400 py-9">
      <CircleNotch size={42} className="animate-spin" />
      <p className="text-sm">CARREGANDO LINKS</p>
    </div>
  );

  const ListEmpty = () => (
    <div className="flex flex-col items-center justify-center text-gray-400 py-9">
      <LinkIcon size={28} />
      <p className="text-sm mt-3">AINDA NÃO EXISTEM LINKS CADASTRADOS</p>
    </div>
  );

  const List = () => (
    <div className="flex flex-col md:max-h-[70dvh] max-h-[40dvh] overflow-y-auto">
      {links.map((link) => (
        <LinkItem
          link={link}
          key={link.id}
          isLoading={isLoading}
          onDelete={onDelete}
        />
      ))}
    </div>
  );

  const renderList = () => {
    if (isLoading) {
      return <LoadingLinks />;
    }

    if (links.length === 0) {
      return <ListEmpty />;
    }

    return <List />;
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow md:max-w-[580px] w-full md:mt-14">
      <div className="sm:p-8 sm:pb-3.5 p-6">
        <div className="flex justify-between items-center pb-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-600">Meus links</h2>
          {!isLoading && links.length > 0 && <ExportButton />}
        </div>

        {renderList()}
      </div>
    </div>
  );
};
