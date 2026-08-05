"use client";

import { useState, useRef } from "react";
import styles from "./styles.module.css";

interface ImageFile {
    id: string;
    file: File;
    previewUrl: string;
}

export default function ImageUploadMultiple() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [coverId, setCoverId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFiles = (fileList: FileList) => {
        const validFiles = Array.from(fileList)
            .filter((file) => file.type.startsWith("image/"))
            .map((file) => ({
                id: crypto.randomUUID(),
                file,
                previewUrl: URL.createObjectURL(file),
            }));

        if (!validFiles.length) return null;

        setImages((prev) => {
            const updated = [...prev, ...validFiles];
            syncInputFiles(updated);
            // se ainda não tem capa definida, a primeira imagem vira capa por padrão
            if (!coverId && updated.length > 0) {
                setCoverId(updated[0].id);
            }
            return updated;
        });
    };

    const syncInputFiles = (currentImages: ImageFile[]) => {
        if (!fileInputRef.current) return null;
        const dataTransfer = new DataTransfer();
        currentImages.forEach((img) => dataTransfer.items.add(img.file));
        fileInputRef.current.files = dataTransfer.files;
    };

    const removeImage = (idToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation();

        setImages((prev) => {
            const removed = prev.find((img) => img.id === idToRemove);
            if (removed) URL.revokeObjectURL(removed.previewUrl);

            const filtered = prev.filter((img) => img.id !== idToRemove);
            syncInputFiles(filtered);

            // se a imagem removida era a capa, reatribui pra primeira restante
            if (idToRemove === coverId) {
                setCoverId(filtered.length > 0 ? filtered[0].id : null);
            }

            return filtered;
        });
    };

    const setCover = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setCoverId(id);
    };

    const moveImage = (index: number, direction: -1 | 1, e: React.MouseEvent) => {
        e.stopPropagation();

        setImages((prev) => {
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= prev.length) return prev;

            const updated = [...prev];
            [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
            syncInputFiles(updated);
            return updated;
        });
    };

    const handleContainerClick = () => fileInputRef.current?.click();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
    };

    const coverIndex = images.findIndex((img) => img.id === coverId);

    return (
        <div className={styles.container}>
            <input
                type="file"
                name="images"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className={styles.hiddenInput}
                onChange={(e) => e.target.files && processFiles(e.target.files)}
            />

            <input type="hidden" name="coverIndex" value={coverIndex >= 0 ? coverIndex : 0} />

            <div
                className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
                onClick={handleContainerClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className={styles.placeholder}>
                    <p><strong>Clique para buscar</strong> ou arraste as imagens aqui</p>
                    <span>Você pode selecionar múltiplos arquivos (PNG, JPG)</span>
                </div>
            </div>

            {images.length > 0 && (
                <div className={styles.previewGrid}>
                    {images.map((img, index) => (
                        <div
                            key={img.id}
                            className={`${styles.previewItem} ${img.id === coverId ? styles.coverItem : ""}`}
                        >
                            <img src={img.previewUrl} alt="Preview" className={styles.previewImage} />

                            {img.id === coverId && (
                                <span className={styles.coverBadge}>Capa</span>
                            )}

                            <div className={styles.imageControls}>
                                <button
                                    type="button"
                                    className={styles.controlButton}
                                    onClick={(e) => moveImage(index, -1, e)}
                                    disabled={index === 0}
                                    title="Mover para esquerda"
                                >
                                    ←
                                </button>

                                <button
                                    type="button"
                                    className={styles.controlButton}
                                    onClick={(e) => setCover(img.id, e)}
                                    disabled={img.id === coverId}
                                    title="Definir como capa"
                                >
                                    ★
                                </button>

                                <button
                                    type="button"
                                    className={styles.controlButton}
                                    onClick={(e) => moveImage(index, 1, e)}
                                    disabled={index === images.length - 1}
                                    title="Mover para direita"
                                >
                                    →
                                </button>
                            </div>

                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={(e) => removeImage(img.id, e)}
                                title="Remover imagem"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}