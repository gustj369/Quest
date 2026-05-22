import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.js'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = 로딩 중, null = 비로그인

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // 로그인/로그아웃 이벤트 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, signOut, loading: user === undefined }
}
