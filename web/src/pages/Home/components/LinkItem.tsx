import { Copy, Trash } from "@phosphor-icons/react";
import type React from "react";
import { toast } from "react-toastify";
import type { Link } from "../../../interface";
import { api } from "../../../services/api";
import { showConfirmModal } from "../../../utils/showConfirmModal";

interface LinkWidgetProps {
  link: Link;
  isLoading?: boolean;
  onDelete: () => void;
}

export const LinkItem: React.FC<LinkWidgetProps> = ({ link, onDelete }) => {
  const fullShortLink = `${window.location.origin}/${link.shortUrl}`;

  const copyShortLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShortLink);
      toast.success("Link copiado com sucesso");
    } catch {
      toast.error("Erro ao copiar o link.");
    }
  };

  const deleteLink = async () => {
    showConfirmModal({
      text: `Você tem certeza que deseja deletar o link "${link.shortUrl}"?`,
      onConfirm: async () => {
        try {
          const response = await api.delete("/links", {
            params: {
              shortUrl: link.shortUrl,
            },
          });
          toast.success(
            response?.data?.message ?? "Link deletado com sucesso."
          );
          onDelete();
        } catch {
          toast.error(`Erro ao deletar o link "${link.shortUrl}".`);
        }
      },
    });
  };

  return (
    <div className="border-t border-gray-200 p-4.5 flex items-start justify-between gap-1">
      <div className="flex flex-col gap-0">
        <a
          href={fullShortLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-primary-500 hover:underline"
        >
          {`brev.ly/${link.shortUrl}`}
        </a>
        <p className="text-xs text-gray-500">{link.originalUrl}</p>
      </div>
      <div className="flex items-center gap-1">
        <p className="text-sm text-gray-500 mr-4">{link.accessCount} acessos</p>
        <button
          type="button"
          onClick={copyShortLink}
          className=" flex justify-center items-center h-8! w-8 bg-gray-200 hover:bg-gray-300 rounded-md"
          title="Copiar link"
        >
          <Copy size={16} className="text-gray-600" />
        </button>
        <button
          type="button"
          onClick={deleteLink}
          className=" flex justify-center items-center h-8! w-8 bg-gray-200 hover:bg-gray-300 rounded-md"
          title="Excluir link"
        >
          <Trash size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};
