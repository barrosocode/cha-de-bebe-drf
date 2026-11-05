"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api, getErrorMessage, notifyRequestError } from "@/lib/api/client";
import { useGift } from "@/lib/api/queries";
import type { Gift } from "@/lib/api/types";
import { giftSchema, type GiftValues } from "@/lib/validations/schemas";
import { DynamicForm } from "@/components/ui/DynamicForm";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { QueryState } from "@/components/ui/PageIntro";
import { useToast } from "@/components/ui/Toast";

export function GiftForm({ id }: { id: string }) {
  const isNew = id === "novo";
  const gift = useGift(id);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  if (!isNew && gift.isLoading) return <QueryState error={null} isLoading>{null}</QueryState>;
  if (!isNew && gift.isError) {
    return <p className="rounded-2xl bg-error-container p-4 text-on-error-container">{axios.isAxiosError(gift.error) && gift.error.response?.status === 404 ? "Presente não encontrado." : "Não foi possível carregar o presente."}</p>;
  }

  const current = gift.data;

  return (
    <DynamicForm
      schema={giftSchema}
      defaultValues={{
        name: current?.name ?? "",
        description: current?.description ?? "",
        link: current?.link ?? "",
        limit: current?.limit ?? 1,
        tag_names: current?.tags.map((tag) => tag.name) ?? [],
      }}
      eyebrow="Presentes"
      title={isNew ? "Cadastrar presente" : "Editar presente"}
      description="Nome, link, limite de escolhas e etiquetas que aparecem na lista pública."
      submitLabel={isNew ? "Salvar presente" : "Atualizar presente"}
      cancelHref="/presentes"
      breadcrumbs={[{ label: "Presentes", href: "/presentes" }, { label: isNew ? "Cadastrar" : "Editar" }]}
      aside={<ImageUpload existingUrl={current?.files.find((file) => file.image_url)?.image_url} file={image} onChange={setImage} />}
      fields={[
        { name: "name", label: "Nome do presente", type: "text", required: true, placeholder: "Ex.: Kit de fraldas" },
        { name: "description", label: "Descrição", type: "textarea", placeholder: "Detalhes para orientar quem for presentear" },
        { name: "link", label: "Link de sugestão", type: "url", required: true, placeholder: "https://" },
        { name: "limit", label: "Limite de escolhas", type: "number", required: true, hint: "Número inteiro maior que zero." },
        { name: "tag_names", label: "Etiquetas", type: "tags", placeholder: "Digite uma etiqueta e pressione Enter" },
      ]}
      onSubmit={async (values: GiftValues, setError) => {
        try {
          const payload = {
            name: values.name,
            description: values.description ?? "",
            link: values.link,
            limit: values.limit,
            tag_names: values.tag_names ?? [],
          };
          const saved = isNew ? (await api.post<Gift>("/gifts/", payload)).data : (await api.patch<Gift>(`/gifts/${id}/`, payload)).data;
          if (image) {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("alt", values.name);
            formData.append("gift", saved.uuid);
            try {
              await api.post("/files/", formData);
            } catch (fileError) {
              toast.error(getErrorMessage(fileError, "O presente foi salvo, mas a imagem não pôde ser enviada."));
              await queryClient.invalidateQueries({ queryKey: ["gifts"] });
              router.push("/presentes");
              return;
            }
          }
          await queryClient.invalidateQueries({ queryKey: ["gifts"] });
          toast.success(isNew ? "Presente cadastrado." : "Presente atualizado.");
          router.push("/presentes");
        } catch (error) {
          notifyRequestError(error, toast.error, setError);
        }
      }}
    />
  );
}
