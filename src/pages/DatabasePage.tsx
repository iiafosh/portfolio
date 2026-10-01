import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase, isSupabaseConfigured, UserItem } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Database,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Lock,
  Code2
} from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'

export const DatabasePage: React.FC = () => {
  const { user, isConfigured, signInWithGithub } = useAuth()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showSql, setShowSql] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // TanStack Query: Fetch items from Supabase
  const {
    data: items = [],
    isLoading: isItemsLoading,
    refetch,
    isFetching,
  } = useQuery<UserItem[]>({
    queryKey: ['user_items', user?.id],
    queryFn: async () => {
      if (!isSupabaseConfigured || !user) return []
      const { data, error } = await supabase
        .from('user_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data as UserItem[]
    },
    enabled: Boolean(user && isConfigured),
  })

  // TanStack Mutation: Insert item
  const addItemMutation = useMutation({
    mutationFn: async (newItem: { title: string; description?: string }) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('user_items')
        .insert([
          {
            user_id: user.id,
            title: newItem.title,
            description: newItem.description || null,
            is_completed: false,
          },
        ])
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      setTitle('')
      setDescription('')
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['user_items', user?.id] })
    },
    onError: (err: Error) => {
      setErrorMessage(err.message)
    },
  })

  // TanStack Mutation: Toggle item completed
  const toggleItemMutation = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      const { data, error } = await supabase
        .from('user_items')
        .update({ is_completed })
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_items', user?.id] })
    },
    onError: (err: Error) => {
      setErrorMessage(err.message)
    },
  })

  // TanStack Mutation: Delete item
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_items').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_items', user?.id] })
    },
    onError: (err: Error) => {
      setErrorMessage(err.message)
    },
  })

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addItemMutation.mutate({ title: title.trim(), description: description.trim() })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">Live Supabase Database Engine</span>
            </div>
            <h1 className="font-['Silkscreen',monospace] text-2xl sm:text-3xl font-bold tracking-wide mt-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]">
              POSTGRESQL PLAYGROUND
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-0.5">
              Live CRUD operations and optimistic caching backed by Postgres Row Level Security.
            </p>
          </div>

          <button
            onClick={() => setShowSql(!showSql)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/40 text-xs font-mono text-zinc-300 hover:text-emerald-300 transition-colors self-start sm:self-auto"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showSql ? 'Hide SQL' : 'View RLS Policy'}</span>
          </button>
        </div>

        {/* Expandable SQL */}
        {showSql && (
          <div className="pt-3 border-t border-white/10 text-xs font-mono space-y-1">
            <span className="text-[11px] text-emerald-300 block">Row Level Security Policy on public.user_items:</span>
            <pre className="p-3 rounded-xl bg-black/80 text-emerald-300 text-[11px] overflow-x-auto leading-relaxed border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
{`create policy "Users can read own items"
  on public.user_items for select
  to authenticated
  using (auth.uid() = user_id);`}
            </pre>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="yust-card rounded-2xl p-6 sm:p-8 space-y-6 border border-emerald-500/20 bg-gradient-to-b from-[#0a1518]/90 via-[#070e12]/95 to-[#07080e] shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(16,185,129,0.1)]">
        {user ? (
          /* Logged In View */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/60 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <img
                  src={user.user_metadata?.avatar_url || 'https://avatars.githubusercontent.com/u/256016032?v=4'}
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {user.user_metadata?.full_name || user.user_metadata?.user_name || 'Authenticated User'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                      Session Verified
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    UID: {user.id.slice(0, 12)}...
                  </p>
                </div>
              </div>

              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-emerald-500/20 hover:border-emerald-500/40 text-xs text-zinc-300 hover:text-emerald-300 font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-400' : ''}`} />
                <span>Sync Cache</span>
              </button>
            </div>

            {/* Insert Form */}
            <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="Insert a live record into Supabase PostgreSQL..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-black/80 border border-white/10 focus:border-emerald-400/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={addItemMutation.isPending || !title.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-['Orbitron',sans-serif] font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95"
              >
                {addItemMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Insert (TanStack Mutation)</span>
              </button>
            </form>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Records */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
                <span className="font-semibold text-zinc-200">Your Records in Database:</span>
                <span className="font-mono text-[11px]">{items.length} items</span>
              </div>

              {isItemsLoading ? (
                <div className="space-y-2">
                  <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
                  <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
                </div>
              ) : items.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-black/30 border border-white/5 space-y-1">
                  <p className="text-xs text-zinc-300 font-medium">No items yet</p>
                  <p className="text-[11px] text-zinc-500">Insert your first live record above!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() =>
                          toggleItemMutation.mutate({
                            id: item.id,
                            is_completed: !item.is_completed,
                          })
                        }
                        className="text-zinc-500 hover:text-white transition-colors shrink-0"
                      >
                        {item.is_completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <span
                        className={`text-xs truncate ${
                          item.is_completed ? 'line-through text-zinc-500' : 'text-zinc-200 font-medium'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteItemMutation.mutate(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Guest View */
          <div className="text-center py-8 space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold font-['Chakra_Petch',sans-serif] text-white tracking-tight">
                Live Supabase Authentication
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                Click below to sign in with GitHub via Supabase OAuth. Once verified, you will have your own isolated Row Level Security workspace to insert and manage live records!
              </p>
            </div>

            <button
              onClick={signInWithGithub}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-['Orbitron',sans-serif] font-bold text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Sign in with GitHub to Test Live</span>
            </button>

            <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5 font-mono pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict PostgreSQL Row Level Security (RLS)</span>
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
