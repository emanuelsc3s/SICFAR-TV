import { useEffect, useRef, useState } from 'react'
import type { Item, MediaItem } from '../types'
import { calculateMediaSequenceState } from '../utils/calculateCurrentMediaState'
import { updateMediaItemsState } from '../utils/updateMediaItemsState'

/**
 * Detecta a duração real de um vídeo
 */
const getVideoDuration = (src: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.preload = 'metadata'

        video.addEventListener('loadedmetadata', () => {
            const durationMs = Math.floor(video.duration * 1000)
            video.remove()
            resolve(durationMs)
        })

        video.addEventListener('error', () => {
            video.remove()
            reject(new Error(`Não foi possível carregar vídeo: ${src}`))
        })

        video.src = src
    })
}

export const useSectionMediaItems = (sectionItems: Item[], elapsedSinceStart: number) => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
    const totalDurationRef = useRef<number>(0)
    const [videoDurations, setVideoDurations] = useState<Map<string, number>>(new Map())

    // Detectar durações de vídeos com duration: "auto"
    useEffect(() => {
        const autoItems = sectionItems.filter(
            item => item.duration === 'auto' && item.content_type === 'video'
        )

        if (autoItems.length === 0) return

        const loadDurations = async () => {
            const newDurations = new Map<string, number>()

            for (const item of autoItems) {
                try {
                    const duration = await getVideoDuration(item.content_path)
                    newDurations.set(item.id, duration)
                } catch (error) {
                    console.warn(`Falha ao detectar duração do vídeo ${item.id}, usando 10s como padrão`)
                    newDurations.set(item.id, 10000)
                }
            }

            setVideoDurations(newDurations)
        }

        loadDurations()
    }, [sectionItems])

    useEffect(() => {
        // Aguarda carregamento de durações automáticas antes de processar
        const hasAutoDurations = sectionItems.some(item => item.duration === 'auto')
        if (hasAutoDurations && videoDurations.size === 0) {
            return
        }

        let items = sectionItems.map(item => {
            let durationMs: number

            if (item.duration === 'auto') {
                // Usa duração detectada ou fallback de 10s
                durationMs = videoDurations.get(item.id) || 10000
            } else {
                // Duração manual em milissegundos
                durationMs = item.duration * 1000
            }

            return {
                id: item.id,
                src: item.content_path,
                type: item.content_type,
                duration: durationMs,
                hidden: true,
                preload: false,
                muted: item.muted !== undefined ? item.muted : true
            }
        })

        // If the section contains only one item, duplicate it to enable seamless looping of the media
        if (items.length === 1) {
            const duplicate = { ...items[0], id: `${items[0].id}-copy` }

            items = [...items, duplicate]
        }

        totalDurationRef.current = items.reduce((sum, item) => sum + item.duration, 0)

        const initialState = calculateMediaSequenceState(items, elapsedSinceStart, totalDurationRef.current)
        const updatedItems = updateMediaItemsState(items, initialState)

        setMediaItems(updatedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionItems, totalDurationRef, videoDurations])

    return { mediaItems, setMediaItems, totalDurationRef }
}
