import { Warning } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ApiError } from "../../interface";
import { api } from "../../services/api";

interface FormData {
  originalUrl: string;
  shortUrl: string;
}

interface NewLinkProps {
  onSuccess: () => void;
}

interface ErrorProps {
  message?: string;
}

const FormError: React.FC<ErrorProps> = ({ message = "Ocorreu um erro" }) => (
  <div className="flex items-center p-1">
    <Warning size={18} className="text-danger" />
    <p className="pl-1  text-xs text-danger">{message}</p>
  </div>
);

export const NewLink: React.FC<NewLinkProps> = ({ onSuccess }) => {
  const createLinkApi = async (data: FormData) => {
    if (data.originalUrl.startsWith("http://")) {
      toast.error("Link original precisa ser em HTTPS.");
      return;
    }

    if (!data.originalUrl.startsWith("https://")) {
      data.originalUrl = `https://${data.originalUrl}`;
    }

    return api.post("/links", data);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate: createLink, isPending: isCreatingLink } = useMutation({
    mutationKey: ["createLink"],
    mutationFn: createLinkApi,
    onSuccess: () => {
      toast.success("Link criado com sucesso!");
      reset();
      onSuccess();
    },
    onError: (err) => {
      const error = err as ApiError;
      toast.error(error?.response?.data?.message ?? "Erro ao criar link.");
    },
  });

  return (
    <div className="bg-gray-100 sm:p-8 p-8 rounded-lg shadow md:w-[380px]">
      <h2 className="text-lg font-bold text-gray-600 md:mb-6 mb-5">
        Novo link
      </h2>
      <form
        onSubmit={handleSubmit((data) => createLink(data))}
        className="flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="originalUrl"
            className="text-xs block mb-2 text-gray-500"
          >
            LINK ORIGINAL
          </label>
          <input
            id="originalUrl"
            type="text"
            placeholder="www.exemplo.com.br"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.originalUrl ? "border-danger" : "border-gray-300"
            }`}
            {...register("originalUrl", {
              required: "O link original é obrigatório.",
              pattern: {
                value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/\S*)?$/,
                message: "Informe uma URL válida.",
              },
            })}
          />
          {errors.originalUrl && (
            <FormError message={errors.originalUrl.message} />
          )}
        </div>
        <div>
          <label
            htmlFor="shortUrl"
            className="text-xs block mb-2 text-gray-500"
          >
            LINK ENCURTADO
          </label>
          <div
            className={`w-full pl-4 border rounded-lg input-prefix-wrapper ${
              errors.shortUrl ? "border-danger" : "border-gray-300"
            }`}
          >
            <span className="text-gray-400 mr-[1px]">brev.ly/</span>
            <input
              id="shortUrl"
              className="outline-none"
              type="text"
              {...register("shortUrl", {
                required:
                  "Informe uma URL minúscula e sem espaço/caracteres especiais.",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "Use apenas letras minúsculas, números e hífens.",
                },
              })}
            />
          </div>
          {errors.shortUrl && <FormError message={errors.shortUrl.message} />}
        </div>
        <button
          type="submit"
          className="sm:mt-3 mt-2 bg-primary-500 hover:bg-primary-800 transition duration-200 text-white rounded-lg"
          disabled={isCreatingLink}
        >
          {isCreatingLink ? "Salvando..." : "Salvar link"}
        </button>
      </form>
    </div>
  );
};
