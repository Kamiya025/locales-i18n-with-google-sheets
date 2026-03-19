"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"

export interface CloudProject {
  _id: string
  spreadsheetId: string
  title: string
  lastAccessedAt: string
}

export function useCloudHistory() {
  const { data: session } = useSession()

  const { data: cloudProjects = [], isLoading, refetch } = useQuery<CloudProject[]>({
    queryKey: ['cloud-history', session?.user?.email],
    queryFn: async () => {
      const resp = await fetch("/api/user/recent-projects")
      if (!resp.ok) {
        throw new Error("Failed to fetch cloud projects")
      }
      return resp.json()
    },
    enabled: !!session?.user?.email,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    cloudProjects,
    isLoading,
    refresh: refetch
  }
}
