import { IVideo } from "@/models/video";

export type  VideoFormData = Omit<IVideo , "_id">

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: unknown 
    headers?: Record<string, string>
}

class ApiClient {
    // 1. Private core method (handles the logic)
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> { 
        const { method = "GET", body, headers = {} } = options;
        
        const response = await fetch(`/api${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json", ...headers },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) throw new Error("API request failed");
        return response.json();
    }

    // 2. Public method (uses the private fetch)
    async getVideos() {
        // This 'uses' the private method, removing the error!
        return this.fetch("/videos"); 
    }


    async createVideo(videoData : VideoFormData) {
        return this.fetch("/videos", {
            method: "POST",
            body: videoData,
         });
    }
}

// 3. Export to ensure the class itself is 'used' by the app
export const apiClient = new ApiClient();

