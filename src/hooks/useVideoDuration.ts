import { useEffect, useState } from 'react'

/**
 * Hook para detectar automaticamente a duração de um vídeo
 * @param src - URL do vídeo
 * @param contentType - Tipo de conteúdo
 * @returns Duração do vídeo em milissegundos, ou null se ainda não foi detectada
 */
export const useVideoDuration = (src: string, contentType: string): number | null => {
    const [duration, setDuration] = useState<number | null>(null)

    useEffect(() => {
        // Só detecta duração se for vídeo
        if (contentType !== 'video') {
            setDuration(null)
            return
        }

        // Cria elemento de vídeo temporário para detectar duração
        const video = document.createElement('video')
        video.preload = 'metadata'

        const handleLoadedMetadata = () => {
            // Duração em milissegundos
            const durationMs = Math.floor(video.duration * 1000)
            setDuration(durationMs)
            video.remove()
        }

        const handleError = () => {
            console.warn(`Não foi possível detectar duração do vídeo: ${src}`)
            // Fallback para 10 segundos se não conseguir detectar
            setDuration(10000)
            video.remove()
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('error', handleError)

        video.src = src

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
            video.removeEventListener('error', handleError)
            video.remove()
        }
    }, [src, contentType])

    return duration
}
