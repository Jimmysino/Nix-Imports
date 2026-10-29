import { useEffect, useState } from 'react'
import { ExternalLink, PackageCheck, Save } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface CompraTrackingProps {
  linkCompra?: string | null
  numeroTracking?: string | null
  urlTracking?: string | null
  onGuardar: (datos: { link_compra: string | null; numero_tracking: string | null; url_tracking: string | null }) => Promise<void>
}

function esUrlValida(valor: string) {
  if (!valor.trim()) return true
  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function CompraTracking({ linkCompra, numeroTracking, urlTracking, onGuardar }: CompraTrackingProps) {
  const [link, setLink] = useState(linkCompra ?? '')
  const [tracking, setTracking] = useState(numeroTracking ?? '')
  const [urlSeguimiento, setUrlSeguimiento] = useState(urlTracking ?? '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLink(linkCompra ?? '')
    setTracking(numeroTracking ?? '')
    setUrlSeguimiento(urlTracking ?? '')
  }, [linkCompra, numeroTracking, urlTracking])

  async function guardar() {
    if (!esUrlValida(link)) {
      setError('El link de compra debe ser una URL válida que comience con http:// o https://')
      return
    }
    if (!esUrlValida(urlSeguimiento)) {
      setError('El enlace de seguimiento debe ser una URL válida que comience con http:// o https://')
      return
    }

    setGuardando(true)
    setError(null)
    try {
      await onGuardar({
        link_compra: link.trim() || null,
        numero_tracking: tracking.trim() || null,
        url_tracking: urlSeguimiento.trim() || null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron guardar los datos de compra')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Link de compra"
          type="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://tienda.com/producto"
        />
        <Input
          label="Número de tracking"
          value={tracking}
          onChange={(event) => setTracking(event.target.value)}
          placeholder="Ej: 1Z999AA10123456784"
        />
        <Input
          label="URL de seguimiento"
          type="url"
          value={urlSeguimiento}
          onChange={(event) => setUrlSeguimiento(event.target.value)}
          placeholder="https://tracking.com/..."
        />
      </div>

      {(link || urlSeguimiento) && (
        <div className="flex flex-wrap gap-4 text-sm">
          {esUrlValida(link) && link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
              Abrir compra <ExternalLink size={13} />
            </a>
          )}
          {esUrlValida(urlSeguimiento) && urlSeguimiento && (
            <a href={urlSeguimiento} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
              Seguimiento {tracking && `· ${tracking}`} <PackageCheck size={14} />
            </a>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="button" loading={guardando} onClick={guardar} className="gap-2">
          <Save size={15} /> Guardar compra y tracking
        </Button>
      </div>
    </div>
  )
}
