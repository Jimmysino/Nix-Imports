import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Configuracion } from '../types/database'

export function useConfiguracion() {
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('configuracion')
      .select('*')
      .single()
      .then(({ data }) => {
        setConfig(data)
        setLoading(false)
      })
  }, [])

  return { config, loading }
}
