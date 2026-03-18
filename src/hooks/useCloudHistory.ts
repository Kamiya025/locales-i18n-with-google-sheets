import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export interface CloudProject {
  _id: string
  spreadsheetId: string
  title: string
  lastAccessedAt: string
}

export function useCloudHistory() {
  const { data: session } = useSession()
  const [cloudProjects, setCloudProjects] = useState<CloudProject[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCloudProjects = async () => {
    if (!session?.user?.email) return
    
    setIsLoading(true)
    try {
      const resp = await fetch("/api/user/recent-projects")
      if (resp.ok) {
        const data = await resp.json()
        setCloudProjects(data)
      }
    } catch (error) {
      console.error("Error fetching cloud projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCloudProjects()
  }, [session])

  return {
    cloudProjects,
    isLoading,
    refresh: fetchCloudProjects
  }
}
