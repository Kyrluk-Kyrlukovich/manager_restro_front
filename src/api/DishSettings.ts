import {apiInstance} from "@/axios";

export function getDish(id) {
    return apiInstance.get(`/dish/${id}`)
}